import type {
  HistoryEra,
  HistorySeed,
  TravelerOccupation,
  TravelerRiskStyle,
  TravelerStrength,
  VisualTone,
} from "../../game/types";

export const eraFor = (year: number): HistoryEra => {
  if (year <= 600) return "ancient";
  if (year <= 1450) return "medieval";
  if (year <= 1800) return "early-modern";
  if (year <= 1914) return "industrial";
  return "modern";
};

export const moment = (
  id: string,
  year: number,
  dateLabel: string,
  eventName: string,
  location: string,
  perspective: "china" | "world",
  role: string,
  decision: string,
  urgency: string,
  historicalOutcome: string,
  baselineFacts: HistorySeed["baselineFacts"],
  domain: string,
  visualTone: VisualTone,
  occupationTags: readonly TravelerOccupation[],
  strengthTags: readonly TravelerStrength[],
  riskTags: readonly TravelerRiskStyle[],
): HistorySeed => ({
  id,
  era: eraFor(year),
  year,
  dateLabel,
  eventName,
  location,
  chinaRelated: perspective === "china",
  perspective,
  role,
  decision,
  urgency,
  historicalOutcome,
  baselineFacts,
  prompt: decision,
  domain,
  visualTone,
  occupationTags,
  strengthTags,
  riskTags,
});

export const P = ["product", "public-service"] as const;
export const E = ["engineering", "student"] as const;
export const B = ["business", "product"] as const;
export const C = ["creative", "student"] as const;
export const S = ["strategy", "organization"] as const;
export const N = ["negotiation", "law"] as const;
export const T = ["technology", "strategy"] as const;
export const W = ["creative", "student"] as const;
export const M = ["engineering", "public-service"] as const;
export const CAUTIOUS = ["cautious", "balanced"] as const;
export const BALANCED = ["balanced"] as const;
export const BOLD = ["bold", "balanced"] as const;
