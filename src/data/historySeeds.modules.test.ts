import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { HISTORY_SEEDS } from "./historySeeds";
import gutenbergBible from "./historySeeds/scripts/gutenberg-bible-1455";

const scriptsRoot = join(process.cwd(), "src/data/historySeeds/scripts");

describe("history seed modules", () => {
  it("keeps exactly one module directory for every active script", () => {
    const moduleIds = readdirSync(scriptsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    const activeIds = HISTORY_SEEDS.map(({ id }) => id).sort();

    expect(moduleIds).toEqual(activeIds);
  });

  it("allows an individual script to be imported and tested in isolation", () => {
    expect(gutenbergBible).toMatchObject({
      id: "gutenberg-bible-1455",
      eventName: "古腾堡圣经",
      perspective: "world",
    });
  });
});
