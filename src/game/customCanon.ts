import { getTravelerAbility } from "./profile";
import type { TravelerProfile } from "./types";
import type { CustomActionResolution, TimelineTurn } from "./schema";

function causalMechanism(outcome: string, turn: TimelineTurn): string {
  if (/杀|死|皇帝|君主|政变|继承/.test(outcome)) return "结果经由宫门口令、死讯与继承命令进入社会";
  if (/法律|法令|制度|废除|改革/.test(outcome)) return "结果经由法令、公文与地方执行记录进入社会";
  if (/贸易|价格|货币|税|市场/.test(outcome)) return "结果经由契约、价格与商路账簿进入社会";
  if (/公开|宣布|演讲|出版|传播/.test(outcome)) return "结果经由公开声明、抄本与口述网络进入社会";
  return `结果经由${turn.role}现场的命令、消息与记录进入社会`;
}

const CONSEQUENCES: Record<CustomActionResolution["deviationClass"], Pick<CustomActionResolution["instantEcho"], "unexpectedCost" | "beneficiary" | "payer">> = {
  nudge: {
    unexpectedCost: "既有矛盾被推迟，代价转向下一批执行者",
    beneficiary: "最先适应新事实的人",
    payer: "被延后补偿的人",
  },
  reform: {
    unexpectedCost: "新规则重排利益，旧体系依赖者首先受损",
    beneficiary: "能进入新规则的人",
    payer: "依赖旧规则的人",
  },
  rupture: {
    unexpectedCost: "权力与资源真空扩大，普通人先承担失序成本",
    beneficiary: "最先掌握新事实的人",
    payer: "来不及转向的人",
  },
};

export function buildCanonicalCustomResolution(
  profile: TravelerProfile,
  turn: TimelineTurn,
  outcome: string,
  deviationClass: CustomActionResolution["deviationClass"],
): CustomActionResolution {
  const declaredOutcome = [...outcome.trim()].slice(0, 80).join("");
  const ability = getTravelerAbility(profile);
  const consequence = CONSEQUENCES[deviationClass];
  return {
    declaredOutcome,
    canonStatus: "玩家钦定",
    personalityLens: `${profile.typeCode}「${ability.title}」优先看见${ability.preview.replace("预判时优先看见", "")}`,
    causalMechanism: causalMechanism(declaredOutcome, turn),
    deviationClass,
    instantEcho: { directResult: declaredOutcome, ...consequence },
  };
}
