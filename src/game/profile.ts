import type {
  TravelerOccupation,
  TravelerProfile,
  TravelerRiskStyle,
  TravelerStrength,
} from "./types";

export const OCCUPATIONS: ReadonlyArray<{ value: TravelerOccupation; label: string }> = [
  { value: "student", label: "学生" },
  { value: "product", label: "产品与管理" },
  { value: "engineering", label: "工程与科技" },
  { value: "business", label: "金融与商业" },
  { value: "creative", label: "内容与创意" },
  { value: "public-service", label: "公共事务" },
];

export const STRENGTHS: ReadonlyArray<{ value: TravelerStrength; label: string }> = [
  { value: "negotiation", label: "谈判" },
  { value: "organization", label: "组织" },
  { value: "technology", label: "技术" },
  { value: "business", label: "商业" },
  { value: "writing", label: "写作" },
  { value: "strategy", label: "战略" },
  { value: "law", label: "法律" },
  { value: "medicine", label: "医疗" },
];

export const RISK_STYLES: ReadonlyArray<{ value: TravelerRiskStyle; label: string }> = [
  { value: "cautious", label: "谨慎" },
  { value: "balanced", label: "均衡" },
  { value: "bold", label: "激进" },
];

type ProfileInput = {
  name?: unknown;
  occupation?: unknown;
  strengths?: unknown;
  riskStyle?: unknown;
};

export type ProfileValidationResult =
  | { ok: true; value: TravelerProfile }
  | {
      ok: false;
      errors: Partial<Record<"name" | "occupation" | "strengths" | "riskStyle", string>>;
    };

const occupationValues = new Set(OCCUPATIONS.map((item) => item.value));
const strengthValues = new Set(STRENGTHS.map((item) => item.value));
const riskValues = new Set(RISK_STYLES.map((item) => item.value));

export function validateTravelerProfile(input: ProfileInput): ProfileValidationResult {
  const errors: Partial<Record<"name" | "occupation" | "strengths" | "riskStyle", string>> = {};
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const nameLength = [...name].length;
  if (nameLength < 2 || nameLength > 12) errors.name = "称呼需要 2–12 个字符";

  const occupation = occupationValues.has(input.occupation as TravelerOccupation)
    ? (input.occupation as TravelerOccupation)
    : null;
  if (!occupation) errors.occupation = "请选择现代身份";

  const strengths = Array.isArray(input.strengths)
    ? input.strengths.filter((value): value is TravelerStrength =>
        strengthValues.has(value as TravelerStrength),
      )
    : [];
  const uniqueStrengths = [...new Set(strengths)];
  if (uniqueStrengths.length !== 2) {
    errors.strengths = "请选择两项不同的现代优势";
  }

  const riskStyle = riskValues.has(input.riskStyle as TravelerRiskStyle)
    ? (input.riskStyle as TravelerRiskStyle)
    : null;
  if (!riskStyle) errors.riskStyle = "请选择决策本能";

  if (Object.keys(errors).length > 0 || !occupation || !riskStyle || uniqueStrengths.length !== 2) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      name,
      occupation,
      strengths: [uniqueStrengths[0], uniqueStrengths[1]],
      riskStyle,
    },
  };
}
