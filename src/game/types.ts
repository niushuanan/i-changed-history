export type HistoryEra = "ancient" | "medieval" | "early-modern" | "industrial" | "modern";

export type VisualTone =
  | "ancient"
  | "exchange"
  | "print"
  | "revolution"
  | "industry"
  | "war"
  | "space"
  | "digital";

export type TravelerOccupation =
  | "student"
  | "product"
  | "engineering"
  | "business"
  | "creative"
  | "public-service";

export type TravelerStrength =
  | "negotiation"
  | "organization"
  | "technology"
  | "business"
  | "writing"
  | "strategy"
  | "law"
  | "medicine";

export type TravelerRiskStyle = "cautious" | "balanced" | "bold";

export type HistorySeed = {
  id: string;
  era: HistoryEra;
  year: number;
  dateLabel: string;
  eventName: string;
  location: string;
  chinaRelated: boolean;
  perspective: "china" | "world";
  role: string;
  decision: string;
  urgency: string;
  historicalOutcome: string;
  baselineFacts: readonly [string, string, string];
  prompt: string;
  domain: string;
  visualTone: VisualTone;
  occupationTags: readonly TravelerOccupation[];
  strengthTags: readonly TravelerStrength[];
  riskTags: readonly TravelerRiskStyle[];
};
