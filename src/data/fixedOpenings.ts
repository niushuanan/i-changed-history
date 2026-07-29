import { parseTimelineTurn, type TimelineTurn } from "../game/schema";
import { getTimelineNode } from "../game/timelinePlan";
import type { HistorySeed } from "../game/types";
import type { PowerId } from "../game/powers";
import { formatHistoricalYear } from "./historicalYear";
import { FIXED_POWER_CHOICES } from "./fixedPowerChoices.generated";

const PROTAGONIST_NAMES = [
  "沈砚", "陈潜", "顾衡", "陆昭", "谢临", "韩策", "程骁", "周砺", "许闻", "林澈",
  "苏谨", "杜衡", "裴简", "温岐", "梁朔", "江屿", "范宁", "秦川", "楚安", "孟舟",
  "赵潜", "袁简", "卫宁", "罗执", "唐砺", "宋临", "叶衡", "何远", "徐策", "白砚",
  "马库斯", "尤利安", "阿列克谢", "迭戈", "马丁", "伽利略", "埃德蒙", "朱利安", "亚瑟", "查尔斯",
  "塞缪尔", "米洛什", "伊万", "艾琳", "卡尔", "尼古拉", "罗伯特", "丹尼尔", "迈克尔", "安娜",
] as const;

function clean(value: string): string {
  return value.replace(/[。！？!?；;]+/g, "，").replace(/，+/g, "，").replace(/^，|，$/g, "").trim();
}

function clip(value: string, max: number): string {
  return [...value].slice(0, max).join("");
}

const DANGLING_CLAUSE_END_PATTERN = /(?:的|并|同时|随后|转而|改为|通过|试图|准备|意图|而非|而非中|试图平衡|是应急|出资补|[，,](?:向|对|把|将|让|以|从|与|和|及|但|且))$/;

function compactCompleteClause(value: string, max: number, fallback: string): string {
  const normalized = clean(value);
  if ([...normalized].length <= max && !DANGLING_CLAUSE_END_PATTERN.test(normalized)) {
    return normalized;
  }

  const clauses = normalized
    .split(/[，,。！？!?；;]/)
    .map((clause) => clause.trim())
    .filter((clause) => (
      [...clause].length >= 6
      && [...clause].length <= max
      && !DANGLING_CLAUSE_END_PATTERN.test(clause)
    ));
  return clauses[clauses.length - 1] ?? fallback;
}

function decisionAction(seed: HistorySeed): string {
  return clean(seed.decision).replace(/^是否/, "");
}

const CARD_FACE_VERBS = [
  "免费开放", "同步发出", "公开处决", "强行接管", "集中攻击", "发动伏击",
  "夜袭", "封锁", "接管", "撤回", "拒绝", "扣下", "烧毁", "护送",
  "释放", "处决", "公开", "签署", "发布", "开放", "进攻", "撤退",
  "齐射", "出战", "渡江", "突围", "交付", "传达", "写进", "拥立",
  "放出", "担保", "反对", "封存", "唤醒", "接受", "组织", "暂压",
  "下放", "坚持", "解开", "投向", "执行",
] as const;

function cardFaceFromAction(value: string): string {
  const normalized = clean(value);
  const clauses = normalized
    .split(/[，,；;]/)
    .map((clause) => clause
      .replace(/^(?:在|趁|当|等到).*?(?=(?:立即|提前|公开|强行|集中|发动|夜袭|封锁|接管|撤回|拒绝|扣下|烧毁|护送|释放|处决|签署|发布|开放|进攻|撤退|齐射|出战|渡江|突围|交付|传达|写进|拥立|放出|担保|反对|封存|唤醒|接受|组织|暂压|下放|坚持|解开|投向|执行))/u, "")
      .replace(/^(?:立即|提前|公开|当面|强行)/, "")
      .replace(/^(?:并且|并|但|且|随后|然后|再)/, "")
      .trim())
    .filter(Boolean);

  for (const clause of [...clauses].reverse()) {
    if ([...clause].length >= 4 && [...clause].length <= 12) return clause;
    for (const verb of CARD_FACE_VERBS) {
      const verbIndex = clause.lastIndexOf(verb);
      if (verbIndex < 0) continue;
      const candidate = clause.slice(verbIndex);
      if ([...candidate].length >= 4 && [...candidate].length <= 12) return candidate;
    }
  }
  return "按原计划行动";
}

