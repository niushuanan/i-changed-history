import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(projectRoot, "dist-interactive");
const historyModulesRoot = path.join(projectRoot, "src/data/historySeeds/scripts");
const historyAssetsRoot = path.join(outputRoot, "assets/history");
const releaseConfigPath = path.join(projectRoot, "interactive-space.release.json");
const textExtensions = new Set([".css", ".html", ".js", ".json", ".svg"]);
const releaseConfig = JSON.parse(await readFile(releaseConfigPath, "utf8"));

await access(path.join(outputRoot, "index.html"));

if (
  releaseConfig.aiEnabled !== true
  || releaseConfig.chatModel !== "deepseek-v4-flash"
  || releaseConfig.credentialMode !== "platform-volcengine-api-key"
  || releaseConfig.screenDirection !== 1
  || releaseConfig.packageType !== 1
  || releaseConfig.maxZipBytes !== 8 * 1024 * 1024
) {
  throw new Error("Interactive release configuration must keep AI enabled, V4 Flash, platform credentials, portrait mode, package type 1, and the 8MB limit.");
}

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
if (moduleIds.length !== 100 || new Set(moduleIds).size !== 100) {
  throw new Error(`Interactive release must contain the complete 100-script catalogue; source has ${moduleIds.length}.`);
}

const packagedHistoryIds = (await readdir(historyAssetsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && path.extname(entry.name) === ".webp")
  .map((entry) => path.basename(entry.name, ".webp"))
  .sort();
const expectedIds = [...moduleIds];

if (JSON.stringify(packagedHistoryIds) !== JSON.stringify(expectedIds)) {
  throw new Error(
    `Interactive package history images must be exactly ${expectedIds.join(", ")}; found ${packagedHistoryIds.join(", ")}.`,
  );
}

const outputFiles = await collectFiles(outputRoot);
const relativeOutputFiles = outputFiles.map((file) => path.relative(outputRoot, file).split(path.sep).join("/"));
const indexFiles = relativeOutputFiles.filter((file) => path.basename(file) === "index.html");
if (indexFiles.length !== 1 || indexFiles[0] !== "index.html") {
  throw new Error(`Interactive package must contain exactly one root index.html; found ${indexFiles.join(", ") || "none"}.`);
}
const nonAsciiPaths = relativeOutputFiles.filter((file) => !/^[\x20-\x7e]+$/.test(file));
if (nonAsciiPaths.length > 0) {
  throw new Error(`Interactive package filenames must be ASCII: ${nonAsciiPaths.join(", ")}.`);
}
const forbiddenMetadata = relativeOutputFiles.filter((file) => (
  file.includes("__MACOSX") || path.basename(file) === ".DS_Store"
));
if (forbiddenMetadata.length > 0) {
  throw new Error(`Interactive package contains platform metadata: ${forbiddenMetadata.join(", ")}.`);
}
const textContents = [];
for (const file of outputFiles) {
  if (!textExtensions.has(path.extname(file))) continue;
  textContents.push(await readFile(file, "utf8"));
}
const bundledText = textContents.join("\n");
const indexHtml = await readFile(path.join(outputRoot, "index.html"), "utf8");

for (const match of indexHtml.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
  const reference = match[1];
  if (
    reference.startsWith("/")
    || reference.startsWith("//")
    || /^[a-z][a-z0-9+.-]*:/i.test(reference)
  ) {
    throw new Error(`Interactive package index.html must use only local relative assets; found ${reference}.`);
  }
}

const requiredRuntimeMarkers = [
  "callAIChatCompletion",
  "deepseek-v4-flash",
  "AI 生成 · V4 Flash",
  "AI 辅助创作 · 固定开场",
  "本作品包含人工智能生成内容",
  "体验说明",
  "个历史现场，随机抽一个开局",
];
const missingRuntimeMarkers = requiredRuntimeMarkers.filter((marker) => !bundledText.includes(marker));
if (missingRuntimeMarkers.length > 0) {
  throw new Error(`Interactive runtime is missing compliance markers: ${missingRuntimeMarkers.join(", ")}.`);
}
if (bundledText.includes("游戏说明")) {
  throw new Error("Interactive runtime must use 体验说明 instead of 游戏说明.");
}
if (/\bsk-[A-Za-z0-9_-]{16,}\b/.test(bundledText)) {
  throw new Error("Interactive runtime must never embed an API key.");
}
const forbiddenRuntimePatterns = [
  { name: "direct fetch", pattern: /\bfetch\s*\(/ },
  { name: "XMLHttpRequest", pattern: /\bXMLHttpRequest\b/ },
  {
    name: "external navigation",
    pattern: /(?:href|src|action)\s*[:=]\s*["'`]\s*https?:\/\/|\b(?:open|assign|replace)\s*\(\s*["'`]\s*https?:\/\//i,
  },
  { name: "iframe", pattern: /<iframe\b/i },
  { name: "native dialog", pattern: /\b(?:alert|confirm|prompt)\s*\(/ },
];
const runtimeViolations = forbiddenRuntimePatterns
  .filter(({ pattern }) => pattern.test(bundledText))
  .map(({ name }) => name);
if (runtimeViolations.length > 0) {
  throw new Error(`Interactive runtime contains forbidden capability markers: ${runtimeViolations.join(", ")}.`);
}

const missingScriptIds = moduleIds.filter((id) => !bundledText.includes(id));
if (missingScriptIds.length > 0) {
  throw new Error(`Interactive package is missing product scripts: ${missingScriptIds.join(", ")}.`);
}

console.log(JSON.stringify({
  sourceCatalogueSize: moduleIds.length,
  packagedScriptCount: moduleIds.length,
  packagedHistoryImageCount: packagedHistoryIds.length,
  missingScriptIds: 0,
  aiEnabled: releaseConfig.aiEnabled,
  chatModel: releaseConfig.chatModel,
  credentialMode: releaseConfig.credentialMode,
  maxZipBytes: releaseConfig.maxZipBytes,
  complianceMarkers: requiredRuntimeMarkers,
  forbiddenRuntimeMarkers: 0,
}, null, 2));
