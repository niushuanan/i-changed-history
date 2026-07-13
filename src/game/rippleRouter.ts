import type { PlayedTurn } from "./prompts";
import type { GameScenario } from "./reducer";
import type { DecisionChapter } from "./timelinePlan";

export const RIPPLE_LENSES = [
  "power", "livelihood", "knowledge", "technology", "culture",
  "trade", "migration", "ecology", "diplomacy",
] as const;

export type RippleLens = "origin" | (typeof RIPPLE_LENSES)[number];

type RoutedLens = (typeof RIPPLE_LENSES)[number];

const LENS_COPY: Record<RoutedLens, { label: string; instruction: string; evidence: readonly string[]; role: string; location: string; topic: string }> = {
  power: { label: "权力与继承", instruction: "把影响转入军令、继承、官僚或地方权力，不复述上一场冲突", evidence: ["军令", "继承", "官僚", "权力", "官署", "议会"], role: "地方议事厅书记", location: "新设地方议事厅", topic: "继承与地方权力重排" },
  livelihood: { label: "普通人的生活", instruction: "把影响转入家庭、劳动、粮食、住房或日常安全", evidence: ["家庭", "粮食", "住房", "劳动", "工钱", "市民"], role: "城市粮食配给员", location: "居民粮食配给站", topic: "家庭生计开始承压" },
  knowledge: { label: "记录与知识", instruction: "把影响转入史书、教育、新闻、测量或知识传播", evidence: ["史书", "学校", "学堂", "报纸", "档案", "教育"], role: "公共档案校订员", location: "城市档案与学堂", topic: "新历史进入教育记录" },
  technology: { label: "技术与生产", instruction: "把影响转入工具、工艺、基础设施或生产组织", evidence: ["工具", "工坊", "机器", "工艺", "桥梁", "生产"], role: "工坊生产统筹员", location: "新兴城市联合工坊", topic: "生产工具改变劳动秩序" },
  culture: { label: "文化与记忆", instruction: "把影响转入信仰、礼俗、语言、艺术或集体记忆", evidence: ["信仰", "礼俗", "语言", "戏院", "艺术", "记忆"], role: "地方礼俗记录者", location: "城市祭礼与戏院", topic: "集体记忆出现分歧" },
  trade: { label: "贸易与价格", instruction: "把影响转入税收、价格、商业网络或资源流动", evidence: ["税", "价格", "商人", "市场", "账簿", "贸易"], role: "商港税册核算员", location: "区域贸易集市", topic: "价格与税册率先异动" },
  migration: { label: "人口与城市", instruction: "把影响转入迁徙、城市扩张、族群关系或新社区", evidence: ["迁徙", "城市", "居民", "难民", "移民", "人口"], role: "新居民安置官", location: "扩张中的城市登记处", topic: "迁徙人群正在落脚" },
  ecology: { label: "土地与健康", instruction: "把影响转入水利、土地、疾病、人口或环境风险", evidence: ["水利", "土地", "疾病", "河流", "疫病", "环境"], role: "河道与疫病调查员", location: "受灾河谷卫生站", topic: "土地与疾病风险相撞" },
  diplomacy: { label: "边境与联盟", instruction: "把影响转入边境、联盟或外部秩序；不强制跨国跨洲", evidence: ["边境", "使节", "联盟", "条约", "外交", "邻国"], role: "边境盟约译报员", location: "边境使节驿馆", topic: "联盟与条约重新议价" },
};

function stableHash(value: string): number {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function selectRippleDirective(
  scenario: GameScenario,
  playedTurns: readonly PlayedTurn[],
  chapter: Exclude<DecisionChapter, 1>,
): { lens: RoutedLens; label: string; instruction: string; requiredEvidence: readonly string[] } {
  const recent = new Set(playedTurns.slice(-2).map((item) => item.turn.rippleLens));
  const candidates = RIPPLE_LENSES.filter((lens) => !recent.has(lens));
  const historyKey = playedTurns.map((item) => `${item.selectedChoiceId}:${item.selectedChoiceLabel}`).join("|");
  const lens = candidates[stableHash(`${scenario.seed.id}:${chapter}:${historyKey}`) % candidates.length];
  const copy = LENS_COPY[lens];
  return {
    lens,
    label: copy.label,
    instruction: `本幕指定社会载体为「${copy.label}」。${copy.instruction}。`,
    requiredEvidence: copy.evidence,
  };
}

export function rippleLensLabel(lens: RippleLens): string {
  return lens === "origin" ? "历史原点" : LENS_COPY[lens].label;
}

type RippleSceneText = Pick<PlayedTurn["turn"], "role" | "location" | "headline" | "narrative" | "causalBridge" | "immediateObjective">;

export function rippleSceneMatches(lens: RippleLens, scene: RippleSceneText): boolean {
  if (lens === "origin") return true;
  const text = [scene.role, scene.location, scene.headline, scene.narrative, scene.causalBridge, scene.immediateObjective].join("；");
  return LENS_COPY[lens].evidence.filter((keyword) => text.includes(keyword)).length >= 2;
}

export function rippleFallbackScene(lens: Exclude<RippleLens, "origin">) {
  const copy = LENS_COPY[lens];
  return { role: copy.role, location: copy.location, topic: copy.topic, evidence: copy.evidence };
}
