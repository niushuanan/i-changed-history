import type { GameScenario } from "./reducer";
import type { DeviationClass, TimelineTurn } from "./schema";
import { getTimelineNode, type DecisionChapter } from "./timelinePlan";
import { buildWorldCanon } from "./worldCanon";
import { buildNarrativeContext } from "./narrativeContext";
import { CUSTOM_ACTION_MAX_LENGTH } from "./limits";

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
export type JsonRepairDetails = {
  expectedChapter?: TimelineTurn["chapter"];
  validationErrors?: readonly string[];
  patchOnly?: boolean;
  repairFields?: readonly string[];
};

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

function turnContract() {
  return {
    clientOwnedFields: ["chapter", "chapterName", "protagonistAge", "lifeStage", "yearLabel", "previousEcho", "generationSource"],
    derivedFromAiFields: ["immediateObjective", "baselineAnchor", "memorySummary"],
    requiredFields: ["headline", "narrative", "location", "role", "protagonistName", "timePressure", "causalBridge", "worldStateChange", "divergenceProof", "historicalAnchors", "choices", "causalLedger", "visualTone"],
    rules: {
      totalLength: "只返回 requiredFields，严格按 exactShapeExample 的字段顺序，完整 JSON 控制在 900 个汉字左右；不要输出解释",
      clientOwnedFields: "clientOwnedFields 和 derivedFromAiFields 都由客户端注入或从你的其他字段提取，禁止输出",
      protagonistName: "第一幕给主角一个符合时代与地域的固定姓名；续幕必须逐字等于 authoritativeProtagonist.name",
      narrative: "80-180 个汉字，绝不超过 180 字；用二至五句完整叙事交代三层信息，推荐三句，第二人称现在时。第一层交代著名史实局面或上一项决定如何造成当前局面；第二层写明真实人物、机构或阵营正在争夺什么及现场可见证据；第三层写清你能调动的身份或资源、必须决定什么、失败会立即失去什么",
      headline: "22 个汉字以内；必须与 recentScenes 最近三幕中的标题逐字不同",
      location: "28 个汉字以内；必须使用当时真实存在或时代可信的称谓。1900 年前禁止使用议事厅、会议室、办公室、指挥中心、新闻中心、发布厅、报告厅、展览厅、作战室、控制室、调度室等现代通用空间名，改用府署正堂、军帐、中军帐、行辕、馆驿、宫门、城楼、书院等符合史实的时代真实称谓",
      role: "24 个汉字以内；玩家此刻被历史人物认可的具体身份",
      causalBridge: "24-30 字的单个完整短句并以句号收尾；不要使用逗号或分号；不复述玩家选择，只写上次结果通过何种人物、命令、交通、制度或物件造成本幕局面",
      worldStateChange: "30 字以内；一句话只写当前架空时间线已经落地的最关键新事实，不得混入真实历史",
      divergenceProof: "42 字以内；一句话只写真实历史的对应结果，字段正文不要重复写‘真实历史中’，不得复述当前架空线；必须含至少一个可核验的真实人物、机构、地点或事件",
      timePressure: "24 个汉字以内；可感知的分钟、小时、天数或迫近事件",
      historicalAnchors: "2-4 个本幕实际出现的时代锚点，每项 32 字以内；优先真实人物、机构、地点、军队、法令、器物或著名事件，禁止只写抽象概念；输出前核对人物、机构与制度在目标年份仍在世、在任或确实存在，目标年份以 authoritativeTimelineNode.targetYear 为准；若因玩家正史改变则在 narrative 中说明",
      choices: "严格三个对象 A/B/C，分别使用 nudge/reform/rupture；每个 label 18-30 字，必须写明动作与对象，并以对象或明确结果收尾，禁止以“的、并、试图、计划、平衡、处理、推进”等悬空词结尾；只含 id、label、deviationClass、instantEcho、usesModernKnowledge、actionSpec；actionSpec 必须含 actor、action、target、deadline，四项合起来构成历史人物此刻真的能下达或执行的动作；usesModernKnowledge 只表示是否使用现代常识，不得与性格相关",
      instantEcho: "含 directResult、unexpectedCost、beneficiary、payer，每项 24 字以内",
      causalLedger: "最多三项，只写模型新增的普通因果，每项含 fact、causedByChapter、mustAffect，fact 与 mustAffect 控制在 28 字以内。客户端会优先注入 narrativeContext.activePlayerCanon；不要在这里机械复制玩家原文，活跃正史占满三项时返回空数组",
      visualTone: "ancient/exchange/print/revolution/industry/war/space/digital 之一",
      completeness: "每个短字段必须以完整短句收尾，宁可更短也不得在名词、动词或因果关系中间截断",
    },
    exactShapeExample: {
      headline: "本幕标题",
      narrative: "第二人称完整现场叙事",
      location: "具体地点",
      role: "具体角色",
      protagonistName: "沈砚",
      timePressure: "日落前",
      causalBridge: "上一结果通过具体媒介进入本幕的新社会冲突",
      worldStateChange: "上一选择已经造成的具体世界事实",
      divergenceProof: "只写实际发生的真实结果与直接后果",
      historicalAnchors: ["真实人物", "真实机构", "时代器物"],
      choices: [
        { id: "A", label: "具体行动", deviationClass: "nudge", usesModernKnowledge: false, actionSpec: { actor: "谁", action: "做什么", target: "对谁或什么", deadline: "何时前" }, instantEcho: { directResult: "结果", unexpectedCost: "代价", beneficiary: "受益者", payer: "承担者" } },
        { id: "B", label: "具体行动", deviationClass: "reform", usesModernKnowledge: true, actionSpec: { actor: "谁", action: "做什么", target: "对谁或什么", deadline: "何时前" }, instantEcho: { directResult: "结果", unexpectedCost: "代价", beneficiary: "受益者", payer: "承担者" } },
        { id: "C", label: "具体行动", deviationClass: "rupture", usesModernKnowledge: false, actionSpec: { actor: "谁", action: "做什么", target: "对谁或什么", deadline: "何时前" }, instantEcho: { directResult: "结果", unexpectedCost: "代价", beneficiary: "受益者", payer: "承担者" } },
      ],
      causalLedger: [{ fact: "因果事实", causedByChapter: 0, mustAffect: "后续对象" }], visualTone: "war",
    },
  };
}