function seedHash(seed: HistorySeed): number {
  return Math.abs(seed.id.split("").reduce(
    (sum, character, index) => sum + character.charCodeAt(0) * (index + 1),
    0,
  ));
}

function eventSubject(seed: HistorySeed): string {
  const subject = clean(seed.eventName)
    .replace(/前的.*$/, "")
    .replace(/前夕.*$/, "")
    .replace(/的最后.*$/, "")
    .trim();
  return clip(subject || clean(seed.eventName), 8);
}

function fixedNarrative(seed: HistorySeed): string {
  const first = `${clip(clean(seed.baselineFacts[0]), 30)}，${clip(clean(seed.baselineFacts[1]), 28)}。`;
  const second = `${clip(clean(seed.baselineFacts[2]), 30)}，你以${clip(clean(seed.role), 22)}的身份抵达现场。`;
  let thirdBody = `${clip(clean(seed.urgency), 30)}，你必须决定是否${clip(decisionAction(seed), 40)}`;
  let narrative = `${first}${second}${thirdBody}。`;
  if ([...narrative].length < 96) {
    thirdBody += "，在场各方都会依照你的命令改变行动";
    narrative = `${first}${second}${thirdBody}。`;
  }
  return clip(narrative, 159).replace(/[，、]$/, "") + (clip(narrative, 159).endsWith("。") ? "" : "。");
}

function choices(
  seed: HistorySeed,
  powerChoice: TimelineTurn["choices"][2],
): TimelineTurn["choices"] {
  const originalAction = decisionAction(seed);
  const event = clean(seed.eventName);
  const eventKey = compactCompleteClause(event, 18, "这一历史现场");
  const action = compactCompleteClause(
    originalAction,
    28,
    `执行改变${eventKey}走向的关键命令`,
  );
  const eventShort = eventSubject(seed);
  const faceSubject = clip(eventShort, 6);
  const playerActor = `以${clip(seed.role, 18)}身份到场的你`;
  const deadline = clip(clean(seed.urgency), 20);
  const reformVariants = [
    {
      displayLabel: (subject: string) => `抢在${subject}前改令`,
      label: (subject: string) => `抢在${subject}落定前扣下旧令，由你另发一份相反命令`,
      action: (subject: string) => `扣下${subject}旧令并另发相反命令`,
      result: (subject: string) => `${subject}原有命令被你当场截断`,
      cost: "被绕过的负责人立即追究你的责任",
    },
    {
      displayLabel: (subject: string) => `摊开${subject}证据`,
      label: (subject: string) => `把${subject}的关键事实当众说破，逼原负责人立即表态`,
      action: (subject: string) => `公开${subject}关键事实并要求负责人表态`,
      result: (subject: string) => `${subject}各方被迫公开各自立场`,
      cost: "被点名的一方开始追查证据来源",
    },
    {
      displayLabel: (subject: string) => `${subject}当场换人`,
      label: (subject: string) => `撤下负责${subject}的原执行者，另找一队人立刻接手`,
      action: (subject: string) => `撤下负责${subject}的人并另派一队接手`,
      result: (subject: string) => `${subject}改由另一批人负责执行`,
      cost: "被撤下的人开始联手阻挠新命令",
    },
    {
      displayLabel: (subject: string) => `${subject}越级送令`,
      label: (subject: string) => `绕过负责${subject}的上级，把相反命令直接送到一线`,
      action: (subject: string) => `绕过负责${subject}的上级并送出相反命令`,
      result: (subject: string) => `${subject}的命令第一次越过原负责人`,
      cost: "命令一旦出错，全部责任都会落到你身上",
    },
  ] as const;
  const reform = reformVariants[seedHash(seed) % reformVariants.length];
  const reformLabel = reform.label(eventShort);
  const reformAction = reform.action(eventShort);
  return [
    {
      id: "A",
      label: action,
      displayLabel: cardFaceFromAction(action) === "按原计划行动"
        ? `推进${faceSubject}`
        : cardFaceFromAction(action),
      intent: "按原定方案继续行动",
      deviationClass: "nudge",
      usesModernKnowledge: false,
      actionSpec: { actor: playerActor, action, target: clip(event, 28), deadline },
      instantEcho: {
        directResult: "你下达命令后，现场众人立即照此行动",
        unexpectedCost: "真实历史中的旧矛盾继续累积",
        beneficiary: "依靠原计划行动的人",
        payer: "原本希望改变结果的人",
      },
    },
    {
      id: "B",
      label: reformLabel,
      displayLabel: reform.displayLabel(faceSubject),
      intent: `在${eventShort}完成前改变真实执行关系`,
      deviationClass: "reform",
      usesModernKnowledge: false,
      actionSpec: { actor: playerActor, action: reformAction, target: clip(eventKey, 28), deadline },
      instantEcho: {
        directResult: reform.result(eventShort),
        unexpectedCost: reform.cost,
        beneficiary: `在${eventShort}中被旧命令压住的人`,
        payer: `原先掌握${eventShort}执行权的人`,
      },
    },
    powerChoice,
  ];
}

