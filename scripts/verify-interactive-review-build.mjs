import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { INTERACTIVE_REVIEW_HISTORY_IDS } from "./interactive-review-catalog.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(projectRoot, "dist-interactive");
const historyModulesRoot = path.join(projectRoot, "src/data/historySeeds/scripts");
const historyAssetsRoot = path.join(outputRoot, "assets/history");
const textExtensions = new Set([".css", ".html", ".js", ".json", ".svg"]);
const allowedIds = new Set(INTERACTIVE_REVIEW_HISTORY_IDS);

await access(path.join(outputRoot, "index.html"));

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(absolutePath));
    } else if (entry.isFile()) {
      files.push(absolutePath);
    }
  }
  return files;
}

const moduleIds = (await readdir(historyModulesRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const forbiddenIds = moduleIds.filter((id) => !allowedIds.has(id));

const packagedHistoryIds = (await readdir(historyAssetsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && path.extname(entry.name) === ".webp")
  .map((entry) => path.basename(entry.name, ".webp"))
  .sort();
const expectedIds = [...INTERACTIVE_REVIEW_HISTORY_IDS].sort();

if (JSON.stringify(packagedHistoryIds) !== JSON.stringify(expectedIds)) {
  throw new Error(
    `Interactive package history images must be exactly ${expectedIds.join(", ")}; found ${packagedHistoryIds.join(", ")}.`,
  );
}

const outputFiles = await collectFiles(outputRoot);
const textContents = [];
for (const file of outputFiles) {
  if (!textExtensions.has(path.extname(file))) continue;
  textContents.push(await readFile(file, "utf8"));
}
const bundledText = textContents.join("\n");

const missingAllowedIds = INTERACTIVE_REVIEW_HISTORY_IDS.filter((id) => !bundledText.includes(id));
if (missingAllowedIds.length > 0) {
  throw new Error(`Interactive package is missing approved scripts: ${missingAllowedIds.join(", ")}.`);
}

const leakedForbiddenIds = forbiddenIds.filter((id) => bundledText.includes(id));
if (leakedForbiddenIds.length > 0) {
  throw new Error(`Interactive package leaked non-review scripts: ${leakedForbiddenIds.join(", ")}.`);
}

console.log(JSON.stringify({
  sourceCatalogueSize: moduleIds.length,
  packagedScriptIds: INTERACTIVE_REVIEW_HISTORY_IDS,
  packagedHistoryImages: packagedHistoryIds,
  forbiddenScriptLeaks: 0,
}, null, 2));
