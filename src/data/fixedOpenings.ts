import { parseTimelineTurn, type TimelineTurn } from "../game/schema";
import { getTimelineNode } from "../game/timelinePlan";
import type { HistorySeed } from "../game/types";
import { formatHistoricalYear } from "./historicalYear";

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

const SURREAL_TEMPLATES = [
  {
    displayLabel: "让谎言现形",
    label: (event: string) => `让${event}所有谎言化为黑烟并在期限前公开审判`,
    intent: "改变语言与真相的物理规则",
    actor: "你与被迫说真话的在场者",
    action: "让谎言化为可见黑烟并公开核验",
    result: "所有隐瞒当场留下可见证据",
    cost: "沉默也会被误判为欺骗",
    beneficiary: "长期被蒙蔽的人",
    payer: "依赖秘密维系统治的人",
  },
  {
    displayLabel: "借来明日记忆",
    label: (event: string) => `让${event}众人先记住明日后果再于此刻重新表决`,
    intent: "折叠记忆与时间的先后次序",
    actor: "你与提前拥有明日记忆的众人",
    action: "把明日后果写入众人记忆后重新表决",
    result: "众人带着后果记忆重做决定",
    cost: "真实经历与未来记忆开始混淆",
    beneficiary: "原本无法预见代价的人",
    payer: "靠信息差获利的权威",
  },
  {
    displayLabel: "折叠地平线",
    label: (event: string) => `折叠${event}两地距离让援军与粮秣同时抵达现场`,
    intent: "改变空间距离与后勤秩序",
    actor: "你与跨过折叠地平线的队伍",
    action: "折叠两地距离并搬运援军粮秣",
    result: "远方资源在一刻内抵达现场",
    cost: "被折叠的边界再也无法稳定",
    beneficiary: "原本等不到援助的人",
    payer: "依靠地理封锁的一方",
  },
  {
    displayLabel: "让文字拒绝服从",
    label: (event: string) => `命令${event}所有文书自行删去谎言只保留真实条款`,
    intent: "让文字获得拒绝虚假命令的能力",
    actor: "你与突然觉醒的所有文字",
    action: "让文书删去谎言并重排真实条款",
    result: "伪令与密约在纸面自行消失",
    cost: "私人书信也不再能够保密",
    beneficiary: "被文书权力压制的人",
    payer: "操纵档案与诏令的人",
  },
  {
    displayLabel: "冻结一刻因果",
    label: (event: string) => `冻结${event}一刻钟因果让所有人先看清每种结局`,
    intent: "暂停因果并公开所有选择后果",
    actor: "你与停在因果之外的现场众人",
    action: "冻结一刻因果并展示每种结局",
    result: "所有人同时看见各自选择的后果",
    cost: "有人开始拒绝承担任何未知",
    beneficiary: "过去无权知情的人",
    payer: "依靠仓促决策的人",
  },
  {
    displayLabel: "让誓言长出锁链",
    label: (event: string) => `让${event}每句誓言化为锁链束缚违背承诺的人`,
    intent: "把政治承诺变成不可逃避的实体",
    actor: "你与被誓言锁链缠住的各方",
    action: "让公开誓言化为约束违约者的锁链",
    result: "所有承诺立即获得实体约束",
    cost: "善意的变通也会触发惩罚",
    beneficiary: "长期遭受背约的人",
    payer: "习惯反复毁约的强者",
  },
  {
    displayLabel: "唤醒器物作证",
    label: (event: string) => `唤醒${event}关键器物让它们逐件陈述亲历的真相`,
    intent: "让沉默的物证拥有记忆与证词",
    actor: "你与突然能够作证的历史器物",
    action: "唤醒关键器物并公开其全部记忆",
    result: "现场物证逐件说出亲历事实",
    cost: "无人还能隐藏器物见过的秘密",
    beneficiary: "缺少人证的受害者",
    payer: "销毁证词却保留器物的人",
  },
  {
    displayLabel: "打开未来旁听席",
    label: (event: string) => `打开${event}通往未来的旁听席让后世民众现场质询`,
    intent: "让未来社会直接审视此刻的决定",
    actor: "你与从未来旁听席发问的民众",
    action: "打开未来旁听席并接受后世公开质询",
    result: "后世民众当场参与这次决定",
    cost: "当代秩序失去解释自己的特权",
    beneficiary: "将承担长期后果的普通人",
    payer: "只对当下负责的掌权者",
  },
] as const;

function surrealChoice(seed: HistorySeed, offset: number): TimelineTurn["choices"][2] {
  const eventKey = `${eventSubject(seed)}现场`;
  const template = SURREAL_TEMPLATES[(seedHash(seed) + offset) % SURREAL_TEMPLATES.length];
  const deadline = clip(clean(seed.urgency), 20);
  const playerActor = `以${clip(seed.role, 18)}身份到场的你`;
  return {
    id: "C",
    label: template.label(eventKey),
    displayLabel: template.displayLabel,
    intent: template.intent,
    deviationClass: "rupture",
    usesModernKnowledge: false,
    actionSpec: {
      actor: `${playerActor}，并联合${template.actor.replace(/^你与/, "")}`,
      action: template.action,
      target: clip(clean(seed.eventName), 28),
      deadline,
    },
    instantEcho: {
      directResult: template.result,
      unexpectedCost: template.cost,
      beneficiary: template.beneficiary,
      payer: template.payer,
    },
  };
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

function choices(seed: HistorySeed): TimelineTurn["choices"] {
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
    surrealChoice(seed, 0),
  ];
}

function rollChoices(seed: HistorySeed): TimelineTurn["rollChoices"] {
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
    surrealChoice(seed, 3),
  ];
}

export function getFixedOpening(seed: HistorySeed): TimelineTurn {
  const node = getTimelineNode(1, seed.year);
  const openingDateLabel = seed.year < 0
    ? formatHistoricalYear(seed.year)
    : seed.dateLabel.trim() || formatHistoricalYear(seed.year);
  const nameHash = Math.abs(seed.id.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0));
  const protagonistName = seed.perspective === "china"
    ? PROTAGONIST_NAMES[nameHash % 30]
    : PROTAGONIST_NAMES[30 + (nameHash % 20)];
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
    choices: choices(seed),
    rollChoices: rollChoices(seed),
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
