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

export type HistorySeed = {
  id: string;
  era: HistoryEra;
  year: number;
  location: string;
  chinaRelated: boolean;
  baselineFacts: readonly [string, string, string];
  prompt: string;
  domain: string;
  visualTone: VisualTone;
};

export type CustomSeedResult =
  | { ok: true; value: string }
  | {
      ok: false;
      reason: "empty" | "too_short" | "too_long" | "not_chinese" | "modern_china";
      value: string;
    };
