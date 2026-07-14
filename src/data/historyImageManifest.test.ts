import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { shouldRefreshHistoryImage, validateHistoryImageManifest } from "../../scripts/history-image-policy.mjs";
import { HISTORY_SEEDS } from "./historySeeds";

type ManifestEntry = {
  id: string;
  articleUrl: string;
  filePage: string;
  artist: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  fallback: null | {
    sourceAsset: string;
    sourceCredits: string;
    reason: string;
  };
};

const assetRoot = join(process.cwd(), "public/assets/history");
const manifest = JSON.parse(readFileSync(join(assetRoot, "manifest.json"), "utf8")) as ManifestEntry[];

describe("historical image manifest", () => {
  it("refreshes a cached fallback while preserving attributed event images", () => {
    const attributed = {
      articleUrl: "https://example.com/article",
      filePage: "https://example.com/file",
      artist: "Artist",
      license: "CC BY 4.0",
      licenseUrl: "https://example.com/license",
      sourceUrl: "https://example.com/image.webp",
      fallback: null,
    };
    expect(shouldRefreshHistoryImage(false, null)).toBe(true);
    expect(shouldRefreshHistoryImage(true, { ...attributed, fallback: { sourceAsset: "/assets/tone-ancient.webp" } })).toBe(true);
    expect(shouldRefreshHistoryImage(true, { ...attributed, artist: "" })).toBe(true);
    expect(shouldRefreshHistoryImage(true, attributed)).toBe(false);
  });

  it("contains complete attribution or an explicit credited local fallback", () => {
    expect(() => validateHistoryImageManifest(manifest, HISTORY_SEEDS.map(({ id }) => id))).not.toThrow();
    expect(manifest).toHaveLength(100);

    for (const entry of manifest) {
      if (entry.fallback) {
        expect(entry.fallback.sourceAsset).toMatch(/^\/assets\//);
        expect(entry.fallback.sourceCredits).toBe("/assets/CREDITS.md");
        expect(entry.fallback.reason.trim()).not.toBe("");
      } else {
        expect([entry.articleUrl, entry.filePage, entry.artist, entry.license, entry.licenseUrl, entry.sourceUrl].every(Boolean)).toBe(true);
      }
    }
  });

  it("does not ship a bank of duplicate period fallbacks", () => {
    const fallbackHashes = manifest.filter(({ fallback }) => fallback).map(({ id }) => (
      createHash("sha256").update(readFileSync(join(assetRoot, `${id}.webp`))).digest("hex")
    ));
    expect(manifest.filter(({ fallback }) => fallback).length).toBeLessThanOrEqual(4);
    expect(new Set(fallbackHashes).size).toBe(fallbackHashes.length);
  });
});
