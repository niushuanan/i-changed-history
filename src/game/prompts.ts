import type { GameScenario } from "./reducer";
import type { DeviationClass, TimelineTurn } from "./schema";
import { getTimelineNode, type DecisionChapter } from "./timelinePlan";
import { buildWorldCanon } from "./worldCanon";
import { buildNarrativeContext } from "./narrativeContext";
import { CUSTOM_ACTION_MAX_LENGTH } from "./limits";
import {
  ENDING_BIOGRAPHY_TASK_PREFIX,
  ENDING_WORLD_TASK_PREFIX,
  TIMELINE_SYSTEM_PROMPT,
  TIMELINE_TURN_PROTOCOL,
} from "./deepseekProtocol";
import { powerPrompt, type PowerId } from "./powers";

export type ChatMessage = Readonly<{ role: "system" | "user"; content: string }>;
export type PlayedTurn = {
  turn: TimelineTurn;
  selectedChoiceId: "A" | "B" | "C" | "custom";
  selectedChoiceLabel: string;
  selectedDeviationClass: DeviationClass;
  selectedPowerId?: PowerId;
  resolvedEcho: NonNullable<TimelineTurn["previousEcho"]>;
  playerAuthored?: boolean;
  canonStatus?: "玩家钦定";
  causalMechanism?: string;
};
type ContinuationChapter = Exclude<DecisionChapter, 1>;
type RepairTarget = "timeline_turn" | "choice_set" | "biography_report" | "world_report" | "custom_action";
export type JsonRepairDetails = {
  expectedChapter?: TimelineTurn["chapter"];
  validationErrors?: readonly string[];
  patchOnly?: boolean;
  repairFields?: readonly string[];
};

const SYSTEM: ChatMessage = { role: "system", content: TIMELINE_SYSTEM_PROMPT };
const DEFAULT_PROMPT_POWER_IDS = ["blink-self", "stop-time"] as const;
const DEFAULT_PROMPT_ROLL_POWER_ID = "teleport-crowd" as const;

