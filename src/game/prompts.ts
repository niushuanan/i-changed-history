import type { GameScenario } from "./reducer";
import { getTravelerAbility } from "./profile";
import type { DeviationClass, TimelineTurn } from "./schema";
import { CHAPTER_NAMES, JUMP_LABELS, getTimelineNode, type DecisionChapter } from "./timelinePlan";
import type { RippleLens } from "./rippleRouter";
import { buildPivotalBrief, buildWorldCanon } from "./worldCanon";

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
type RepairTarget = "timeline_turn" | "alternate_present" | "custom_action";
export type JsonRepairDetails = { expectedChapter?: TimelineTurn["chapter"]; validationErrors?: readonly string[] };

export const TIMELINE_SYSTEM_PROMPT = [
  "你是《I！我改变了历史》的结构化即兴历史推演引擎。",
  "玩家是带着现代经验穿越到真实历史瞬间的中国人。使用第二人称、现在时，让玩家看到真实人物、地点、物件和迫近的时间限制。",
  "所有后果必须由历史事实或玩家真实选择推导；每幕同时呈现收益、代价、受益者与承担者。",
  "十二幕都必须是这条平行时间线中的重大转折点：决定政权、战争、制度、技术、贸易、知识或公共秩序，不得用普通工作与日常记录填充节点。",
  "玩家已经完成的选择组成不可撤销正史。尤其是玩家钦定结果：不得否认、降级、反转或假设失败，必须在其后三幕持续兑现为具体世界事实。",
  "三个选项必须是当场能执行的具体动作，恰好覆盖 nudge、reform、rupture，至少一个要能使用穿越者画像中的能力。",
  "十二幕必须始终是同一个有姓名、会衰老的人。可以改变职位、阵营和城市，但绝不能换身体、转生、意识接力或让后代替玩家行动。",
  "第三幕以后，开场事件只能作为因果源，不能继续垄断标题与任务；同一个主角要沿亲手造成的后果进入新的重大冲突。",
  "蝴蝶效应的惊奇来自事件线、矛盾线和社会载体的变化，不来自机械地跨国或跨洲；地域可以连续，原始事件不能垄断后续历史。",
  "面向中国玩家，优先使用其熟悉的真实人物、制度、城市、典故与生活经验作锚点，用自然中文叙述，不用生僻分期术语制造深奥感。",
  "只输出一个可被 JSON.parse 解析的 JSON 对象，不要 Markdown、代码围栏、解释或思考过程。",
  "不得输出历史偏离度，客户端会自行计算。",
].join("\n");

const SYSTEM: ChatMessage = { role: "system", content: TIMELINE_SYSTEM_PROMPT };

