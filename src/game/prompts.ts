import type { GameScenario } from "./reducer";
import type { DeviationClass, TimelineTurn } from "./schema";
import { getTimelineNode, type DecisionChapter } from "./timelinePlan";
import { buildWorldCanon } from "./worldCanon";
import { buildNarrativeContext } from "./narrativeContext";

export type ChatMessage = Readonly<{ role: "system" | "user"; content: string }>;
export type PlayedTurn = {
  turn: TimelineTurn;
  selectedChoiceId: "A" | "B" | "C" | "custom";
  selectedChoiceLabel: string;
  selectedDeviationClass: DeviationClass;
  resolvedEcho: NonNullable<TimelineTurn["previousEcho"]>;
  playerAuthored?: boolean;
  canonStatus?: "玩家钦定";
  causalMechanism?: string;
};
type ContinuationChapter = Exclude<DecisionChapter, 1>;
type RepairTarget = "timeline_turn" | "biography_report" | "world_report" | "custom_action";
export type JsonRepairDetails = { expectedChapter?: TimelineTurn["chapter"]; validationErrors?: readonly string[] };

export const TIMELINE_SYSTEM_PROMPT = [
  "你是《哎！我改变了历史？》的结构化即兴历史推演引擎。",
  "玩家是带着现代经验穿越到真实历史瞬间的中国人。使用第二人称、现在时，让玩家看到真实人物、地点、物件和迫近的时间限制。",
  "所有后果必须由历史事实或玩家真实选择推导；每幕同时呈现收益、代价、受益者与承担者。",
  "十二幕都必须是这条平行时间线中的重大转折点，不得用普通工作与日常记录填充节点。不要从预设题材、七类模板或固定剧情槽中选题；请根据完整因果账本自行推演下一处最值得玩家决定的历史冲突。",
  "玩家已经完成的选择组成不可撤销正史。尤其是玩家钦定结果：不得否认、降级、反转或假设失败，必须在其后三幕持续兑现为具体世界事实。",
  "三个选项必须是当场能执行的具体动作，写清行动者、动作、对象和期限，恰好覆盖 nudge、reform、rupture。禁止套用人格、职业或剧情模板，禁止使用“重写规则”“稳步推进”“交给新联盟”等抽象概括代替行动。",
  "十二幕必须始终是同一个有姓名、会衰老的人。可以改变职位、阵营和城市，但绝不能换身体、转生、意识接力或让后代替玩家行动。",
  "第三幕以后，开场事件只能作为因果源，不能继续垄断标题与任务；同一个主角要沿亲手造成的后果进入新的重大冲突。",
  "蝴蝶效应的惊奇来自事件线、矛盾线和社会载体的变化，不来自机械地跨国或跨洲；地域可以连续，原始事件不能垄断后续历史。",
  "面向中国玩家，优先使用其熟悉的真实人物、制度、城市、典故与生活经验作锚点，用自然中文叙述，不用生僻分期术语制造深奥感。",
  "只输出一个可被 JSON.parse 解析的 JSON 对象，不要 Markdown、代码围栏、解释或思考过程。",
  "不得输出历史偏离度，客户端会自行计算。",
].join("\n");

const SYSTEM: ChatMessage = { role: "system", content: TIMELINE_SYSTEM_PROMPT };

function scenarioPayload(scenario: GameScenario) {
  return {
    playerContract: "玩家是现代中国人，但没有固定人格、职业或超能力；只能依靠常识、信息差和当前身份拥有的资源介入历史。",
    historyMoment: {
      id: scenario.seed.id,
      date: scenario.seed.dateLabel,
      eventName: scenario.seed.eventName,
      location: scenario.seed.location,
      assignedRole: scenario.seed.role,
      immediateDecision: scenario.seed.decision,
      urgency: scenario.seed.urgency,
      actualHistory: scenario.seed.historicalOutcome,
      verifiedFacts: scenario.seed.baselineFacts,
      visualTone: scenario.seed.visualTone,
      perspective: scenario.seed.perspective,
    },
    audienceContext: "中国玩家；先给熟悉的真实历史锚点，再给反直觉但有因果依据的变化",
  };
}