function scenarioPayload(scenario: GameScenario) {
  return {
    playerContract: "玩家是现代中国人，没有固定人格或现代职业。A/B 牌只依靠当前身份与现场资源；C 牌由客户端临时授予 assignedPowers 指定的一项一次性超能力，玩家本人发动。",
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
    wireShape: {
      s: "[headline,narrative,location,role,timePressure,causalBridge,worldStateChange,divergenceProof,visualTone]",
      c: "首组三张紧凑牌",
      r: "第一次 Roll 的三张紧凑牌",
    },
    rules: {
      totalLength: "只返回 s、c、r 三个根字段，严格按 compactShapeExample 的顺序和数组结构输出；s 必须恰好九项，c 与 r 必须各三项，不得自行删位、换序或继续缩写；不得展开成长键对象，不得输出解释。紧凑传输只删除重复键名，所有玩家可见中文仍须完整",
      clientOwnedFields: "clientOwnedFields 和 derivedFromAiFields 都由客户端注入或从你的其他字段提取，禁止输出",
      narrative: "55-85 个汉字；用二至三句完整叙事，第二人称现在时。只保留上一决定造成的局面、一个可见历史锚点、玩家当前能做什么与失败代价，不写长篇背景",
      headline: "16 个汉字以内；必须与 recentScenes 最近三幕中的标题逐字不同",
      location: "20 个汉字以内；必须使用当时真实存在或时代可信的称谓。1900 年前禁止使用议事厅、会议室、办公室、指挥中心、新闻中心、发布厅、报告厅、展览厅、作战室、控制室、调度室等现代通用空间名，改用府署正堂、军帐、中军帐、行辕、馆驿、宫门、城楼、书院等符合史实的时代真实称谓",
      role: "18 个汉字以内；玩家此刻被历史人物认可的具体身份",
      causalBridge: "18-24 字的单个完整短句并以句号收尾；不要使用逗号或分号；不复述玩家选择，只写上次结果通过何种人物、命令、交通、制度或物件造成本幕局面",
      worldStateChange: "24 字以内；一句话只写当前架空时间线已经落地的最关键新事实，不得混入真实历史",
      divergenceProof: "32 字以内；一句话只写真实历史的对应结果，字段正文不要重复写‘真实历史中’，不得复述当前架空线；必须含至少一个可核验的真实人物、机构、地点或事件",
      timePressure: "14 个汉字以内；可感知的分钟、小时、天数或迫近事件",
      historicalAnchors: "location 与 role 将由客户端作为本幕两项时代锚点；两者必须具体、时代准确，并在 narrative 或牌面真实出现。输出前核对人物、机构与制度在 authoritativeTimelineNode.targetYear 时仍在世、在任或确实存在",
      snapshotGrounding: "历史快照不是背景资料，而是本幕所有行动的边界。三张牌必须分别使用不同的具体杠杆；每张牌至少逐字使用一个本幕已经出现的具体人物、机构、地点、器物、命令或程序。不得用原定方案、新方案、现场众人、愿意跟随的人、负责执行的人等万能占位词逃避历史细节",
      playerFacingLanguage: "所有字段值面向中国玩家，必须使用自然中文。内部 JSON 键名和英文 ID 只能出现在键位：不得在 label、displayLabel、intent、actionSpec 的值、instantEcho 的值或叙事中写 powerId、actionSpec、deadline、unexpectedCost、deviationClass、causedByChapter、mustAffect，也不得写 reverse-cause 等超能力 ID；超能力在文案里只用 assignedPowers 提供的中文 name。NASA、CERN、U-2 等真实历史专名缩写可以保留",
      trajectorySemantics: "先从 narrative、worldStateChange、immediateObjective 与有效正史中写清本幕的既有轨道：当前掌权者、已经启动的命令、无人改动时会发生的结果。循史与温和程度无关：真实轨道即使是战争、政变、处决或制度巨变，A 也必须在期限前执行一个让它真正落地的具体动作。A 不得阻止、逆转、拖延到期限后、替换当前掌权者、改变命令目标或偷换最终结果；B 必须改变至少一个控制点、命令方向或最终结果",
      compactChoice: "每张牌固定为 [displayLabel,label,target,[directResult,unexpectedCost,beneficiary,payer]]。actor 固定为“你”，action 与完整 label 相同，deadline 直接继承本幕 timePressure，均由客户端无损注入；不要重复输出，也不要输出 id、intent、deviationClass、usesModernKnowledge、powerId 或对象键。displayLabel 4-7 字。label 14-24 字，是会原样进入玩家正史的完整决定。target 3-7 字；四个即时结果字段各 3-8 字",
      choices: "c 的三张严格按 A循史、B破局、C天外排列。A 利用本幕正在运行的程序、身份权限或既有人物关系，亲手执行既有轨道并让其结果按时发生；不能只等待、复核、建议或口头表示照办。B 借具体人物、证据、器物、传播通道或指挥链改变既有轨道的控制点、命令方向或结果。C 只能使用 assignedPowers.choicesC 指定的超能力，actor 必须逐字为“你”；不要输出英文 powerId，客户端会按 C 牌位置注入。你要亲自把能力用在当前快照中的具体人物、器物、命令、地点和期限上，完整兑现 exactRule。三张牌使用三种不同的现场杠杆并让不同的人付代价。先像当事人开口，再提取四段行动字段；label 必须以具体的人、物、地点或已经发生的结果收尾",
      rollChoices: "r 的三张结构与 c 完全相同，也严格按 A循史、B破局、C天外排列。第二张 A 用另一个具体杠杆执行同一既有轨道；第二张 B 明确改变轨道；C 只能使用 assignedPowers.rollChoicesC，actor 逐字为“你”，不要输出英文 powerId。六张牌的人物、对象、手段、直接结果和代价承担者都要拉开。客户端会把 r 作为第一次 Roll 的预先准备结果",
      protagonistSurvival: "六张牌的 directResult、unexpectedCost 与 payer 都不得让主角死亡、被处死、失去意识、终身监禁或永久失去行动能力；他必须能以同一身体继续完成下一幕。可以受伤、失势、被追捕、流亡或欠下具体债务",
      visualTone: "ancient/exchange/print/revolution/industry/war/space/digital 之一",
      completeness: "每个短字段必须以完整短句收尾，宁可更短也不得在名词、动词或因果关系中间截断",
    },
    compactShapeExample: {
      s: ["本幕标题", "第二人称完整现场叙事。", "具体地点", "具体角色", "日落前", "上一结果通过具体媒介进入本幕。", "当前架空线已落地的事实", "真实历史的对应结果", "war"],
      c: [
        ["封签名册", "盖下官印，把漕运名册交给守桥校尉", "漕运名册", ["校尉封住桥闸", "误列船户被扣", "签令官员", "名册船户"]],
        ["割断绞索", "割断桥闸绞索，放走名册最后一艘船", "桥闸绞索", ["船户驶出关口", "守闸兵追查你", "船上百姓", "看守绞盘者"]],
        ["发动能力", "把指定能力用在本幕器物上完成不可逆行动", "本幕器物", ["能力当场生效", "具体人物受损", "具体受益者", "具体承担者"]],
      ],
      r: "与 c 相同的三项紧凑牌数组",
    },
  };
}

