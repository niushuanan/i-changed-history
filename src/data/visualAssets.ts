import type { VisualTone } from "../game/types";
import type { TimelineTurn } from "../game/schema";

export const VISUAL_ASSETS: Record<VisualTone, string> = {
  ancient: "/assets/tone-ancient.webp",
  exchange: "/assets/tone-exchange.webp",
  print: "/assets/tone-print.webp",
  revolution: "/assets/tone-revolution.webp",
  industry: "/assets/tone-industry.webp",
  war: "/assets/tone-war.webp",
  space: "/assets/tone-space.webp",
  digital: "/assets/tone-digital.webp",
};

const CHAPTER_VISUALS: Partial<Record<TimelineTurn["chapter"], string>> = {
  2: "/assets/stage-aftermath.webp",
  3: "/assets/tone-exchange.webp",
  4: "/assets/tone-print.webp",
  5: "/assets/stage-institutions.webp",
  6: "/assets/tone-revolution.webp",
  7: "/assets/tone-industry.webp",
  8: "/assets/tone-space.webp",
  9: "/assets/tone-ancient.webp",
  10: "/assets/tone-war.webp",
  11: "/assets/tone-digital.webp",
};

export function visualAssetForTurn(turn: Pick<TimelineTurn, "chapter" | "visualTone">): string {
  return CHAPTER_VISUALS[turn.chapter] ?? VISUAL_ASSETS[turn.visualTone];
}
