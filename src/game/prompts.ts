import type { GameScenario } from "./reducer";
import type { DeviationClass, TimelineTurn } from "./schema";
import { getTimelineNode, type DecisionChapter } from "./timelinePlan";
import { buildNarrativeContext } from "./narrativeContext";
import { CUSTOM_ACTION_MAX_LENGTH } from "./limits";
import {
  CONTINUATION_TASK_PREFIX,
  ENDING_SYSTEM_PROMPT,
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

const TIMELINE_SYSTEM: ChatMessage = { role: "system", content: TIMELINE_SYSTEM_PROMPT };
const ENDING_SYSTEM: ChatMessage = { role: "system", content: ENDING_SYSTEM_PROMPT };
const DEFAULT_PROMPT_POWER_IDS = ["blink-self", "stop-time"] as const;
const DEFAULT_PROMPT_ROLL_POWER_ID = "teleport-crowd" as const;

function assignedPower(powerId: PowerId) {
  const power = powerPrompt(powerId);
  return {
    name: power.name,
    exactRule: power.exactRule,
    duration: power.duration,
  };
}

function scenarioPayload(scenario: GameScenario) {
  return {
    historyMoment: {
      id: scenario.seed.id,
      date: scenario.seed.dateLabel,
      eventName: scenario.seed.eventName,
      location: scenario.seed.location,
      assignedRole: scenario.seed.role,
      actualHistory: scenario.seed.historicalOutcome,
      verifiedFacts: scenario.seed.baselineFacts,
      visualTone: scenario.seed.visualTone,
    },
  };
}

function turnContract() {
  return {
    shape: "{\"s\":[标题,叙事,地点,身份,期限,因果桥,架空事实,正史对照,视觉类型],\"c\":[三张牌],\"r\":[三张牌]}",
    cardShape: "[牌面短名,完整决定,对象,[直接结果,代价,受益者,承担者]]",
    rules: {
      root: "只输出 s、c、r；s 恰好九项，c/r 各三项且位置固定，不输出对象长键或解释",
      scene: "标题≤16字且不重复；叙事55-85字、二至三句；地点≤20字且符合年代；身份≤18字；期限≤14字",
      causality: "因果桥18-24字，只写上一结果如何抵达本幕；架空事实≤24字；正史对照≤32字且含可核验专名",
      cards: "c/r 都按 A循史、B破局、C天外。短名4-7字，完整决定14-24字，对象3-7字，四项结果各3-8字；每张使用不同的现场人物、器物、命令或程序",
      powers: "两张 C 分别使用 assignedPowers 对应能力，由“你”发动并完整兑现 exactRule；不要输出 powerId。A/B 不使用能力",
      injected: "客户端注入幕次、年份、年龄、阶段、上一回响、来源、选项ID、强度、actor=你、action=完整决定、deadline=期限；不要输出这些字段",
      guard: "所有短句语义完整；六张牌不得让主角死亡或永久退场；视觉类型仅可为 ancient/exchange/print/revolution/industry/war/space/digital",
    },
    example: {
      s: ["本幕标题", "第二人称完整现场叙事。", "具体地点", "具体角色", "日落前", "上一结果通过具体媒介进入本幕。", "当前架空线已落地的事实", "真实历史的对应结果", "war"],
      c: [
        ["封签名册", "盖下官印，把漕运名册交给守桥校尉", "漕运名册", ["校尉封住桥闸", "误列船户被扣", "签令官员", "名册船户"]],
        ["割断绞索", "割断桥闸绞索，放走名册最后一艘船", "桥闸绞索", ["船户驶出关口", "守闸兵追查你", "船上百姓", "看守绞盘者"]],
        ["发动能力", "把指定能力用在本幕器物上完成不可逆行动", "本幕器物", ["能力当场生效", "具体人物受损", "具体受益者", "具体承担者"]],
      ],
      r: "与 c 结构相同、内容不得重复的三项新牌数组",
    },
  };
}

const TURN_PROTOCOL: ChatMessage = {
  role: "system",
  content: JSON.stringify({
    protocol: TIMELINE_TURN_PROTOCOL,
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

function serializePayload(raw: unknown): string {
  const payload = raw as Record<string, unknown> | null;
  if (!payload || typeof payload.outputContract !== "object" || payload.outputContract === null || Array.isArray(payload.outputContract)) {
    return JSON.stringify(payload);
  }
  const contract = payload.outputContract as Record<string, unknown>;
  const lines: string[] = [];
  for (const [key, value] of Object.entries(contract)) {
    if (key === "compactShape" || key === "shape") {
      lines.push(`必须以以下格式输出：${String(value)}`);
    } else if (key === "example" || key === "rules") {
      lines.push(`${key}：${JSON.stringify(value)}`);
    } else if (Array.isArray(value)) {
      lines.push(`${key}：${value.join("、")}`);
    } else if (typeof value === "string") {
      lines.push(`${key}：${value}`);
    } else {
      lines.push(`${key}：${JSON.stringify(value)}`);
    }
  }
  return JSON.stringify({ ...payload, outputContract: lines.join("\n") });
}

function messages(payload: unknown): ChatMessage[] {
  return [TIMELINE_SYSTEM, { role: "user", content: serializePayload(payload) }];
}

function endingMessages(payload: unknown): ChatMessage[] {
  return [ENDING_SYSTEM, { role: "user", content: serializePayload(payload) }];
}

function turnMessages(payload: unknown): ChatMessage[] {
  return [TIMELINE_SYSTEM, TURN_PROTOCOL, { role: "user", content: serializePayload(payload) }];
}

export function buildContinuationMessages(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  chapter: ContinuationChapter,
  assignedPowerIds: readonly [PowerId, PowerId] = DEFAULT_PROMPT_POWER_IDS,
): ChatMessage[] {
  const narrativeContext = buildNarrativeContext(playedTurns, chapter);
  const protagonist = playedTurns[0]?.turn;
  const node = getTimelineNode(chapter, scenario.seed.year);
  return turnMessages({
    task: `${CONTINUATION_TASK_PREFIX}${chapter}幕。根据 context 的全部决定、最近后果与历史债，推演一阶到三阶影响，选择最意外且主角能亲手介入的重大历史冲突。不得套模板或重复近三幕；第3幕起，开场事件只作因果源。承认全部正史，最新 activeCanon 必须在叙事、因果桥或架空事实中产生可见效果。使用两个时代准确的具体锚点。第4幕只发出最后选择，不提前写主角死亡。`,
    ...scenarioPayload(scenario),
    node: {
      chapter,
      name: node.chapterName,
      year: node.targetYear,
      age: node.protagonistAge,
      stage: node.lifeStage,
    },
    protagonist: {
      name: protagonist?.protagonistName,
      previousRole: playedTurns[playedTurns.length - 1]?.turn.role,
    },
    context: {
      life: narrativeContext.lifeIndex.map((item) => ({
        chapter: item.chapter,
        year: item.yearLabel,
        age: item.protagonistAge,
        role: item.role,
        decision: item.decision,
      })),
      latest: narrativeContext.latestDecision ? {
        decision: narrativeContext.latestDecision.decision,
        result: narrativeContext.latestDecision.directResult,
        cost: narrativeContext.latestDecision.unexpectedCost,
        beneficiary: narrativeContext.latestDecision.beneficiary,
        payer: narrativeContext.latestDecision.payer,
      } : null,
      recentConsequences: narrativeContext.activeConsequences.map((item) => ({
        chapter: item.chapter,
        result: item.directResult,
        cost: item.unexpectedCost,
      })),
      activeCanon: narrativeContext.activePlayerCanon.map((item) => ({
        chapter: item.chapter,
        fact: item.sourceText,
        mechanism: item.propagationMechanism,
      })),
      ledger: narrativeContext.persistentLedger,
      recentScenes: narrativeContext.recentScenes.map((item) => ({
        headline: item.headline,
        location: item.location,
        role: item.role,
      })),
    },
    assignedPowers: {
      choicesC: assignedPower(assignedPowerIds[0]),
      rollChoicesC: assignedPower(assignedPowerIds[1]),
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
    task: `为当前现场发出第${rollNumber}次 Roll，只输出 c。场景与正史不变。三张依次为 A循史、B破局、C天外：A 用未出现的具体动作让既有轨道按时落地；B 改变控制点、命令或结果；C 由你完整使用 assignedPower。三张必须使用不同现场杠杆，并与 seenCards 的人物、对象、手段、结果和代价明显不同。不得写抽象口号，不得让主角永久退场。`,
    historyOrigin: {
      eventName: scenario.seed.eventName,
      actualHistory: scenario.seed.historicalOutcome,
    },
    canonDecisions: playedTurns.map((played) => played.selectedChoiceLabel),
    assignedPower: assignedPower(assignedPowerId),
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
    seenCards: allPreviouslySeenCards.map((choice) => [
      choice.displayLabel,
      choice.label,
      choice.actionSpec.target,
      choice.instantEcho.directResult,
      choice.instantEcho.unexpectedCost,
    ]),
    outputContract: {
      shape: "{\"c\":[[短名,完整决定,对象,[结果,代价,受益者,承担者]]×3]}",
      lengths: "短名4-7字；决定14-24字；对象3-7字；四项结果各3-8字",
      order: "恰好三项，依次 A循史、B破局、C天外；C 使用 assignedPower 且不输出英文 ID",
      injected: "客户端注入ID、强度、actor=你、action=决定、deadline=现场期限；不要输出长键",
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
    year: played.turn.yearLabel,
    age: played.turn.protagonistAge,
    role: played.turn.role,
    location: played.turn.location,
    decision: played.selectedChoiceLabel,
    result: played.resolvedEcho.directResult,
    cost: played.resolvedEcho.unexpectedCost,
  }));
}

export function buildBiographyMessages(scenario: GameScenario, playedTurns: readonly PlayedTurn[]): ChatMessage[] {
  const firstTurn = playedTurns[0]?.turn;
  const finalTurn = playedTurns[playedTurns.length - 1]?.turn;
  return endingMessages({
    task: `${ENDING_BIOGRAPHY_TASK_PREFIX}。用自然普通话把四次决定写成一段连贯人生，不写文言，不逐条复述。写清身份变化、所得、代价与死亡；life 是不可撤销正史。`,
    protagonist: {
      name: firstTurn?.protagonistName,
      deathYear: finalTurn?.yearLabel,
      deathAge: finalTurn?.protagonistAge,
    },
    historyOrigin: {
      eventName: scenario.seed.eventName,
      actualHistory: scenario.seed.historicalOutcome,
    },
    lifeRecord: endingLifeRecord(playedTurns),
    outputContract: {
      compactShape: "{\"b\":\"一生纪事\",\"s\":\"一生概括\",\"d\":[\"死亡地点\",\"临终场景\",\"身后遗产\"]}",
      exactFields: "只输出 b、s、d",
      lifeStory: "190-250字，自然普通话，连贯有起伏，以主角死亡和完整句号收束",
      lifespanSummary: "22-36字完整短句",
      deathScene: "d 恰好三项：纯地点（不含年份、年龄或分隔符）、18-30字临终完整句、14-26字身后遗产完整句",
    },
  });
}

export function buildWorldReportMessages(scenario: GameScenario, playedTurns: readonly PlayedTurn[]): ChatMessage[] {
  const firstTurn = playedTurns[0]?.turn;
  const finalTurn = playedTurns[playedTurns.length - 1]?.turn;
  return endingMessages({
    task: `${ENDING_WORLD_TASK_PREFIX}。让四次决定经继承、误读、争夺或制度化，穿过四个时代落到普通人的2026。life 是不可撤销正史；写成一页自然、具体、可读完的小说后续。`,
    protagonist: {
      name: firstTurn?.protagonistName,
      deathYear: finalTurn?.yearLabel,
      deathAge: finalTurn?.protagonistAge,
    },
    historyOrigin: {
      eventName: scenario.seed.eventName,
      actualHistory: scenario.seed.historicalOutcome,
    },
    lifeRecord: endingLifeRecord(playedTurns),
    outputContract: {
      compactShape: "{\"n\":\"世界名\",\"h\":\"头版标题\",\"p\":[[\"时期\",\"标题\",\"时代叙事\",\"继承结果\"]×4],\"o\":[\"生活句\"×3],\"e\":\"小说尾声\"}",
      exactFields: "只输出 n、h、p、o、e",
      posthumousChronicle: "p 恰好四项，从主角死后逐步到2026；时代叙事18-30字，继承结果10-18字，均为完整句",
      ordinaryLife2026: "o 恰好三项，每项10-24字，是普通人可感知且互不重复的完整生活句",
      closingPassage: "e 45-70字；明确主角没看到2026，但世界仍活在他的选择之后",
      titles: "n≤16字，h≤28字",
    },
  });
}

export function getPlayedTurnChoiceText(turn: PlayedTurn): string { return turn.selectedChoiceLabel; }

export function buildJsonRepairMessages(raw: string, target: RepairTarget, details: JsonRepairDetails = {}): ChatMessage[] {
  const payload = { task: "修复下面的模型输出，只修正 JSON 结构与字段类型，不改变事实和玩家选择。", target, details, invalidOutput: raw };
  return target === "timeline_turn"
    ? turnMessages(payload)
    : target === "biography_report" || target === "world_report"
      ? endingMessages(payload)
      : messages(payload);
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
  const narrativeContext = typeof payload.context === "object" && payload.context !== null
    ? payload.context as Record<string, unknown>
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
      node: payload.node,
      protagonist: payload.protagonist,
      playerCanon: narrativeContext?.activeCanon,
      playerDeclaredOutcome: payload.playerDeclaredOutcome,
      lifeRecord: payload.lifeRecord,
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
  return target === "timeline_turn"
    ? turnMessages(repairPayload)
    : target === "biography_report" || target === "world_report"
      ? endingMessages(repairPayload)
      : messages(repairPayload);
}
