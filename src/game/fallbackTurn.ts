import type { GameScenario } from "./reducer";
import { getTravelerAbility } from "./profile";
import type { PlayedTurn } from "./prompts";
import { alternatePresentSchema, customActionResolutionSchema, timelineTurnSchema, type AlternatePresent, type CustomActionResolution, type TimelineTurn } from "./schema";
import { getTimelineNode, type DecisionChapter } from "./timelinePlan";
import { buildCanonicalCustomResolution } from "./customCanon";
import { buildPivotalBrief, type PivotKind } from "./worldCanon";

function previousEcho(playedTurns: readonly PlayedTurn[]): TimelineTurn["previousEcho"] {
  const previous = playedTurns.at(-1);
  if (!previous) return null;
  return previous.resolvedEcho;
}

export function createFallbackCustomActionResolution(
  scenario: GameScenario,
  turn: TimelineTurn,
  action: string,
): CustomActionResolution {
  const declaredOutcome = [...action.trim()].slice(0, 80).join("");
  const deviationClass = /废除|杀|炸|焚|夺权|起兵|成功|全部/.test(declaredOutcome)
    ? "rupture"
    : /公开|谈判|组织|制度|规则|联合|请愿/.test(declaredOutcome)
      ? "reform"
      : "nudge";
  return customActionResolutionSchema.parse(
    buildCanonicalCustomResolution(scenario.profile, turn, declaredOutcome, deviationClass),
  );
}

function visualTone(scenario: GameScenario, chapter: DecisionChapter): TimelineTurn["visualTone"] {
  if (chapter <= 3) return scenario.seed.visualTone;
  if (chapter <= 5) return "revolution";
  if (chapter <= 7) return "industry";
  if (chapter <= 9) return "exchange";
  return "digital";
}

const RELAY_BRIDGES = [
  "你的第一项选择成为正式命令，本代决策者在危机中接棒",
  "被改写的命令沿权力网络扩散，你以新的关键身份接棒",
  "一年后的制度冲突首次公开爆发，新一代决策者接棒",
  "三年后的政权与联盟开始重排，本代关键人物接棒",
  "十年后的国家秩序迎来第一次总决断，本代指挥者接棒",
  "三十年的制度后果汇成全国危机，本代改革者接棒",
  "百年后的文明路径出现决战，本代关键参与者接棒",
  "新的世界秩序进入公开对决，本代决策者接棒",
  "历代选择沉入国家机器，本代核心人物接棒",
  "所有余波抵达2026前夕，最后一代决策者接棒",
];

const PIVOT_SCENES: Record<PivotKind, { role: string; location: string; headline: string; stakes: string; objective: string }> = {
  power: { role: "新朝册立使", location: "继承诏书宣读大殿", headline: "新政权第一次册立", stakes: "这次册立将决定新政权的继承与合法性", objective: "决定继承诏书由谁公开并获得军队承认" },
  technology: { role: "国家工坊总监", location: "科学院与军械工坊联席会", headline: "第一座国家科学院", stakes: "这项决议将决定技术、人才与生产能否成为国力", objective: "决定工坊、学校与生产预算由谁掌握" },
  institution: { role: "新法起草官", location: "全国法令颁布会议", headline: "新制度第一次表决", stakes: "这次表决将决定法令、官署与执行权的归属", objective: "决定新法如何进入官署并约束掌权者" },
  war: { role: "决战联军统帅", location: "决定国运的会战中军帐", headline: "国运会战前一刻", stakes: "这场会战将决定军队、边境与联盟的存亡", objective: "决定主力军与盟军是否立刻投入决战" },
  trade: { role: "全国财政使", location: "货币与税制紧急议政厅", headline: "新货币能否通行", stakes: "这项税制将决定货币、市场与全国财政秩序", objective: "决定新税与货币由哪些市场率先执行" },
  knowledge: { role: "国立学府总教习", location: "全国学校与出版议会", headline: "知识第一次向全民开放", stakes: "这项决议将决定学校、出版与思想传播权", objective: "决定学校与出版网络是否向普通人开放" },
  livelihood: { role: "全国粮政使", location: "土地与粮食分配大会", headline: "土地法决定千万生计", stakes: "这项土地法将决定粮食、劳动与人口的长期分配", objective: "决定土地与粮食优先保障谁的生存" },
};

function compact(value: string, max: number): string {
  return [...value].slice(0, max).join("");
}

function summarizeCustomCanon(
  facts: readonly { sourceText: string }[],
  max = 42,
): string {
  if (facts.length === 0) return "";
  const perFact = Math.max(10, Math.floor((max - facts.length + 1) / facts.length));
  return facts.map((fact) => compact(fact.sourceText, perFact)).join("；");
}

