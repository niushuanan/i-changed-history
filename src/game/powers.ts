export type PowerCategory =
  | "space"
  | "time"
  | "life"
  | "body"
  | "creature"
  | "matter"
  | "resource"
  | "nature"
  | "mind"
  | "information"
  | "causality";

export type PowerDefinition = Readonly<{
  id: string;
  name: string;
  category: PowerCategory;
  rule: string;
  duration: string;
}>;

export const POWER_CATALOGUE = [
  { id: "blink-self", name: "带物瞬移", category: "space", rule: "你能带着手中一件物品瞬移到自己看得见的任意位置", duration: "瞬间发动一次" },
  { id: "teleport-crowd", name: "百人迁跃", category: "space", rule: "你能把现场最多一百人同时传送到一个你亲自到过的地点", duration: "瞬间发动一次" },
  { id: "swap-two-people", name: "交换两人位置", category: "space", rule: "你能让现场任意两个人在一瞬间交换所处位置和随身物品", duration: "瞬间发动一次" },
  { id: "door-anywhere", name: "开一扇任意门", category: "space", rule: "你能在一面实体墙上打开通往指定真实地点的门", duration: "门存在十分钟" },
  { id: "pocket-building", name: "收走一座建筑", category: "space", rule: "你能把一座建筑连同内部全部人和物收入随身口袋", duration: "本幕结束前可原样放回" },
  { id: "duplicate-place", name: "复制一个地点", category: "space", rule: "你能在附近空地复制一份当前场所及其中全部非生命物品", duration: "复制地点存在一天" },
  { id: "stretch-road", name: "拉长一段道路", category: "space", rule: "你能把指定的一百米道路拉长成一百公里且外界无法绕行", duration: "持续十二小时" },
  { id: "walk-through-walls", name: "穿过所有墙壁", category: "space", rule: "你和你触碰的人能直接穿过墙壁、城门与密封舱壁", duration: "持续一小时" },
  { id: "stop-time", name: "停止时间", category: "time", rule: "你能让除自己之外的整个现场完全停止十分钟", duration: "主观十分钟" },
  { id: "rewind-hour", name: "倒退一小时", category: "time", rule: "你能让当前地点回到一小时前的状态而自己保留全部记忆", duration: "瞬间发动一次" },
  { id: "jump-tomorrow", name: "跳到明天", category: "time", rule: "你能让指定的人或物跳过接下来的二十四小时直接抵达明天", duration: "瞬间发动一次" },
  { id: "summon-future-self", name: "召来未来的自己", category: "time", rule: "你能召来十年后的自己并与其同时行动", duration: "未来的你停留一小时" },
  { id: "borrow-tomorrow-memory", name: "借来明日记忆", category: "time", rule: "你能提前获得自己明天此刻的完整记忆", duration: "记忆永久保留" },
  { id: "repeat-minute", name: "重复一分钟", category: "time", rule: "你能让同一分钟反复发生直到自己主动接受其中一次结果", duration: "最多重复一百次" },
  { id: "age-target", name: "让一人老去四十年", category: "time", rule: "你能让指定一人的身体瞬间老去四十年而记忆不变", duration: "身体变化永久存在" },
  { id: "restore-youth", name: "让一人年轻四十年", category: "time", rule: "你能让指定一人的身体瞬间年轻四十年而记忆不变", duration: "身体变化永久存在" },
  { id: "revive-dead", name: "复活一位死者", category: "life", rule: "你能让一位已经死亡的具体人物以生前身体和记忆复活", duration: "复活持续一小时" },
  { id: "heal-room", name: "治愈全场伤病", category: "life", rule: "你能让同一房间或甲板上的所有伤病立即痊愈", duration: "治愈结果永久存在" },
  { id: "immortal-day", name: "赐予一日不死", category: "life", rule: "你能让指定一人在二十四小时内无法死亡或失去意识", duration: "持续二十四小时" },
  { id: "clone-self", name: "复制一百个自己", category: "body", rule: "你能复制出一百个拥有当前记忆且听从同一目标的自己", duration: "分身存在一天" },
  { id: "shapeshift", name: "变成任何一个人", category: "body", rule: "你能把外貌、声音和指纹完全变成一名指定的真实人物", duration: "持续十二小时" },
  { id: "copy-skill", name: "复制一项绝技", category: "body", rule: "你能完整复制现场一人的一项知识或技能并达到同等水平", duration: "持续一天" },
  { id: "invisibility", name: "完全隐身", category: "body", rule: "你能让自己和全部随身物品无法被任何人或仪器发现", duration: "持续一小时" },
  { id: "summon-giant-beast", name: "召唤一只巨兽", category: "creature", rule: "你能在指定地点召来一只百米高且只服从你一句命令的巨兽", duration: "巨兽存在一小时" },
  { id: "command-animals", name: "号令所有动物", category: "creature", rule: "你能向方圆十公里内所有动物下达一个共同的具体命令", duration: "命令持续一天" },
  { id: "universal-language", name: "听懂所有语言", category: "mind", rule: "你能听懂、读懂并流利说出现场出现的任何人类语言", duration: "持续一天" },
  { id: "infinite-money", name: "拥有无限钱财", category: "resource", rule: "你能随时取出当前时代认可且无法辨伪的任意数量货币", duration: "持续一小时，已支付货币不会消失" },
  { id: "infinite-grain", name: "生成无限粮食", category: "resource", rule: "你能让指定容器不断涌出适合当地食用的新鲜主粮", duration: "持续一天" },
  { id: "conjure-water", name: "凭空生成清水", category: "resource", rule: "你能在指定地点持续生成足够一座城市饮用的清水", duration: "持续一天" },
  { id: "transmute-material", name: "改变一种材料", category: "matter", rule: "你能把一件指定物体的材料永久变成另一种你说出的材料", duration: "变化永久存在" },
  { id: "extinguish-fire", name: "熄灭十里烈火", category: "nature", rule: "你能让方圆十里内正在燃烧的全部火焰瞬间熄灭且无法复燃", duration: "十二小时内无法复燃" },
  { id: "summon-lightning", name: "召下一道雷电", category: "nature", rule: "你能让一道雷电精确击中自己指定的人、物或地点", duration: "瞬间发动一次" },
  { id: "control-weather", name: "改写一日天气", category: "nature", rule: "你能指定方圆百公里未来二十四小时的风、雨、雪、雾与气温", duration: "持续二十四小时" },
  { id: "split-river", name: "让江河分开", category: "nature", rule: "你能让指定江河或海面从中分开并露出可通行的干燥河床", duration: "持续一小时" },
  { id: "move-mountain", name: "移动一座山", category: "nature", rule: "你能把视野内一座山整体移动到方圆十公里内的指定位置", duration: "移动结果永久存在" },
  { id: "rust-weapons", name: "锈蚀所有武器", category: "matter", rule: "你能让方圆一公里内所有被视为武器的金属制品立即锈毁", duration: "锈毁结果永久存在" },
  { id: "intangible-walls", name: "让壁垒失去实体", category: "matter", rule: "你能让指定建筑的墙壁、门窗和围栏变得可以直接穿过", duration: "持续一小时" },
  { id: "shrink-object", name: "缩小一件东西", category: "matter", rule: "你能把一件非生命物体缩小到掌心尺寸且重量同步缩小", duration: "本幕结束前可恢复" },
  { id: "enlarge-object", name: "放大一件东西", category: "matter", rule: "你能把一件非生命物体等比例放大一百倍且结构不会崩坏", duration: "持续一小时" },
  { id: "read-one-mind", name: "读取一人的思想", category: "mind", rule: "你能听见指定一人此刻全部真实想法与正在回忆的画面", duration: "持续十分钟" },
  { id: "broadcast-thought", name: "把一句话送进万人脑中", category: "mind", rule: "你能让方圆十公里内所有人同时在脑中听见你说的一句话", duration: "瞬间发动一次" },
  { id: "erase-memory", name: "删除一段记忆", category: "mind", rule: "你能永久删除指定一人关于一件具体事件的全部记忆", duration: "删除结果永久存在" },
  { id: "share-memory", name: "共享一段亲历记忆", category: "mind", rule: "你能让现场所有人以第一视角同时经历你选定的一段真实记忆", duration: "记忆体验持续一分钟" },
  { id: "see-hidden-writing", name: "看见所有隐藏文字", category: "information", rule: "你能看见现场被擦除、烧毁、加密、遮盖或尚未写下的文字", duration: "持续一小时" },
  { id: "speak-any-distance", name: "跨越距离通话", category: "information", rule: "你能与世界上任意一名指定人物实时交谈且双方清楚听见", duration: "持续十分钟" },
  { id: "locate-anything", name: "定位任何人或物", category: "information", rule: "你能立即知道一名指定人物或一件指定物品的准确位置", duration: "答案只显示一次" },
  { id: "guarantee-action", name: "保证一次行动成功", category: "causality", rule: "你能指定自己接下来完成的一项具体行动必定成功且无人能阻止", duration: "只作用于下一项行动" },
  { id: "reverse-cause", name: "颠倒一次因果", category: "causality", rule: "你能把现场一个已经发生的结果改成它自己的原因并让原原因变成结果", duration: "因果改写永久存在" },
  { id: "transfer-cost", name: "转移一次代价", category: "causality", rule: "你能把一项行动将由某人承担的全部直接代价转移给另一名指定人物", duration: "只作用于一项行动" },
  { id: "sentence-becomes-true", name: "让一句话成为现实", category: "causality", rule: "你能写下一句不超过二十字的陈述并让它立即成为客观事实", duration: "新事实永久存在" },
] as const satisfies readonly PowerDefinition[];