function scenarioPayload(scenario: GameScenario) {
  const ability = getTravelerAbility(scenario.profile);
  return {
    traveler: {
      ...scenario.profile,
      gameplayRules: {
        archetype: ability.title,
        dedicatedChoice: ability.action,
        causalPreview: ability.preview,
        freeAction: ability.customAction,
        directive: ability.promptDirective,
      },
    },
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

function turnContract(chapter: TimelineTurn["chapter"], rippleLens: RippleLens = "origin") {
  return {
    requiredFields: ["timelineName", "chapter", "chapterName", "protagonistName", "protagonistAge", "lifeStage", "yearLabel", "location", "role", "identityBridge", "profileAdvantage", "rippleLens", "causalBridge", "turningPointStakes", "worldStateChange", "divergenceProof", "immediateObjective", "timePressure", "headline", "narrative", "baselineAnchor", "previousEcho", "choices", "memorySummary", "metrics", "metricDeltas", "causalLedger", "callbackUsed", "visualTone"],
    rules: {
      totalLength: "总输出控制在 700 个汉字以内，宁可短句，不得省略字段",
      chapter,
      chapterName: CHAPTER_NAMES[chapter],
      protagonistName: chapter === 1 ? "2-16 个汉字；给主角一个符合时代与地域的固定姓名" : "必须逐字等于 authoritativeProtagonist.name",
      protagonistAge: "必须等于 authoritativeTimelineNode.protagonistAge",
      lifeStage: "必须等于 authoritativeTimelineNode.lifeStage",
      narrative: "60 个汉字以内；第二人称现在时；出现至少一个真实人物和一个可见物件",
      headline: "22 个汉字以内",
      location: "28 个汉字以内",
      role: "24 个汉字以内；玩家此刻被历史人物认可的具体身份",
      identityBridge: chapter === 1 ? "36 字以内；解释现代意识如何进入主角此后唯一的一生" : "36 字以内；说明同一主角如何从上一职位走到当前职位，禁止接棒或换人",
      profileAdvantage: "36 字以内；必须具体说明 traveler.gameplayRules.directive 如何帮助主角当前身份，不得泛称现代能力",
      rippleLens: `必须为 ${rippleLens}，不得自行更换社会载体`,
      causalBridge: chapter === 1 ? "54 字以内；说明玩家决定如何成为时间线源头" : "54 字以内；明确写出上次结果通过何种媒介传到本幕新冲突",
      turningPointStakes: "54 字以内；说明本幕将不可逆地决定哪种政权、战争、制度、技术或文明秩序，以及主要受影响者",
      worldStateChange: chapter === 1 ? "72 字以内；指出玩家一旦介入将首先改变的事实" : "72 字以内；把上一项玩家选择写成已经落地的具体世界事实，不得只复述行动",
      divergenceProof: "72 字以内；用“真实历史如何、当前时间线如何”的可核验对照证明历史已经不同",
      immediateObjective: "28 个汉字以内；这一幕必须在现场完成的单一目标",
      timePressure: "24 个汉字以内；可感知的分钟、小时、天数或迫近事件",
      baselineAnchor: "54 个汉字以内的真实历史锚点",
      choices: "严格三个对象 A/B/C，分别使用 nudge/reform/rupture；每个 label 22 字以内、intent 24 字以内；含 deviationClass、instantEcho、usesTravelerStrength；恰好一个 usesTravelerStrength 为 true，且该行动必须具体体现 traveler.gameplayRules.directive",
      instantEcho: "含 directResult、unexpectedCost、beneficiary、payer，每项 24 字以内",
      previousEcho: chapter === 1 ? "必须为 null" : "完整承接上一选择即时回响",
      metrics: "stability、prosperity、freedom、cost，均为 0-100 数值",
      metricDeltas: "与 metrics 相同四键的数值变化",
      causalLedger: "最多三项，只保留后续仍会生效的因果；每项含 fact、causedByChapter、mustAffect。普通 fact 与 mustAffect 控制在 28 字以内；玩家钦定章节的 fact 必须逐字复制 sourceText，可到 80 字，绝不缩写",
      callbackUsed: "null 或字符串",
      visualTone: "ancient/exchange/print/revolution/industry/war/space/digital 之一",
    },
    exactShapeExample: {
      timelineName: "示例线名", chapter, chapterName: CHAPTER_NAMES[chapter], protagonistName: "沈砚", protagonistAge: 24, lifeStage: JUMP_LABELS[chapter - 1], yearLabel: "具体年月日 · 24岁", location: "具体地点",
      role: "具体角色", immediateObjective: "当场目标", timePressure: "倒计时",
      identityBridge: "同一主角如何走到当前身份", profileAdvantage: "现代画像在当前身份的具体用处",
      rippleLens, causalBridge: "上一结果通过具体媒介进入本幕的新社会冲突",
      turningPointStakes: "本幕将决定的重大秩序与受影响者",
      worldStateChange: "上一选择已经造成的具体世界事实",
      divergenceProof: "真实历史与当前时间线的明确差异",
      headline: "本幕标题", narrative: "第二人称现场叙事", baselineAnchor: "真实历史锚点",
      previousEcho: chapter === 1 ? null : { directResult: "上次直接结果", unexpectedCost: "上次意外代价", beneficiary: "受益者", payer: "承担者" },
      choices: [
        { id: "A", label: "具体行动", intent: "怎样行动", deviationClass: "nudge", usesTravelerStrength: false, instantEcho: { directResult: "结果", unexpectedCost: "代价", beneficiary: "受益者", payer: "承担者" } },
        { id: "B", label: "具体行动", intent: "怎样行动", deviationClass: "reform", usesTravelerStrength: true, instantEcho: { directResult: "结果", unexpectedCost: "代价", beneficiary: "受益者", payer: "承担者" } },
        { id: "C", label: "具体行动", intent: "怎样行动", deviationClass: "rupture", usesTravelerStrength: false, instantEcho: { directResult: "结果", unexpectedCost: "代价", beneficiary: "受益者", payer: "承担者" } },
      ],
      memorySummary: "本幕摘要", metrics: { stability: 50, prosperity: 50, freedom: 50, cost: 50 },
      metricDeltas: { stability: 0, prosperity: 0, freedom: 0, cost: 0 },
      causalLedger: [{ fact: "因果事实", causedByChapter: 0, mustAffect: "后续对象" }], callbackUsed: null, visualTone: "war",
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
  const worldCanon = buildWorldCanon(playedTurns);
  const pivotalBrief = buildPivotalBrief(scenario, playedTurns, chapter);
  const protagonist = playedTurns[0]?.turn;
  return messages({
    task: `生成第 ${chapter} 节点。它必须是当前平行世界的重大转折点，而不是普通人的日常工作或上一事件的机械续集。主角必须仍是 authoritativeProtagonist.name 本人，年龄必须等于 authoritativeTimelineNode.protagonistAge；可以升迁、失势、结盟、迁居或改变阵营，但禁止换身体、转生、意识接力和让后代替他行动。authoritativeWorldCanon 是不可撤销正史：逐项承认，不得否认、降级、反转或假设玩家失败。严格执行 authoritativePivotalBrief：本幕必须立刻兑现 mustPayOffNow，继续兑现 continuityMandate，并让 role、location、headline、narrative、causalBridge、turningPointStakes、worldStateChange、divergenceProof 和 immediateObjective 合计自然出现 requiredEvidence 中至少两个不同词。对 activeCustomCanon 的每项玩家正史：causalLedger 对应 causedByChapter 的 fact 必须逐字等于 sourceText；可见场景必须继续呈现每组 claimGroups 中至少一个事实词。第 4 节点起，原始历史事件不得继续作为本幕主题、标题或当前任务，只能作为主角人生的因果源；必须让同一个人进入另一个由其选择引发的重大矛盾。比较最近三幕的社会载体、核心矛盾、制度场景、主要受影响人群，本幕至少更换其中两项，但变化必须由正史账本直接导致。不强制跨国或跨洲，中国线可以继续留在中国；优先使用中国玩家熟悉的真实人物、制度、城市、战争、发明或典故。第 12 节点是主角晚年的最后重大决定，但本幕只提供选择，不提前写他死亡。`,
    ...scenarioPayload(scenario),
    authoritativeTimelineNode: getTimelineNode(chapter, scenario.seed.year),
    authoritativeProtagonist: { name: protagonist?.protagonistName, sameBodyThroughAllTwelveNodes: true, previousAge: playedTurns.at(-1)?.turn.protagonistAge, previousRole: playedTurns.at(-1)?.turn.role },
    authoritativeWorldCanon: { status: "不可撤销正史", ...worldCanon },
    authoritativePivotalBrief: pivotalBrief,
    playedHistory: selectedHistory(playedTurns),
    outputContract: turnContract(chapter, pivotalBrief.rippleLens),
  });
}

export function buildCustomActionMessages(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  turn: TimelineTurn,
  action: string,
): ChatMessage[] {
  return messages({
    task: "玩家正在直接写入一条新的历史结果。playerDeclaredOutcome 是已经发生的既成事实，不是行动申请。你无权判断可行性，不得改变它写明的成功或失败，不得把完成时改成尝试。必须逐字保留结果的成败关系，只推演它如何进入社会、产生什么意外代价、谁受益、谁承担。causalMechanism、unexpectedCost、beneficiary、payer 也不得暗示该结果其实失败、未遂、未发生或反向成功。人格只决定优先看见哪类后果，不能改变玩家钦定的事实。",
    ...scenarioPayload(scenario),
    playedHistory: selectedHistory(playedTurns),
    currentScene: {
      chapter: turn.chapter,
      yearLabel: turn.yearLabel,
      location: turn.location,
      role: turn.role,
      immediateObjective: turn.immediateObjective,
      timePressure: turn.timePressure,
      availableProfileAdvantage: turn.profileAdvantage,
      causalLedger: turn.causalLedger,
    },
    playerDeclaredOutcome: action,
    outputContract: {
      requiredFields: ["declaredOutcome", "canonStatus", "personalityLens", "causalMechanism", "deviationClass", "instantEcho"],
      declaredOutcome: "必须与 playerDeclaredOutcome 完全一致，2-80 个汉字，不得改写成败关系",
      canonStatus: "固定为 玩家钦定",
      personalityLens: "56 个汉字以内，必须点名 traveler.typeCode，只说明该人格优先看见哪类隐藏后果",
      causalMechanism: "56 个汉字以内，说明既成结果通过命令、消息、法律、市场、迁徙或其他具体媒介进入社会",
      deviationClass: "nudge/reform/rupture 之一",
      instantEcho: "含 directResult、unexpectedCost、beneficiary、payer；directResult 必须逐字复制 playerDeclaredOutcome，可到 80 字，其余每项 24 字以内",
    },
  });
}

export function buildEndingMessages(scenario: GameScenario, playedTurns: readonly PlayedTurn[]): ChatMessage[] {
  return messages({
    task: "十二次选择已经结束。先写同一主角在第十二项决定完成后的死亡现场，再把他无法亲眼看到的历史延伸到 2026。报告要像小说后续：遗产被继承、误读、争夺并制度化，最后落到普通人的具体生活。authoritativeWorldCanon 是不可撤销正史，玩家钦定结果必须进入身后历史。不得把 2026 写成第十三个玩家节点，不得让主角活到 2026，也不得加入没有因果来源的决定性发明、战争或人物。",
    ...scenarioPayload(scenario), authoritativeWorldCanon: { status: "不可撤销正史", ...buildWorldCanon(playedTurns) }, playedHistory: selectedHistory(playedTurns),
    outputContract: {
      requiredFields: ["worldName", "frontPageHeadline", "protagonistName", "lifespanSummary", "deathScene", "historyTimeline", "posthumousChronicle", "causalChains", "ordinaryLife2026", "closingPassage", "greatestGain", "hiddenPrice", "strangestDetail", "biggestBeneficiary", "biggestLoser", "rewriteLevel", "plausibilityScore", "plausibilityReason", "shareLine"],
      protagonistName: `必须逐字等于 ${playedTurns[0]?.turn.protagonistName ?? "第一幕主角姓名"}`,
      deathScene: "含 yearLabel、age、place、finalMoment、lastingLegacy；年龄和年份承接第十二幕，明确主角自然或因其人生代价而死亡",
      historyTimeline: "恰好十二项，每项含 chapter、yearLabel、playerChoice、consequence；玩家钦定项的 consequence 必须逐字包含对应 playerChoice",
      posthumousChronicle: "恰好四项，每项含 period、title、narrative、inheritedChange；从主角死后到 2026 逐步拉长时间，展示遗产如何变形",
      causalChains: "恰好三项，每项含 origin、transformation、payoff",
      ordinaryLife2026: "恰好三个具体生活细节",
      closingPassage: "260 字以内的小说式尾声，明确主角没看到 2026，但世界仍活在他的选择之后",
      plausibilityScore: "0-100 数值",
    },
  });
}

export function getPlayedTurnChoiceText(turn: PlayedTurn): string { return turn.selectedChoiceLabel; }

export function buildJsonRepairMessages(raw: string, target: RepairTarget, details: JsonRepairDetails = {}): ChatMessage[] {
  return messages({ task: "修复下面的模型输出，只修正 JSON 结构与字段类型，不改变事实和玩家选择。", target, details, invalidOutput: raw });
}

export function buildContextualJsonRepairMessages(original: readonly ChatMessage[], raw: string, target: RepairTarget, details: JsonRepairDetails = {}): ChatMessage[] {
  return [...original, { role: "user", content: JSON.stringify({ task: "上一输出校验失败。请按原 outputContract 修复并只返回 JSON。", target, details, invalidOutput: raw }) }];
}