export function createFallbackTurn(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  chapter: DecisionChapter,
): TimelineTurn {
  const ability = getTravelerAbility(scenario.profile);
  const node = getTimelineNode(chapter, scenario.seed.year);
  const previous = playedTurns.at(-1)?.turn;
  const echo = previousEcho(playedTurns);
  const yearLabel = chapter <= 3
    ? `${scenario.seed.dateLabel} · ${node.jumpLabel}`
    : `${node.targetYear}年 · ${node.jumpLabel}`;
  const objective = chapter === 1
    ? scenario.seed.decision
    : `决定上一项选择形成的新秩序，下一步由谁执行、由谁承担代价`;
  const relayBridge = RELAY_BRIDGES[Math.max(0, chapter - 2)];
  const brief = chapter === 1
    ? null
    : buildPivotalBrief(scenario, playedTurns, chapter as Exclude<DecisionChapter, 1>);
  const pivotalScene = brief ? PIVOT_SCENES[brief.pivotKind] : null;
  const activeCustomCanon = brief?.activeCustomCanon ?? [];
  const activeCanonSummary = summarizeCustomCanon(activeCustomCanon);
  const latestChoice = playedTurns.at(-1)?.selectedChoiceLabel ?? scenario.seed.decision;
  const latestEcho = playedTurns.at(-1)?.resolvedEcho;
  const requiredLedger = brief?.requiredCausalChapters.map((requiredChapter) => {
    const source = playedTurns.find((played) => played.turn.chapter === requiredChapter);
    return {
      fact: source?.selectedChoiceLabel ?? `第${requiredChapter}节点已经生效`,
      causedByChapter: requiredChapter,
      mustAffect: compact(PIVOT_SCENES[brief.pivotKind].stakes, 28),
    };
  }) ?? [{ fact: compact(scenario.seed.decision, 28), causedByChapter: 0, mustAffect: "第一项玩家选择" }];

  return timelineTurnSchema.parse({
    timelineName: `${scenario.seed.eventName}异史`,
    chapter,
    chapterName: node.chapterName,
    yearLabel,
    location: chapter === 1 ? scenario.seed.location : pivotalScene!.location,
    role: chapter === 1 ? scenario.seed.role : pivotalScene!.role,
    identityBridge: chapter === 1 ? "你的现代意识直接进入这一历史现场" : relayBridge,
    profileAdvantage: `${scenario.profile.typeCode}「${ability.title}」能${ability.preview.replace("预判时", "")}`,
    rippleLens: chapter === 1 ? "origin" : brief!.rippleLens,
    causalBridge: chapter === 1
      ? `你在${scenario.seed.eventName}作出的决定将成为整条时间线的源头`
      : compact(activeCustomCanon.length > 0
        ? `玩家钦定「${activeCanonSummary}」仍生效，并让「${latestChoice}」引爆本次决断`
        : `「${latestChoice}」通过${playedTurns.at(-1)?.causalMechanism ?? "命令与执行网络"}引爆本次决断`, 54),
    turningPointStakes: chapter === 1
      ? compact(`这一决定将改变${scenario.seed.eventName}及其后的真实历史秩序`, 54)
      : pivotalScene!.stakes,
    worldStateChange: chapter === 1
      ? compact(`历史尚未改写；你的第一项选择将首先改变：${scenario.seed.decision}`, 72)
      : compact(activeCustomCanon.length > 0
        ? `玩家钦定「${activeCanonSummary}」持续生效；「${latestChoice}」已改变当前秩序`
        : `「${latestChoice}」已成正史；${latestEcho?.directResult ?? "新命令已经执行"}`, 72),
    divergenceProof: chapter === 1
      ? compact(`真实历史中${scenario.seed.historicalOutcome}；当前线正等待你的决定`, 72)
      : compact(activeCustomCanon.length > 0
        ? `真实历史中没有「${activeCanonSummary}」；当前线这些正史已催生${pivotalScene!.headline}`
        : `真实历史中没有「${latestChoice}」；当前线已因此出现${pivotalScene!.headline}`, 72),
    immediateObjective: chapter === 1 ? objective : pivotalScene!.objective,
    timePressure: chapter === 1 ? scenario.seed.urgency : `下一个时间窗口将在${node.jumpLabel}结束前关闭`,
    headline: chapter === 1 ? scenario.seed.eventName : pivotalScene!.headline,
    narrative: chapter === 1
      ? `你已经抵达${scenario.seed.location}。${scenario.seed.urgency}，眼前的人都在等待你对“${scenario.seed.decision}”作出决定。`
      : compact(`你抵达${pivotalScene!.location}。${pivotalScene!.headline}将在今天决定，所有关键人物都在等待你的命令。`, 72),
    baselineAnchor: scenario.seed.historicalOutcome,
    previousEcho: chapter === 1 ? null : echo,
    choices: [
      { id: "A", label: "保留现有安排，只修正最紧迫的漏洞", intent: "用小范围试点降低立即损失", deviationClass: "nudge", usesTravelerStrength: false, instantEcho: { directResult: "执行者获得了短暂喘息", unexpectedCost: "根本矛盾被推迟而没有消失", beneficiary: "当前秩序中的普通参与者", payer: "被延后补偿的边缘群体" } },
      { id: "B", label: `用${ability.title}的本能重写规则`, intent: ability.style, deviationClass: "reform", usesTravelerStrength: true, instantEcho: { directResult: "新的协商机制开始运转", unexpectedCost: "既得利益者组织起明确反对", beneficiary: "能进入新规则的人", payer: "失去特权的旧管理者" } },
      { id: "C", label: "废除旧约束，把决定权交给新的联盟", intent: "用不可逆的断裂换取全新路径", deviationClass: "rupture", usesTravelerStrength: false, instantEcho: { directResult: "旧命令体系立即失效", unexpectedCost: "秩序真空引发争夺与恐慌", beneficiary: "长期被排除的行动者", payer: "依赖旧体系生存的人" } },
    ],
    memorySummary: activeCustomCanon.length > 0
      ? `第${chapter}节点继续兑现玩家钦定“${activeCanonSummary}”，并吸收“${latestChoice}”的后果。`
      : `第${chapter}节点沿着“${playedTurns.at(-1)?.selectedChoiceLabel ?? scenario.seed.decision}”继续分化。`,
    metrics: previous?.metrics ?? { stability: 50, prosperity: 50, freedom: 50, cost: 50 },
    metricDeltas: { stability: 0, prosperity: 0, freedom: 0, cost: 0 },
    causalLedger: requiredLedger,
    callbackUsed: playedTurns.at(-1)?.selectedChoiceLabel ?? null,
    visualTone: visualTone(scenario, chapter),
    generationSource: "fallback",
  });
}