function turnContract(chapter: TimelineTurn["chapter"]) {
  return {
    clientOwnedFields: ["chapter", "chapterName", "protagonistAge", "lifeStage", "yearLabel", "previousEcho", "metrics", "metricDeltas", "callbackUsed"],
    requiredFields: ["timelineName", "protagonistName", "location", "role", "identityBridge", "modernAdvantage", "rippleLens", "causalBridge", "turningPointStakes", "worldStateChange", "divergenceProof", "immediateObjective", "timePressure", "headline", "narrative", "baselineAnchor", "historicalAnchors", "choices", "memorySummary", "causalLedger", "visualTone"],
    rules: {
      totalLength: "只返回 requiredFields，完整 JSON 控制在 1200 个汉字左右；玩家可见文案必须是短句",
      clientOwnedFields: "这些字段由客户端注入，禁止输出，避免重复与冲突",
      protagonistName: chapter === 1 ? "2-16 个汉字；给主角一个符合时代与地域的固定姓名" : "必须逐字等于 authoritativeProtagonist.name",
      narrative: "56 个汉字以内；第二人称现在时；出现至少一个真实人物和一个可见物件",
      headline: "22 个汉字以内",
      location: "28 个汉字以内",
      role: "24 个汉字以内；玩家此刻被历史人物认可的具体身份",
      identityBridge: chapter === 1 ? "36 字以内；解释现代意识如何进入主角此后唯一的一生" : "36 字以内；说明同一主角如何从上一职位走到当前职位，禁止接棒或换人",
      modernAdvantage: "36 字以内；说明现代常识或信息差在当前身份的具体用处，不得套用人格、职业或超能力",
      rippleLens: "根据本幕真正受影响的社会载体自行选择，不得按固定轮次或模板选择",
      causalBridge: chapter === 1 ? "44 字以内；说明玩家决定如何成为时间线源头" : "44 字以内；明确写出上次结果通过何种媒介传到本幕新冲突",
      turningPointStakes: "44 字以内；说明本幕将不可逆地决定的重大秩序与主要受影响者",
      worldStateChange: chapter === 1 ? "44 字以内；指出玩家介入首先改变的事实" : "44 字以内；把上一项选择写成已经落地的世界事实",
      divergenceProof: "56 字以内；用真实历史与当前时间线的可核验对照证明已经不同",
      immediateObjective: "28 个汉字以内；这一幕必须在现场完成的单一目标",
      timePressure: "24 个汉字以内；可感知的分钟、小时、天数或迫近事件",
      baselineAnchor: "54 个汉字以内的真实历史锚点",
      historicalAnchors: "2-4 个本幕实际出现的时代锚点，每项 32 字以内；优先真实人物、机构、地点、军队、法令、器物或著名事件，禁止只写抽象概念",
      choices: "严格三个对象 A/B/C，分别使用 nudge/reform/rupture；每个 label 22 字以内、intent 24 字以内；含 deviationClass、instantEcho、usesModernKnowledge、actionSpec；actionSpec 必须含 actor、action、target、deadline，四项合起来构成历史人物此刻真的能下达或执行的动作；usesModernKnowledge 只表示是否使用现代常识，不得与性格相关",
      instantEcho: "含 directResult、unexpectedCost、beneficiary、payer，每项 24 字以内",
      causalLedger: "最多三项，只保留后续仍会生效的因果；每项含 fact、causedByChapter、mustAffect。普通 fact 与 mustAffect 控制在 28 字以内；玩家钦定章节的 fact 必须逐字复制 sourceText，可到 80 字，绝不缩写",
      visualTone: "ancient/exchange/print/revolution/industry/war/space/digital 之一",
    },
    exactShapeExample: {
      timelineName: "示例线名", protagonistName: "沈砚", location: "具体地点",
      role: "具体角色", immediateObjective: "当场目标", timePressure: "倒计时",
      identityBridge: "同一主角如何走到当前身份", modernAdvantage: "现代常识在当前身份的具体用处",
      rippleLens: "power", causalBridge: "上一结果通过具体媒介进入本幕的新社会冲突",
      turningPointStakes: "本幕将决定的重大秩序与受影响者",
      worldStateChange: "上一选择已经造成的具体世界事实",
      divergenceProof: "真实历史与当前时间线的明确差异",
      headline: "本幕标题", narrative: "第二人称现场叙事", baselineAnchor: "真实历史锚点", historicalAnchors: ["真实人物", "真实机构", "时代器物"],
      choices: [
        { id: "A", label: "具体行动", intent: "怎样行动", deviationClass: "nudge", usesModernKnowledge: false, actionSpec: { actor: "谁", action: "做什么", target: "对谁或什么", deadline: "何时前" }, instantEcho: { directResult: "结果", unexpectedCost: "代价", beneficiary: "受益者", payer: "承担者" } },
        { id: "B", label: "具体行动", intent: "怎样行动", deviationClass: "reform", usesModernKnowledge: true, actionSpec: { actor: "谁", action: "做什么", target: "对谁或什么", deadline: "何时前" }, instantEcho: { directResult: "结果", unexpectedCost: "代价", beneficiary: "受益者", payer: "承担者" } },
        { id: "C", label: "具体行动", intent: "怎样行动", deviationClass: "rupture", usesModernKnowledge: false, actionSpec: { actor: "谁", action: "做什么", target: "对谁或什么", deadline: "何时前" }, instantEcho: { directResult: "结果", unexpectedCost: "代价", beneficiary: "受益者", payer: "承担者" } },
      ],
      memorySummary: "本幕摘要",
      causalLedger: [{ fact: "因果事实", causedByChapter: 0, mustAffect: "后续对象" }], visualTone: "war",
    },
  };
}