export type PowerId = (typeof POWER_CATALOGUE)[number]["id"];

const POWER_BY_ID = new Map<PowerId, (typeof POWER_CATALOGUE)[number]>(
  POWER_CATALOGUE.map((power) => [power.id, power]),
);

export function isPowerId(value: unknown): value is PowerId {
  return typeof value === "string" && POWER_BY_ID.has(value as PowerId);
}

export function getPowerDefinition(powerId: PowerId): (typeof POWER_CATALOGUE)[number] {
  const power = POWER_BY_ID.get(powerId);
  if (!power) throw new Error(`Unknown power: ${powerId}`);
  return power;
}

export function shuffledPowerIds(random: () => number = Math.random): PowerId[] {
  const ids = POWER_CATALOGUE.map((power) => power.id);
  for (let index = ids.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [ids[index], ids[swapIndex]] = [ids[swapIndex], ids[index]];
  }
  return ids;
}

export function createPowerRun(random: () => number = Math.random): {
  remainingPowerIds: PowerId[];
  usedPowerIds: PowerId[];
} {
  return {
    remainingPowerIds: shuffledPowerIds(random),
    usedPowerIds: [],
  };
}

export function createScenarioPowerRun(
  openingCandidateIds: readonly PowerId[],
  random: () => number = Math.random,
): {
  openingPowerIds: [PowerId, PowerId];
  remainingPowerIds: PowerId[];
  usedPowerIds: PowerId[];
} {
  const uniqueCandidates = [...new Set(openingCandidateIds)];
  if (uniqueCandidates.length < 2) {
    throw new Error("A scenario needs at least two distinct opening powers.");
  }
  for (let index = uniqueCandidates.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [uniqueCandidates[index], uniqueCandidates[swapIndex]] = [
      uniqueCandidates[swapIndex],
      uniqueCandidates[index],
    ];
  }
  const openingPowerIds: [PowerId, PowerId] = [
    uniqueCandidates[0],
    uniqueCandidates[1],
  ];
  const openingSet = new Set(openingPowerIds);
  return {
    openingPowerIds,
    remainingPowerIds: shuffledPowerIds(random).filter((powerId) => !openingSet.has(powerId)),
    usedPowerIds: [...openingPowerIds],
  };
}

export function drawPowerIds(
  remainingPowerIds: readonly PowerId[],
  count: number,
): {
  drawnPowerIds: PowerId[];
  remainingPowerIds: PowerId[];
} {
  if (!Number.isInteger(count) || count < 1) throw new Error("Power draw count must be positive.");
  if (remainingPowerIds.length < count) throw new Error("Not enough unused powers remain.");
  return {
    drawnPowerIds: remainingPowerIds.slice(0, count),
    remainingPowerIds: remainingPowerIds.slice(count),
  };
}

export function powerPrompt(powerId: PowerId) {
  const power = getPowerDefinition(powerId);
  return {
    powerId: power.id,
    name: power.name,
    exactRule: power.rule,
    duration: power.duration,
    instruction: "必须完整使用 exactRule 写明的范围、强度、对象与持续时间完成一个具体行动；决定胜负的核心动作必须就是普通人绝不可能做到的能力效果。不能换能力、缩小成普通技巧、改成比喻、只讨论能力，也不能把能力只当作掩护或插曲，再靠一项普通动作解决问题。",
  };
}