function rollChoices(
  seed: HistorySeed,
  powerChoice: TimelineTurn["choices"][2],
): TimelineTurn["rollChoices"] {
  const event = clean(seed.eventName);
  const eventKey = compactCompleteClause(event, 18, "这一历史现场");
  const eventShort = eventSubject(seed);
  const faceSubject = clip(eventShort, 6);
  const playerActor = `以${clip(seed.role, 18)}身份到场的你`;
  const deadline = clip(clean(seed.urgency), 20);
  const cautiousVariants = [
    {
      displayLabel: (subject: string) => `核对${subject}消息`,
      label: (subject: string) => `找两名知情者核对${subject}的关键消息，确认后再下令`,
      action: (subject: string) => `让两名知情者核对${subject}消息后再下令`,
    },
    {
      displayLabel: (subject: string) => `追问${subject}来路`,
      label: (subject: string) => `先查清${subject}消息从谁手里传来，再亲自送出命令`,
      action: (subject: string) => `追查${subject}消息来源后亲自送出命令`,
    },
    {
      displayLabel: (subject: string) => `写明${subject}风险`,
      label: (subject: string) => `把${subject}这件事的风险写进命令，再交给原执行者`,
      action: (subject: string) => `写明${subject}风险后交给原执行者`,
    },
    {
      displayLabel: (subject: string) => `叫${subject}知情者作答`,
      label: (subject: string) => `请${subject}知情者当面作答，再决定是否放行`,
      action: (subject: string) => `让${subject}知情者作答后决定是否放行`,
    },
  ] as const;
  const radicalVariants = [
    {
      displayLabel: (subject: string) => `${subject}另换人手`,
      label: (subject: string) => `撤下负责${subject}的原执行者，另派一队人立刻接手`,
      action: (subject: string) => `撤下负责${subject}的人并另派一队接手`,
    },
    {
      displayLabel: (subject: string) => `逼${subject}各方表态`,
      label: (subject: string) => `把${subject}关键事实摊开，逼有决定权的人当场表态`,
      action: (subject: string) => `公开${subject}事实并逼决策者表态`,
    },
    {
      displayLabel: (subject: string) => `截断${subject}传令路`,
      label: (subject: string) => `截断${subject}旧传令路，另派人把命令直接送到一线`,
      action: (subject: string) => `截断${subject}旧传令路并另派人送出命令`,
    },
    {
      displayLabel: (subject: string) => `${subject}越级送令`,
      label: (subject: string) => `绕过负责${subject}的上级，把命令直接送到一线`,
      action: (subject: string) => `越过负责${subject}的上级并把命令送到一线`,
    },
  ] as const;
  const cautious = cautiousVariants[seedHash(seed) % cautiousVariants.length];
  const radical = radicalVariants[(seedHash(seed) + 1) % radicalVariants.length];
  const cautiousLabel = cautious.label(eventShort);
  const cautiousAction = cautious.action(eventShort);
  const radicalLabel = radical.label(eventShort);
  const radicalAction = radical.action(eventShort);
  return [
    {
      id: "A",
      label: cautiousLabel,
      displayLabel: cautious.displayLabel(faceSubject),
      intent: `核清${eventShort}的具体信息后再行动`,
      deviationClass: "nudge",
      usesModernKnowledge: false,
      actionSpec: { actor: playerActor, action: cautiousAction, target: clip(event, 28), deadline },
      instantEcho: {
        directResult: `${eventShort}的关键信息得到当面核实`,
        unexpectedCost: "核实过程耗掉最后一段准备时间",
        beneficiary: `会被${eventShort}直接影响的人`,
        payer: `等待${eventShort}命令的执行者`,
      },
    },
    {
      id: "B",
      label: radicalLabel,
      displayLabel: radical.displayLabel(faceSubject),
      intent: `改变${eventShort}的执行者或传令关系`,
      deviationClass: "reform",
      usesModernKnowledge: false,
      actionSpec: { actor: playerActor, action: radicalAction, target: clip(eventKey, 28), deadline },
      instantEcho: {
        directResult: `${eventShort}原有执行关系当场改变`,
        unexpectedCost: "被绕过的人立刻追究命令来源",
        beneficiary: `此前无权影响${eventShort}的人`,
        payer: `原先掌握${eventShort}命令的人`,
      },
    },
    powerChoice,
  ];
}