function selectedHistory(playedTurns: readonly PlayedTurn[]) {
  return playedTurns.map(({ turn, selectedChoiceId, selectedChoiceLabel, selectedDeviationClass, resolvedEcho, playerAuthored, canonStatus, causalMechanism }) => ({
    chapter: turn.chapter,
    yearLabel: turn.yearLabel,
    selectedChoiceId,
    selectedChoiceLabel,
    selectedDeviationClass,
    instantEcho: resolvedEcho,
    memorySummary: turn.memorySummary,
    role: turn.role,
    protagonistName: turn.protagonistName,
    protagonistAge: turn.protagonistAge,
    lifeStage: turn.lifeStage,
    location: turn.location,
    headline: turn.headline,
    identityBridge: turn.identityBridge,
    causalLedger: turn.causalLedger,
    rippleLens: turn.rippleLens,
    causalBridge: turn.causalBridge,
    turningPointStakes: turn.turningPointStakes,
    worldStateChange: turn.worldStateChange,
    divergenceProof: turn.divergenceProof,
    playerAuthored,
    canonStatus,
    causalMechanism,
    metrics: turn.metrics,
  }));
}

function messages(payload: unknown): ChatMessage[] {
  return [SYSTEM, { role: "user", content: JSON.stringify(payload) }];
}

export function buildOpeningMessages(scenario: GameScenario): ChatMessage[] {
  return messages({ task: "生成第一节点。玩家刚穿越落地，必须立即理解主角姓名、年龄、身份、身处哪个著名历史瞬间、这一分钟要阻止或促成什么。这个姓名和身体将持续整整十二幕，第一节点必须是决定真实历史走向的重大转折点。", ...scenarioPayload(scenario), authoritativeTimelineNode: getTimelineNode(1, scenario.seed.year), outputContract: turnContract(1) });
}

export function buildContinuationMessages(scenario: GameScenario, playedTurns: readonly PlayedTurn[], chapter: ContinuationChapter): ChatMessage[] {
  const narrativeContext = buildNarrativeContext(playedTurns);
  const protagonist = playedTurns[0]?.turn;
  return messages({
    task: `生成第 ${chapter} 节点。不要从预设类别、通用模板或固定章节槽中选题。请像历史小说家与反事实研究者一样，先在内部推演 narrativeContext 中全部决定的一阶、二阶和三阶后果，再自行选择其中最意外、最重大、同时最能由同一主角亲手介入的一处真实历史冲突。它必须是当前平行世界的重大转折点，而不是普通日常，也不是上一事件换标题后的机械续集。主角必须仍是 authoritativeProtagonist.name 本人，年龄必须等于 authoritativeTimelineNode.protagonistAge；可以升迁、失势、结盟、迁居或改变阵营，但禁止换身体、转生、意识接力和让后代替他行动。narrativeContext.lifeIndex 是全部不可撤销正史，逐项承认，不得否认、降级、反转或假设玩家失败。对 narrativeContext.playerCanon 的每项玩家正史：causalLedger 对应 causedByChapter 的 fact 必须逐字等于 sourceText；可见场景必须继续呈现其具体后果。第 4 节点起，原始历史事件不得继续作为本幕主题、标题或当前任务，只能作为主角人生的因果源；本幕要由既有选择引发，却必须进入新的重要矛盾。允许留在同一地区，但最近三幕不能总围绕同一事件、同一敌人、同一任务。必须使用至少两个时代准确的真实人物、机构、地点、军队、法令或器物作为 historicalAnchors。三个选择都必须是当前角色能在明确期限内执行的命令、交易、部署、公开表态、任免或具体操作，不得写抽象政策口号。第 12 节点是主角晚年的最后重大决定，但本幕只提供选择，不提前写他死亡。`,
    ...scenarioPayload(scenario),
    authoritativeTimelineNode: getTimelineNode(chapter, scenario.seed.year),
    authoritativeProtagonist: { name: protagonist?.protagonistName, sameBodyThroughAllTwelveNodes: true, previousAge: playedTurns.at(-1)?.turn.protagonistAge, previousRole: playedTurns.at(-1)?.turn.role },
    narrativeContext,
    openInferenceRules: {
      modelOwnsNextConflict: true,
      noPresetCategories: true,
      mustRemainCausallyDownstream: true,
      requiredHistoricalAnchors: 2,
      recentScenesToAvoidRepeating: narrativeContext.recentScenes,
    },
    outputContract: turnContract(chapter),
  });
}