const TURN_PROTOCOL: ChatMessage = {
  role: "system",
  content: JSON.stringify({
    protocol: "timeline_turn_v1",
    purpose: "生成一个由 DeepSeek 完整创作、可由客户端严格校验的历史幕次 JSON",
    outputContract: turnContract(),
  }),
};

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
    causalLedger: turn.causalLedger,
    causalBridge: turn.causalBridge,
    worldStateChange: turn.worldStateChange,
    divergenceProof: turn.divergenceProof,
    playerAuthored,
    canonStatus,
    causalMechanism,
  }));
}

function messages(payload: unknown): ChatMessage[] {
  return [SYSTEM, { role: "user", content: JSON.stringify(payload) }];
}

function turnMessages(payload: unknown): ChatMessage[] {
  return [SYSTEM, TURN_PROTOCOL, { role: "user", content: JSON.stringify(payload) }];
}

export function buildContinuationMessages(scenario: GameScenario, playedTurns: readonly PlayedTurn[], chapter: ContinuationChapter): ChatMessage[] {
  const narrativeContext = buildNarrativeContext(playedTurns, chapter);
  const protagonist = playedTurns[0]?.turn;
  const latestPlayerFact = narrativeContext.activePlayerCanon.at(-1);
  return turnMessages({
    task: `生成第 ${chapter} 节点。不要从预设类别、通用模板或固定章节槽中选题。请像历史小说家与反事实研究者一样，先在内部推演 narrativeContext 中全部决定的一阶、二阶和三阶后果，再自行选择其中最意外、最重大、同时最能由同一主角亲手介入的一处真实历史冲突。它必须是当前平行世界的重大转折点，而不是普通日常，也不是上一事件换标题后的机械续集。主角必须仍是 authoritativeProtagonist.name 本人，年龄必须等于 authoritativeTimelineNode.protagonistAge；可以升迁、失势、结盟、迁居或改变阵营，但禁止换身体、转生、意识接力和让后代替他行动。narrativeContext.lifeIndex 与 playerCanon 是全部不可撤销正史，逐项承认，不得否认、降级、反转或假设玩家失败。narrativeContext.activePlayerCanon 是本幕必须继续兑现的最近三幕玩家正史：worldStateChange 必须展示最近玩家正史已经造成的局面，causalBridge 必须写清它通过什么媒介抵达当前冲突；若 activePlayerCanon 非空，最新一条必须在 narrative、worldStateChange 或 causalBridge 中至少逐字写出一个核心人物、制度、地点、器物或动作名，不能只写“产生影响”；不要在 causalLedger 中机械抄写，客户端会权威注入原文。更早的玩家正史继续成立，但无需每幕重复点名。第 4 节点起，原始历史事件不得继续作为本幕主题、标题或当前任务，只能作为主角人生的因果源；本幕要由既有选择引发，却必须进入新的重要矛盾。允许留在同一地区，但最近三幕不能总围绕同一事件、同一敌人、同一任务；本幕标题不得与 recentScenes 最近三幕中的任何标题逐字相同。必须使用至少两个时代准确的真实人物、机构、地点、军队、法令或器物作为 historicalAnchors，并核对它们在 authoritativeTimelineNode.targetYear 仍在世、在任或确实存在；如果玩家正史改变了其命运，必须在 narrative 中交代。三个选择都必须是当前角色能在明确期限内执行的命令、交易、部署、公开表态、任免或具体操作，不得写抽象政策口号。第 12 节点是主角晚年的最后重大决定，但本幕只提供选择，不提前写他死亡。输出前逐项确认 requiredFields 全部存在，尤其不得遗漏 timePressure、historicalAnchors 与三个 choices。`,
    ...scenarioPayload(scenario),
    authoritativeTimelineNode: getTimelineNode(chapter, scenario.seed.year),
    authoritativeProtagonist: { name: protagonist?.protagonistName, sameBodyThroughAllTwelveNodes: true, previousAge: playedTurns.at(-1)?.turn.protagonistAge, previousRole: playedTurns.at(-1)?.turn.role },
    narrativeContext,
    latestPlayerFactForThisScene: latestPlayerFact ? {
      status: "已经发生，不可否认或弱化",
      sourceText: latestPlayerFact.sourceText,
      requiredVisibleEffect: "必须在 narrative、worldStateChange 或 causalBridge 中明确写出这个事实的核心制度、人物、器物、地点或动作已经造成了什么",
    } : null,
    openInferenceRules: {
      modelOwnsNextConflict: true,
      noPresetCategories: true,
      mustRemainCausallyDownstream: true,
      requiredHistoricalAnchors: 2,
      recentScenesToAvoidRepeating: narrativeContext.recentScenes,
    },
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
      causalLedger: turn.causalLedger,
    },
    playerDeclaredOutcome: action,
    outputContract: {
      requiredFields: ["declaredOutcome", "canonStatus", "causalMechanism", "deviationClass", "instantEcho"],
      declaredOutcome: `必须与 playerDeclaredOutcome 完全一致，2-${CUSTOM_ACTION_MAX_LENGTH} 个汉字，不得改写成败关系`,
      canonStatus: "固定为 玩家钦定",
      causalMechanism: "56 个汉字以内，说明既成结果通过命令、消息、法律、市场、迁徙或其他具体媒介进入社会",
      deviationClass: "nudge/reform/rupture 之一",
      instantEcho: `含 directResult、unexpectedCost、beneficiary、payer；directResult 必须逐字复制 playerDeclaredOutcome，可到 ${CUSTOM_ACTION_MAX_LENGTH} 字，其余每项 24 字以内`,
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
    task: "十二次选择已经结束。只为同一个穿越者写一份完整人物列传：白话文与文言文各一版，都要贯穿十二次选择、身份变化、所得、代价与死亡，不得写成十二条摘要的拼接。lifeRecord 是不可撤销正史，必须承认每次玩家选择。historyTimeline.playerChoice 由客户端按 lifeRecord 决定权威注入，模型可原样输出但不必在 consequence 中机械重复长原句；consequence 只写该决定造成的具体后果，绝不能否定玩家钦定事实。不得加入性格、人格或测试结论，不得让主角活到 2026。只输出人物报告字段，不要输出世界报告字段。",
    historyMoment: scenarioPayload(scenario).historyMoment,
    lifeRecord: endingLifeRecord(playedTurns),
    outputContract: {
      requiredFields: ["vernacularBiography", "classicalBiography", "protagonistName", "lifespanSummary", "deathScene", "historyTimeline"],
      vernacularBiography: "720 字以内的完整白话人物列传，必须串起十二次决定、身份变化、所得与代价，并以主角死亡和完整句号收束",
      classicalBiography: "520 字以内的文言人物列传，体例接近史传，有名、事、论，必须覆盖其一生关键转折并以完整句号收束",
      protagonistName: `必须逐字等于 ${playedTurns[0]?.turn.protagonistName ?? "第一幕主角姓名"}`,
      lifespanSummary: "用一个完整短句概括主角一生，并以句号、问号或叹号收尾",
      deathScene: "含 yearLabel、age、place、finalMoment、lastingLegacy；年龄和年份承接第十二幕，明确主角自然或因其人生代价而死亡；finalMoment 与 lastingLegacy 都必须是完整句并以句号、问号或叹号收尾",
      historyTimeline: "恰好十二项，每项含 chapter、yearLabel、playerChoice、consequence；playerChoice 可由客户端权威覆盖，consequence 用以句号、问号或叹号收尾的完整短句写具体后果，且不得否定对应选择，不必重复 playerChoice 原句",
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
      posthumousChronicle: "恰好四项，每项含 period、title、narrative、inheritedChange；从主角死后到 2026 逐步拉长时间。每项 narrative 为 35-96 个汉字，写清一个完整时代变化；inheritedChange 为 18-64 个汉字，写清继承到下一时代的具体结果。两者都必须以完整句号、问号或叹号收尾，不得截断句子来满足字数",
      causalChains: "恰好三项，每项含 origin、transformation、payoff",
      ordinaryLife2026: "恰好三个互不重复的具体生活细节，每项 12—18 字的完整生活短句，写成普通人可感知的一件事；每项必须以完整句号、问号或叹号收尾，不得停在半句话中",
      closingPassage: "90-180 个汉字的完整小说式尾声，以完整句号、问号或叹号收尾；明确主角没看到 2026，但世界仍活在他的选择之后，不得截断句子来满足字数",
      plausibilityScore: "0-100 数值",
      plausibilityReason: "用完整句解释可信度，并以句号、问号或叹号收尾",
      shareLine: "用第一人称完整句概括这次改史，并以句号、问号或叹号收尾",
    },
  });
}

export function getPlayedTurnChoiceText(turn: PlayedTurn): string { return turn.selectedChoiceLabel; }

export function buildJsonRepairMessages(raw: string, target: RepairTarget, details: JsonRepairDetails = {}): ChatMessage[] {
  const payload = { task: "修复下面的模型输出，只修正 JSON 结构与字段类型，不改变事实和玩家选择。", target, details, invalidOutput: raw };
  return target === "timeline_turn" ? turnMessages(payload) : messages(payload);
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

  const repairPayload = {
    task: details.patchOnly
      ? "上一输出只有部分字段校验失败。只返回一个仅含 repairFields 所列根字段的 JSON 对象；不要复述或改写其他字段。修复字段必须与原场景、权威历史和玩家决定一致。"
      : "上一输出校验失败。只修正列出的结构问题，保留原有历史事实与玩家决定，只返回 JSON。",
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
    outputContract: target === "timeline_turn" ? turnContract() : payload.outputContract,
    invalidOutput: raw,
  };
  return target === "timeline_turn" ? turnMessages(repairPayload) : messages(repairPayload);
}