export function getFixedPowerChoicePool(
  seed: HistorySeed,
): readonly TimelineTurn["choices"][2][] {
  const pool = (FIXED_POWER_CHOICES as Record<
    string,
    readonly TimelineTurn["choices"][2][]
  >)[seed.id];
  if (!pool || pool.length !== 6) {
    throw new Error(`Fixed power choices are missing for ${seed.id}.`);
  }
  return pool;
}

export function getFixedOpeningPowerIds(seed: HistorySeed): PowerId[] {
  return getFixedPowerChoicePool(seed).map((choice) => {
    if (!choice.powerId) throw new Error(`Fixed power choice is missing powerId for ${seed.id}.`);
    return choice.powerId;
  });
}

export function getFixedOpening(
  seed: HistorySeed,
  openingPowerIds?: readonly [PowerId, PowerId],
): TimelineTurn {
  const node = getTimelineNode(1, seed.year);
  const openingDateLabel = seed.year < 0
    ? formatHistoricalYear(seed.year)
    : seed.dateLabel.trim() || formatHistoricalYear(seed.year);
  const nameHash = Math.abs(seed.id.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0));
  const protagonistName = seed.perspective === "china"
    ? PROTAGONIST_NAMES[nameHash % 30]
    : PROTAGONIST_NAMES[30 + (nameHash % 20)];
  const powerPool = getFixedPowerChoicePool(seed);
  const selectedPowerIds = Array.isArray(openingPowerIds)
    ? openingPowerIds
    : [
        powerPool[0].powerId,
        powerPool[1].powerId,
      ] as readonly [PowerId, PowerId];
  const selectedPowerChoices = selectedPowerIds.map((powerId) => {
    const choice = powerPool.find((candidate) => candidate.powerId === powerId);
    if (!choice) throw new Error(`Power ${powerId} is not prepared for ${seed.id}.`);
    return choice;
  }) as [TimelineTurn["choices"][2], TimelineTurn["choices"][2]];
  const opening = {
    chapter: 1,
    chapterName: "历史现场",
    protagonistName,
    protagonistAge: node.protagonistAge,
    lifeStage: node.lifeStage,
    yearLabel: `${openingDateLabel} · ${node.protagonistAge}岁`,
    location: clip(seed.location, 28),
    role: clip(seed.role, 24),
    causalBridge: "你此刻的命令将成为整条时间线的源头",
    worldStateChange: "历史尚未改变，决定权已经落到你手中",
    divergenceProof: clip(clean(seed.historicalOutcome), 48),
    immediateObjective: clip(decisionAction(seed), 40),
    timePressure: clip(clean(seed.urgency), 36),
    headline: clip(seed.eventName, 22),
    narrative: fixedNarrative(seed),
    baselineAnchor: clip(clean(seed.historicalOutcome), 54),
    historicalAnchors: seed.baselineFacts.map((fact) => clip(clean(fact), 32)),
    previousEcho: null,
    choices: choices(seed, selectedPowerChoices[0]),
    rollChoices: rollChoices(seed, selectedPowerChoices[1]),
    memorySummary: clip(`你在${seed.eventName}现场获得改变真实历史的决定权`, 54),
    causalLedger: [],
    visualTone: seed.visualTone,
    generationSource: "fixed",
  };

  return parseTimelineTurn(JSON.stringify(opening), {
    expectedChapter: 1,
    expectedYearLabel: opening.yearLabel,
    expectedProtagonistAge: node.protagonistAge,
    expectedLifeStage: node.lifeStage,
    expectedGenerationSource: "fixed",
  });
}