export function createFallbackEnding(scenario: GameScenario, playedTurns: readonly PlayedTurn[]): AlternatePresent {
  const chosenEcho = (played: PlayedTurn) => played.resolvedEcho;
  const first = playedTurns[0];
  const middle = playedTurns[Math.floor(playedTurns.length / 2)];
  const last = playedTurns.at(-1);
  return alternatePresentSchema.parse({
    worldName: `${scenario.seed.eventName}之后的世界`,
    frontPageHeadline: `${scenario.profile.name}改变的时间线抵达 2026`,
    historyTimeline: playedTurns.map((played) => ({ chapter: played.turn.chapter, yearLabel: played.turn.yearLabel, playerChoice: played.selectedChoiceLabel, consequence: chosenEcho(played)?.directResult ?? played.turn.memorySummary })),
    causalChains: [first, middle, last].map((played) => ({ origin: played?.selectedChoiceLabel ?? scenario.seed.decision, transformation: played?.turn.memorySummary ?? scenario.seed.historicalOutcome, payoff: played ? (chosenEcho(played)?.unexpectedCost ?? "代价进入普通生活") : "历史仍保留原有惯性" })),
    ordinaryLife2026: ["学校会把这条分岔时间线列为基础历史课", "通勤与城市规则保留了早期选择形成的制度痕迹", "家庭新闻终端每天显示历史偏离度与公共代价"],
    greatestGain: chosenEcho(last ?? first)?.beneficiary ?? "进入新规则的普通人",
    hiddenPrice: chosenEcho(last ?? first)?.unexpectedCost ?? "制度改变留下长期协调成本",
    strangestDetail: "每个人的身份证都记录其家族第一次进入新时间线的年份",
    biggestBeneficiary: chosenEcho(middle ?? first)?.beneficiary ?? "新秩序参与者",
    biggestLoser: chosenEcho(middle ?? first)?.payer ?? "旧秩序维护者",
    rewriteLevel: "跨时代改写",
    plausibilityScore: 68,
    plausibilityReason: "总结严格沿用十一项玩家选择和即时后果，没有添加新的决定性事件。",
    shareLine: `我从${scenario.seed.eventName}开始，用十一项选择抵达了另一个 2026。`,
  });
}