const TURN_PROTOCOL: ChatMessage = {
  role: "system",
  content: JSON.stringify({
    protocol: TIMELINE_TURN_PROTOCOL,
    purpose: "生成一个由 DeepSeek 完整创作、可由客户端严格校验的历史幕次 JSON",
    outputContract: turnContract(),
  }),
};

function selectedHistory(playedTurns: readonly PlayedTurn[]) {
  return playedTurns.map(({ turn, selectedChoiceId, selectedChoiceLabel, selectedDeviationClass, selectedPowerId, resolvedEcho, playerAuthored, canonStatus, causalMechanism }) => ({
    chapter: turn.chapter,
    yearLabel: turn.yearLabel,
    selectedChoiceId,
    selectedChoiceLabel,
    selectedDeviationClass,
    selectedPower: selectedPowerId ? powerPrompt(selectedPowerId) : null,
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

export function buildContinuationMessages(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  chapter: ContinuationChapter,
  assignedPowerIds: readonly [PowerId, PowerId] = DEFAULT_PROMPT_POWER_IDS,
): ChatMessage[] {
  const narrativeContext = buildNarrativeContext(playedTurns, chapter);
  const protagonist = playedTurns[0]?.turn;
  const latestPlayerFact = narrativeContext.activePlayerCanon[
    narrativeContext.activePlayerCanon.length - 1
  ];
  return turnMessages({
    task: `生成第 ${chapter} 节点。不要从预设类别、通用模板或固定章节槽中选题。先在内部完成一次不输出的现场盘点：此刻有哪些具体人物与立场，谁能被说服、什么东西能被拿走、哪道命令或程序能被截断、主角凭当前身份实际够得到什么、最近决定留下了哪笔马上要偿还的债。再推演 narrativeContext 中全部决定的一阶、二阶和三阶后果，自行选择其中最意外、最重大、同时最能由同一主角亲手介入的一处真实历史冲突。它必须是当前平行世界的重大转折点，而不是普通日常，也不是上一事件换标题后的机械续集。主角必须仍是 authoritativeProtagonist.name 本人，年龄必须等于 authoritativeTimelineNode.protagonistAge；可以升迁、失势、结盟、迁居或改变阵营，但禁止换身体、转生、意识接力和让后代替他行动。narrativeContext.lifeIndex 与 playerCanon 是全部不可撤销正史，逐项承认，不得否认、降级、反转或假设玩家失败。narrativeContext.activePlayerCanon 是本幕必须继续兑现的玩家正史：worldStateChange 必须展示最近玩家正史已经造成的局面，causalBridge 必须写清它通过什么媒介抵达当前冲突。若 activePlayerCanon 非空，最新一条必须在 narrative、worldStateChange 或 causalBridge 中至少逐字写出一个核心人物、制度、地点、器物或动作名。允许留在同一地区，但最近三幕不能总围绕同一事件、同一敌人、同一任务；本幕标题不得与 recentScenes 最近三幕中的任何标题逐字相同。第 3 节点起，原始历史事件不得继续作为本幕主题、标题或当前任务，只能作为主角人生的因果源；本幕要由既有选择引发，却必须进入新的重要矛盾。面向中国玩家；先给熟悉的真实历史锚点，再展开反事实后果。必须使用至少两个时代准确的真实锚点。一次性生成 c 与 r 共六张牌，每张都逐字带出当前快照中的具体专名或实物，六张牌至少覆盖六种不同的现场杠杆，不是同一命令的温和版、强硬版和超能力版。每组三张仍按循史、破局、天外排列；两张天外牌分别严格使用 assignedPowers 指定的不同能力，玩家本人发动，绝不能自行挑选或发明能力。第 4 节点是主角晚年的最后重大决定，但本幕只提供选择，不提前写他死亡。不要输出现场盘点或思考过程；输出前逐项确认 s、c、r 完整且数组位置严格正确，s 恰好九项，c 与 r 各三项。`,
    ...scenarioPayload(scenario),
    authoritativeTimelineNode: getTimelineNode(chapter, scenario.seed.year),
    authoritativeProtagonist: {
      name: protagonist?.protagonistName,
      sameBodyThroughAllFourNodes: true,
      previousAge: playedTurns[playedTurns.length - 1]?.turn.protagonistAge,
      previousRole: playedTurns[playedTurns.length - 1]?.turn.role,
    },
    narrativeContext,
    assignedPowers: {
      choicesC: powerPrompt(assignedPowerIds[0]),
      rollChoicesC: powerPrompt(assignedPowerIds[1]),
    },
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
    sceneTrajectoryContract: {
      establishBeforeWritingChoices: "从本幕正文、当前世界事实与有效正史判断：谁掌权、哪道命令已经启动、无人改变会产生什么结果",
      optionA: "在期限前执行一个让这条既有轨道真正落地的动作；轨道本身即使激进也仍是循史，不得阻止、逆转、拖延、换掉掌权者或偷换结果",
      optionB: "在期限前改变既有轨道的控制点、命令方向或结果",
      optionC: "由玩家亲自发动指定超能力，形成第三种完全不同的结果",
    },
    submissionChecklist: {
      narrative: "必须以句号、问号或叹号结束，最后一句拥有明确主语、动作与对象，不得停在把、将、让、为、向等未完成结构",
      location: "若目标年份早于 1900 年，再检查一次地点中没有议事厅、会议室、办公室、指挥中心、控制室等现代通用空间名",
      historicalAnchors: "location 与 role 必须是两个具体、时代准确且在正文或牌面出现的历史锚点",
      choiceIds: ["A", "B", "C"],
      choices: "c 与 r 都必须恰好三个四项紧凑牌数组；六张牌至少使用六种不同的现场杠杆，不是同一动作换六种说法。每张 displayLabel 控制在 4-7 字并使用一眼能懂的自然动宾短语，每个 label 控制在 14-24 字，逐字带出本幕专名或实物，并以具体对象或已完成结果收尾；target 与四项结果都用最短完整说法，禁止复述 label，禁止省略第四项或写成抽象口号与历史评论",
    },
  });
}

export function buildRerollMessages(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  turn: TimelineTurn,
  rollNumber: 2 | 3,
  previousChoices: TimelineTurn["choices"],
  assignedPowerId: PowerId = DEFAULT_PROMPT_ROLL_POWER_ID,
): ChatMessage[] {
  const previousChoicesArePrepared = previousChoices.every((choice, index) => (
    choice.displayLabel === turn.rollChoices[index]?.displayLabel
    && choice.label === turn.rollChoices[index]?.label
  ));
  const allPreviouslySeenCards = [
    ...turn.choices,
    ...turn.rollChoices,
    ...(previousChoicesArePrepared ? [] : previousChoices),
  ];

  return messages({
    task: `为当前同一历史现场发出第 ${rollNumber} 次 Roll 的三张全新卡牌。不要续写场景，不要改变人物、年份、地点或已经发生的历史；只输出紧凑字段 c。先在心里盘点 currentScene 与 historyMoment，并明确这幕的既有轨道：谁掌权、哪道命令已经启动、无人改变会产生什么结果；不要输出盘点过程。三张牌严格依次为 A 循史、B 破局、C 天外。A 必须在期限前用一个尚未出现的具体动作让既有轨道真正落地；即使轨道本身激进也仍然是循史，A 不得阻止、逆转、拖延、换掉掌权者或偷换结果。B 必须改变既有轨道的控制点、命令方向或结果。三张牌必须使用三种不同的现场杠杆，并与 allPreviouslySeenCards 的人物、对象、手段、直接结果和代价承担者明显不同。每张牌都要逐字带出至少一个当前快照中的专名或实物，像现场的人在说一个能立刻执行的主意，不像报告、评论或产品说明；禁止“夺取解释权、推进既有轨迹、改变历史走向、重塑秩序、综合施策、稳妥处置、原定方案、新方案、现场众人、愿意跟随的人”等万能话术。不要把循史写成等待、复核、建议或口头照办；不要把破局写成泛化的接管现场、另起人马或越级下令。三张牌的结果和代价都不能让玩家死亡、被处死、失去意识、终身监禁或永久退场；同一个主角必须能继续下一幕。C 牌只能使用 assignedPower 指定的一项能力，actor 必须逐字为“你”，你要亲自把能力用在当前历史快照的具体人物、器物、命令或地点上。必须完整兑现 exactRule 的范围、强度、对象和持续时间，能力本身就是解决当前瓶颈的决胜动作；禁止只用能力制造黑暗、混乱、注意力或掩护，再靠普通动作解决问题。不能换能力、弱化成比喻、只讨论能力，代价也不能否定已经成功。不要输出英文 powerId，客户端会按 C 牌位置注入。`,
    ...scenarioPayload(scenario),
    playedHistory: selectedHistory(playedTurns),
    assignedPower: powerPrompt(assignedPowerId),
    currentScene: {
      chapter: turn.chapter,
      headline: turn.headline,
      narrative: turn.narrative,
      yearLabel: turn.yearLabel,
      location: turn.location,
      role: turn.role,
      protagonistName: turn.protagonistName,
      immediateObjective: turn.immediateObjective,
      timePressure: turn.timePressure,
      historicalAnchors: turn.historicalAnchors,
    },
    sceneTrajectoryContract: {
      optionA: "执行并完成当前既有轨道",
      optionB: "改变当前既有轨道的控制点、命令方向或结果",
      optionC: "使用指定超能力形成第三种结果",
    },
    allPreviouslySeenCards: allPreviouslySeenCards.map(({ id, displayLabel, label, deviationClass, intent }) => ({
      id, displayLabel, label, deviationClass, intent,
    })),
    outputContract: {
      requiredFields: ["c"],
      exactCount: "c 恰好三项，位置依次为 A循史、B破局、C天外",
      displayLabel: "4-7 个汉字，最多 16 字；自然动宾短语，玩家一眼知道要做什么",
      label: "14-24 字的完整具体决定；先写动作，再写对象与期限，不写抽象口号；必须以具体的人、物、地点或已经发生的结果收尾，末尾不得是“的、同时、随后、转而、改为、试图、准备、意图、而非”或“向、对、把、将、让、以、从、与、和、及、但、且”",
      compactShape: "只输出 {\"c\":[三张紧凑牌]}。每张固定为 [displayLabel,label,target,[directResult,unexpectedCost,beneficiary,payer]]；actor 固定为“你”，action 与 label 相同，deadline 继承 currentScene.timePressure，由客户端无损注入。不要输出对象键、id、intent、deviationClass、usesModernKnowledge 或 powerId",
      powerRule: "C 严格使用 assignedPower；不要输出英文 powerId，客户端会按 C 牌位置权威注入",
      playerFacingLanguage: "字段值只写自然中文，不得把 powerId、deadline、actionSpec 等 JSON 键名或 reverse-cause 等英文能力 ID 写进牌面、决定、行动细节和结果；能力只写 assignedPower.name",
      actionSpec: "target 3-7 字且能在当前现场执行；不要重复 label 或 deadline",
      instantEcho: "紧凑牌最后一个四项数组依次为直接结果、隐藏代价、受益者、承担者，每项 3-8 字",
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
    task: `${ENDING_BIOGRAPHY_TASK_PREFIX}：白话文与文言文各一版，都要贯穿四次选择、身份变化、所得、代价与死亡，不得写成四条摘要的拼接。lifeRecord 是不可撤销正史，必须承认每次玩家选择。t 的四项后果只写该决定造成的具体后果，绝不能否定玩家钦定事实；章节、年份、玩家原句、姓名和死亡年龄均由客户端权威注入，不要重复输出。不得加入性格、人格或测试结论，不得让主角活到 2026。只输出紧凑人物报告，不要输出世界报告字段。`,
    historyMoment: scenarioPayload(scenario).historyMoment,
    lifeRecord: endingLifeRecord(playedTurns),
    outputContract: {
      compactShape: "{\"b\":\"白话列传\",\"c\":\"文言列传\",\"s\":\"一生总述\",\"d\":[\"死亡地点\",\"临终场景\",\"身后遗产\"],\"t\":[[\"第一幕后果\"],[\"第二幕后果\"],[\"第三幕后果\"],[\"第四幕后果\"]]}",
      exactFields: "只输出 b、c、s、d、t；不得展开成长键对象，不得输出姓名、章节、年份、玩家原句、死亡年龄或解释",
      totalTextBudget: "全部中文控制在 520 字以内；宁可删背景复述，不得省略四次选择、所得、代价与死亡",
      vernacularBiography: "220-290 字的完整白话人物列传，串起四次决定、身份变化、所得与代价，并以主角死亡和完整句号收束",
      classicalBiography: "120-170 字的完整文言人物列传，体例接近史传，有名、事、论，覆盖一生关键转折并以完整句号收束",
      lifespanSummary: "22-36 字的完整短句概括主角一生，并以句号、问号或叹号收尾",
      deathScene: "d 恰好三项，依次为地点、18-30 字临终完整句、14-26 字身后遗产完整句；明确死亡，后两项以句号、问号或叹号收尾",
      historyTimeline: "t 恰好四项，每项只含一个 14-24 字的具体后果并以句号、问号或叹号收尾，不得否定对应选择，不必重复玩家决定原句",
    },
  });
}

export function buildWorldReportMessages(scenario: GameScenario, playedTurns: readonly PlayedTurn[]): ChatMessage[] {
  const finalTurn = playedTurns[playedTurns.length - 1]?.turn;
  return messages({
    task: `${ENDING_WORLD_TASK_PREFIX}：他的决定被继承、误读、争夺和制度化，最终落到普通人的具体生活。worldCanon、lifeIndex 与 protagonistDeath 是不可撤销正史；所有玩家钦定结果都必须继续成立。主角在 protagonistDeath.yearLabel 所属年份死亡，任何字段都不得另写一个死亡年份。写成一页可读完的小说后续，不得把 2026 写成第五个玩家节点，不得让主角活到 2026，不得加入性格或人格结论。只输出紧凑世界报告，不要输出人物列传字段。`,
    historyMoment: scenarioPayload(scenario).historyMoment,
    endingContext: {
      lifeIndex: buildNarrativeContext(playedTurns).lifeIndex,
      playerCanon: buildNarrativeContext(playedTurns).playerCanon,
      worldCanon: { status: "不可撤销正史", ...buildWorldCanon(playedTurns) },
      protagonistDeath: finalTurn ? {
        name: finalTurn.protagonistName,
        yearLabel: finalTurn.yearLabel,
        age: finalTurn.protagonistAge,
        status: "主角在最后决定后死亡；年份不可改写",
      } : null,
    },
    outputContract: {
      compactShape: "{\"n\":\"世界名\",\"h\":\"头版标题\",\"p\":[[\"时期\",\"标题\",\"时代叙事\",\"继承结果\"]×4],\"c\":[[\"起点\",\"转化\",\"落点\"]×3],\"o\":[\"生活句\"×3],\"e\":\"小说尾声\",\"g\":\"最大收获\",\"x\":\"隐藏代价\",\"z\":\"最怪细节\",\"i\":\"最大受益者\",\"l\":\"最大失意者\",\"r\":\"改写程度\",\"q\":可信度数字,\"u\":\"可信度说明\",\"a\":\"分享句\"}",
      exactFields: "只输出 n、h、p、c、o、e、g、x、z、i、l、r、q、u、a；不得展开成长键对象或输出解释",
      totalTextBudget: "全部中文控制在 520 字以内；四段时代、三条因果链、三项生活和小说尾声必须齐全，其他字段只写一句",
      posthumousChronicle: "p 恰好四项，每项依次为时期、标题、时代叙事、继承结果；从主角死后到 2026 逐步拉长时间。时代叙事 18-28 个汉字，继承结果 10-16 个汉字，两者都以完整句号、问号或叹号收尾，不得截断句子",
      causalChains: "c 恰好三项，每项依次为起点、转化、落点，每项 4-10 字且具体",
      ordinaryLife2026: "恰好三个互不重复的具体生活细节，每项 12—18 字的完整生活短句，写成普通人可感知的一件事；每项必须以完整句号、问号或叹号收尾，不得停在半句话中",
      closingPassage: "45-65 个汉字的完整小说式尾声，以完整句号、问号或叹号收尾；明确主角没看到 2026，但世界仍活在他的选择之后，不得截断句子来满足字数",
      summaryFields: "g、x、z、i、l、r、u、a 各用 6-14 字完整表达，不复述前文",
      plausibilityScore: "0-100 数值",
      plausibilityReason: "用完整句解释可信度，并以句号、问号或叹号收尾",
      shareLine: "用第一人称完整句概括这次改史，并以句号、问号或叹号收尾",
    },
    submissionChecklist: {
      ordinaryLife2026: "硬边界仍是每项 12—18 字；为避免标点和计数误差，优先写成 12—16 字，逐项按汉字与句末标点计数后再提交",
      ordinaryLife2026Examples: [
        "孩子每天用纸鹤支付早餐费。",
        "社区移动医院今晚免费接诊。",
        "工人下班后公开核对粮仓账目。",
      ],
      posthumousChronicle: "身后时代叙事优先写成 20—25 字，保留完整句并为 28 字目标留出余量",
      exactCounts: "p 恰好四项，c 恰好三项，o 恰好三项",
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
  const sourceContract = typeof payload.outputContract === "object"
    && payload.outputContract !== null
    && !Array.isArray(payload.outputContract)
    ? payload.outputContract as Record<string, unknown>
    : {};
  const repairRuleSource = target === "timeline_turn"
    ? turnContract().rules as Record<string, unknown>
    : sourceContract;
  const repairFieldRules = Object.fromEntries(
    (details.repairFields ?? []).flatMap((field) => (
      Object.prototype.hasOwnProperty.call(repairRuleSource, field)
        ? [[field, repairRuleSource[field]]]
        : []
    )),
  );

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
    outputContract: details.patchOnly
      ? {
          patchShape: "只返回一个 JSON 对象；根键必须逐字使用 repairFields 中的完整英文键名，禁止使用 s/c/r/o/p/b 等紧凑别名，禁止返回未列出的字段",
          repairFields: details.repairFields,
          fieldRules: repairFieldRules,
        }
      : target === "timeline_turn"
        ? turnContract()
        : payload.outputContract,
    invalidOutput: raw,
  };
  return target === "timeline_turn" ? turnMessages(repairPayload) : messages(repairPayload);
}
