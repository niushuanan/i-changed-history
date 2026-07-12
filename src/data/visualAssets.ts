import type { VisualTone } from "../game/types";
import type { TimelineTurn } from "../game/schema";
import type { HistorySeed } from "../game/types";

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

export function historyAssetForSeed(seed: Pick<HistorySeed, "id">): string {
  return `/assets/history/${seed.id}.webp`;
}

const INDUSTRIAL_SCENES = [
  "/assets/tone-revolution.webp",
  "/assets/tone-industry.webp",
  "/assets/stage-institutions.webp",
  "/assets/tone-exchange.webp",
] as const;

const MID_CENTURY_SCENES = [
  "/assets/tone-war.webp",
  "/assets/tone-industry.webp",
  "/assets/tone-digital.webp",
  "/assets/tone-space.webp",
] as const;

function numericYear(yearLabel: string): number | null {
  const match = yearLabel.match(/(?:公元\s*)?(\d{1,4})/);
  if (!match) return null;
  const year = Number(match[1]);
  return yearLabel.includes("前") ? -year : year;
}

function sceneFrom<T extends readonly string[]>(scenes: T, chapter: TimelineTurn["chapter"]): T[number] {
  return scenes[(chapter - 1) % scenes.length];
}

export function visualAssetForTurn(
  turn: Pick<TimelineTurn, "chapter" | "visualTone" | "yearLabel">,
): string {
  if (turn.chapter === 2) return "/assets/stage-aftermath.webp";

  const year = numericYear(turn.yearLabel);
  if (year === null) return VISUAL_ASSETS[turn.visualTone];
  if (year >= 1990) return turn.chapter >= 11
    ? "/assets/stage-2026.webp"
    : sceneFrom(["/assets/tone-digital.webp", "/assets/stage-2026.webp"], turn.chapter);
  if (year >= 1950) return sceneFrom(MID_CENTURY_SCENES, turn.chapter);
  if (year >= 1914) return ["war", "revolution", "industry"].includes(turn.visualTone)
    ? VISUAL_ASSETS[turn.visualTone]
    : sceneFrom(["/assets/stage-institutions.webp", "/assets/tone-war.webp"], turn.chapter);
  if (year >= 1750) return ["revolution", "industry", "exchange", "print"].includes(turn.visualTone)
    ? VISUAL_ASSETS[turn.visualTone]
    : sceneFrom(INDUSTRIAL_SCENES, turn.chapter);
  if (year >= 1450) {
    if (turn.visualTone === "exchange" || turn.visualTone === "print") {
      return VISUAL_ASSETS[turn.visualTone];
    }
    if (turn.visualTone === "war") return "/assets/stage-aftermath.webp";
    return turn.chapter % 2 === 0
      ? "/assets/stage-early-modern.webp"
      : "/assets/stage-aftermath.webp";
  }
  return turn.visualTone === "ancient"
    ? VISUAL_ASSETS.ancient
    : "/assets/tone-ancient.webp";
}