export function buildCustomActionMessages(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  turn: TimelineTurn,
  action: string,
): ChatMessage[] {
  return messages({
    task: "玩家正在直接写入一条新的历史结果。playerDeclaredOutcome 是已经发生的既成事实，不是行动申请。你无权判断可行性，不得改变它写明的成功或失败，不得把完成时改成尝试。必须逐字保留结果的成败关系，只推演它如何进入社会、产生什么意外代价、谁受益、谁承担。causalMechanism、unexpectedCost、beneficiary、payer 也不得暗示该结果其实失败、未遂、未发生或反向成功。不得加入任何性格或人格解释。",
    ...scenarioPayload(scenario),
    playedHistory: selectedHistory(playedTurns),
    currentScene: {
      chapter: turn.chapter,
      yearLabel: turn.yearLabel,
      location: turn.location,
      role: turn.role,
      immediateObjective: turn.immediateObjective,
      timePressure: turn.timePressure,
      availableModernKnowledge: turn.modernAdvantage,
      causalLedger: turn.causalLedger,
    },
    playerDeclaredOutcome: action,
    outputContract: {
      requiredFields: ["declaredOutcome", "canonStatus", "causalMechanism", "deviationClass", "instantEcho"],
      declaredOutcome: "必须与 playerDeclaredOutcome 完全一致，2-80 个汉字，不得改写成败关系",
      canonStatus: "固定为 玩家钦定",
      causalMechanism: "56 个汉字以内，说明既成结果通过命令、消息、法律、市场、迁徙或其他具体媒介进入社会",
      deviationClass: "nudge/reform/rupture 之一",
      instantEcho: "含 directResult、unexpectedCost、beneficiary、payer；directResult 必须逐字复制 playerDeclaredOutcome，可到 80 字，其余每项 24 字以内",
    },
  });
}

function endingLifeRecord(playedTurns: readonly PlayedTurn[]) {
  return playedTurns.map((played) => ({
    chapter: played.turn.chapter,
    yearLabel: played.turn.yearLabel,
    age: played.turn.protagonistAge,
    name: played.turn.protagonistName,
    role: played.turn.role,
    location: played.turn.location,
    decision: played.selectedChoiceLabel,
    directResult: played.resolvedEcho.directResult,
    unexpectedCost: played.resolvedEcho.unexpectedCost,
    beneficiary: played.resolvedEcho.beneficiary,
    payer: played.resolvedEcho.payer,
    playerAuthored: played.playerAuthored === true || played.selectedChoiceId === "custom",
  }));
}

