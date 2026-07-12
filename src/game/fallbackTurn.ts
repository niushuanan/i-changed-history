import type { GameScenario } from "./reducer";
import type { PlayedTurn } from "./prompts";
import { alternatePresentSchema, timelineTurnSchema, type AlternatePresent, type TimelineTurn } from "./schema";
import { getTimelineNode, type DecisionChapter } from "./timelinePlan";

function previousEcho(playedTurns: readonly PlayedTurn[]): TimelineTurn["previousEcho"] {
  const previous = playedTurns.at(-1);
  if (!previous) return null;
  return previous.turn.choices.find((choice) => choice.id === previous.selectedChoiceId)?.instantEcho ?? null;
}

function visualTone(scenario: GameScenario, chapter: DecisionChapter): TimelineTurn["visualTone"] {
  if (chapter <= 3) return scenario.seed.visualTone;
  if (chapter <= 5) return "revolution";
  if (chapter <= 7) return "industry";
  if (chapter <= 9) return "exchange";
  return "digital";
}

export function createFallbackTurn(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  chapter: DecisionChapter,
): TimelineTurn {
  const node = getTimelineNode(chapter, scenario.seed.year);
  const previous = playedTurns.at(-1)?.turn;
  const echo = previousEcho(playedTurns);
  const yearLabel = chapter <= 3
    ? `${scenario.seed.dateLabel} · ${node.jumpLabel}`
    : `${node.targetYear}年 · ${node.jumpLabel}`;
  const objective = chapter === 1
    ? scenario.seed.decision
    : `决定上一项选择形成的新秩序，下一步由谁执行、由谁承担代价`;

  return timelineTurnSchema.parse({
    timelineName: `${scenario.seed.eventName}异史`,
    chapter,
    chapterName: node.chapterName,
    yearLabel,
    location: chapter === 1 ? scenario.seed.location : `${scenario.seed.location}及其影响圈`,
    role: chapter === 1 ? scenario.seed.role : `${scenario.profile.name}，新时间线的关键协调者`,
    immediateObjective: objective,
    timePressure: chapter === 1 ? scenario.seed.urgency : `下一个时间窗口将在${node.jumpLabel}结束前关闭`,
    headline: chapter === 1 ? scenario.seed.eventName : `${node.jumpLabel}，旧选择开始改变制度`,
    narrative: chapter === 1
      ? `你已经抵达${scenario.seed.location}。${scenario.seed.urgency}，眼前的人都在等待你对“${scenario.seed.decision}”作出决定。`
      : `上一项选择已经进入现实。你面前的命令、账册与人群都证明，新秩序带来了收益，也把代价转移给了另一批人。你必须决定下一步如何落地。`,
    baselineAnchor: scenario.seed.historicalOutcome,
    previousEcho: chapter === 1 ? null : echo,
    choices: [
      { id: "A", label: "保留现有安排，只修正最紧迫的漏洞", intent: "用小范围试点降低立即损失", deviationClass: "nudge", instantEcho: { directResult: "执行者获得了短暂喘息", unexpectedCost: "根本矛盾被推迟而没有消失", beneficiary: "当前秩序中的普通参与者", payer: "被延后补偿的边缘群体" } },
      { id: "B", label: "建立公开规则，重新分配权力与资源", intent: "把个人决定变成可延续的制度", deviationClass: "reform", instantEcho: { directResult: "新的协商机制开始运转", unexpectedCost: "既得利益者组织起明确反对", beneficiary: "能进入新规则的人", payer: "失去特权的旧管理者" } },
      { id: "C", label: "废除旧约束，把决定权交给新的联盟", intent: "用不可逆的断裂换取全新路径", deviationClass: "rupture", instantEcho: { directResult: "旧命令体系立即失效", unexpectedCost: "秩序真空引发争夺与恐慌", beneficiary: "长期被排除的行动者", payer: "依赖旧体系生存的人" } },
    ],
    memorySummary: `第${chapter}节点沿着“${playedTurns.at(-1)?.selectedChoiceLabel ?? scenario.seed.decision}”继续分化。`,
    metrics: previous?.metrics ?? { stability: 50, prosperity: 50, freedom: 50, cost: 50 },
    metricDeltas: { stability: 0, prosperity: 0, freedom: 0, cost: 0 },
    causalLedger: [
      ...(previous?.causalLedger.slice(-3) ?? []),
      { fact: `时间线抵达${node.jumpLabel}`, causedByChapter: chapter, mustAffect: "下一节点的权力与普通生活" },
    ],
    callbackUsed: playedTurns.at(-1)?.selectedChoiceLabel ?? null,
    visualTone: visualTone(scenario, chapter),
  });
}

export function createFallbackEnding(scenario: GameScenario, playedTurns: readonly PlayedTurn[]): AlternatePresent {
  const chosenEcho = (played: PlayedTurn) => played.turn.choices.find((choice) => choice.id === played.selectedChoiceId)?.instantEcho;
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
