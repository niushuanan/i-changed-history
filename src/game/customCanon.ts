import type { CustomActionResolution, TimelineTurn } from "./schema";
import { CUSTOM_ACTION_MAX_LENGTH } from "./limits";

function causalMechanism(outcome: string, turn: TimelineTurn): string {
  const channels: string[] = [];
  if (/杀|死|皇帝|君主|政变|继承|登基/.test(outcome)) channels.push("宫门口令与继承命令");
  if (/科技|科学|科学院|工业|机器|工坊|教育/.test(outcome)) channels.push("科学院预算与工坊命令");
  if (/法律|法令|制度|废除|改革/.test(outcome)) channels.push("法令与地方执行记录");
  if (/贸易|价格|货币|税|市场/.test(outcome)) channels.push("契约、价格与商路账簿");
  if (/公开|宣布|演讲|出版|传播/.test(outcome)) channels.push("公开声明与抄本网络");
  if (channels.length === 0) channels.push(`${turn.role}现场的命令与记录`);
  return [...`结果经由${channels.join("、")}进入社会`].slice(0, 56).join("");
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
  turn: TimelineTurn,
  outcome: string,
  deviationClass: CustomActionResolution["deviationClass"],
  modelResolution?: CustomActionResolution,
): CustomActionResolution {
  const declaredOutcome = [...outcome.trim()].slice(0, CUSTOM_ACTION_MAX_LENGTH).join("");
  const modelDetail = modelResolution
    ? `${modelResolution.causalMechanism}${modelResolution.instantEcho.unexpectedCost}${modelResolution.instantEcho.beneficiary}${modelResolution.instantEcho.payer}`
    : "";
  const modelPreservesCanon = modelResolution?.declaredOutcome === declaredOutcome
    && modelResolution.instantEcho.directResult === declaredOutcome
    && !/并未发生|从未发生|没有成功|最终失败|其实未死|其实没有|仍然在世|毫发无伤|只是一场误会|只是计划|只是尝试|未能实现|并未成为/.test(modelDetail);
  const consequence = CONSEQUENCES[deviationClass];
  return {
    declaredOutcome,
    canonStatus: "玩家钦定",
    causalMechanism: modelPreservesCanon ? modelResolution.causalMechanism : causalMechanism(declaredOutcome, turn),
    deviationClass,
    instantEcho: modelPreservesCanon
      ? { ...modelResolution.instantEcho, directResult: declaredOutcome }
      : { directResult: declaredOutcome, ...consequence },
  };
}