export function buildBiographyMessages(scenario: GameScenario, playedTurns: readonly PlayedTurn[]): ChatMessage[] {
  return messages({
    task: "十二次选择已经结束。只为同一个穿越者写一份完整人物列传：白话文与文言文各一版，都要贯穿十二次选择、身份变化、所得、代价与死亡，不得写成十二条摘要的拼接。lifeRecord 是不可撤销正史，必须保留每次玩家选择；playerAuthored 为 true 的选择必须逐字进入对应 historyTimeline.consequence。不得加入性格、人格或测试结论，不得让主角活到 2026。只输出人物报告字段，不要输出世界报告字段。",
    historyMoment: scenarioPayload(scenario).historyMoment,
    lifeRecord: endingLifeRecord(playedTurns),
    outputContract: {
      requiredFields: ["vernacularBiography", "classicalBiography", "protagonistName", "lifespanSummary", "deathScene", "historyTimeline"],
      vernacularBiography: "720 字以内的完整白话人物列传，必须串起十二次决定、身份变化、所得与代价，并以主角死亡收束",
      classicalBiography: "520 字以内的文言人物列传，体例接近史传，有名、事、论，必须覆盖其一生关键转折",
      protagonistName: `必须逐字等于 ${playedTurns[0]?.turn.protagonistName ?? "第一幕主角姓名"}`,
      deathScene: "含 yearLabel、age、place、finalMoment、lastingLegacy；年龄和年份承接第十二幕，明确主角自然或因其人生代价而死亡",
      historyTimeline: "恰好十二项，每项含 chapter、yearLabel、playerChoice、consequence；玩家钦定项的 consequence 必须逐字包含对应 playerChoice",
    },
  });
}

export function buildWorldReportMessages(scenario: GameScenario, playedTurns: readonly PlayedTurn[]): ChatMessage[] {
  return messages({
    task: "十二次选择已经结束。只推演主角死后到 2026 年的平行世界：他的决定被继承、误读、争夺和制度化，最终落到普通人的具体生活。worldCanon 与 lifeIndex 是不可撤销正史；所有玩家钦定结果都必须继续成立。写成一页可读完的小说后续，不得把 2026 写成第十三个玩家节点，不得让主角活到 2026，不得加入性格或人格结论。只输出世界报告字段，不要输出人物列传字段。",
    historyMoment: scenarioPayload(scenario).historyMoment,
    endingContext: {
      lifeIndex: buildNarrativeContext(playedTurns).lifeIndex,
      playerCanon: buildNarrativeContext(playedTurns).playerCanon,
      worldCanon: { status: "不可撤销正史", ...buildWorldCanon(playedTurns) },
    },
    outputContract: {
      requiredFields: ["worldName", "frontPageHeadline", "posthumousChronicle", "causalChains", "ordinaryLife2026", "closingPassage", "greatestGain", "hiddenPrice", "strangestDetail", "biggestBeneficiary", "biggestLoser", "rewriteLevel", "plausibilityScore", "plausibilityReason", "shareLine"],
      posthumousChronicle: "恰好四项，每项含 period、title、narrative、inheritedChange；每个字段都用短句，从主角死后到 2026 逐步拉长时间，展示遗产如何变形",
      causalChains: "恰好三项，每项含 origin、transformation、payoff",
      ordinaryLife2026: "恰好三个具体生活细节，每项 36 字以内",
      closingPassage: "180 字以内的小说式尾声，明确主角没看到 2026，但世界仍活在他的选择之后",
      plausibilityScore: "0-100 数值",
    },
  });
}

export function getPlayedTurnChoiceText(turn: PlayedTurn): string { return turn.selectedChoiceLabel; }

export function buildJsonRepairMessages(raw: string, target: RepairTarget, details: JsonRepairDetails = {}): ChatMessage[] {
  return messages({ task: "修复下面的模型输出，只修正 JSON 结构与字段类型，不改变事实和玩家选择。", target, details, invalidOutput: raw });
}

export function buildContextualJsonRepairMessages(original: readonly ChatMessage[], raw: string, target: RepairTarget, details: JsonRepairDetails = {}): ChatMessage[] {
  const originalPayload = [...original].reverse().find((message) => message.role === "user");
  let payload: Record<string, unknown> = {};
  try {
    const parsed = originalPayload ? JSON.parse(originalPayload.content) : {};
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) payload = parsed;
  } catch {
    payload = {};
  }
  const narrativeContext = typeof payload.narrativeContext === "object" && payload.narrativeContext !== null
    ? payload.narrativeContext as Record<string, unknown>
    : null;

  return messages({
    task: "上一输出校验失败。只修正列出的结构问题，保留原有历史事实与玩家决定，只返回 JSON。",
    target,
    details,
    authoritative: {
      historyMoment: payload.historyMoment,
      authoritativeTimelineNode: payload.authoritativeTimelineNode,
      authoritativeProtagonist: payload.authoritativeProtagonist,
      playerCanon: narrativeContext?.playerCanon,
      playerDeclaredOutcome: payload.playerDeclaredOutcome,
      lifeRecord: payload.lifeRecord,
      endingContext: payload.endingContext,
    },
    outputContract: payload.outputContract,
    invalidOutput: raw,
  });
}
