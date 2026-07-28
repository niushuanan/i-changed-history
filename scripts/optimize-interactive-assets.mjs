import {
  access,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(projectRoot, "dist-interactive");
const maxUncompressedBytes = 7_500_000;
const textExtensions = new Set([".css", ".html", ".js"]);

if (
  path.dirname(outputRoot) !== projectRoot
  || path.basename(outputRoot) !== "dist-interactive"
) {
  throw new Error("Refusing to optimize an unexpected build directory.");
}

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

async function replaceWhenSmaller(originalPath, temporaryPath) {
  const [original, optimized] = await Promise.all([
    stat(originalPath),
    stat(temporaryPath),
  ]);
  if (optimized.size >= original.size) {
    await rm(temporaryPath, { force: true });
    return { before: original.size, after: original.size, changed: false };
  }
  await rename(temporaryPath, originalPath);
  return { before: original.size, after: optimized.size, changed: true };
}

async function optimizeWebp(file, profile) {
  const temporaryPath = `${file}.interactive-optimized`;
  await rm(temporaryPath, { force: true });
  await sharp(file)
    .resize({
      width: profile.width,
      height: profile.height,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: profile.quality,
      alphaQuality: profile.alphaQuality,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(temporaryPath);
  return replaceWhenSmaller(file, temporaryPath);
}

const initialFiles = await collectFiles(outputRoot);
const webpFiles = initialFiles.filter((file) => path.extname(file) === ".webp");
const optimizationResults = [];

for (const file of webpFiles) {
  const relativePath = path.relative(outputRoot, file);
  const isHistoryScene = relativePath.startsWith(`assets${path.sep}history${path.sep}`);
  optimizationResults.push(await optimizeWebp(file, isHistoryScene
    ? { width: 640, height: 900, quality: 42, alphaQuality: 70 }
    : { width: 720, height: 1_100, quality: 45, alphaQuality: 70 }));
}

const convertedTextures = [
  "assets/picker/dossier-ragged-v3.png",
  "assets/picker/action-slab-v3.png",
];
const replacements = new Map();

for (const relativePath of convertedTextures) {
  const sourcePath = path.join(outputRoot, relativePath);
  const outputRelativePath = relativePath.replace(/\.png$/, ".webp");
  const outputPath = path.join(outputRoot, outputRelativePath);
  const before = (await stat(sourcePath)).size;
  await rm(outputPath, { force: true });
  await sharp(sourcePath)
    .resize({
      width: 800,
      height: 1_100,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 55,
      alphaQuality: 75,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(outputPath);
  const after = (await stat(outputPath)).size;
  await rm(sourcePath);
  optimizationResults.push({ before, after, changed: true });
  replacements.set(path.basename(relativePath), path.basename(outputRelativePath));
}

const wordmarkPath = path.join(outputRoot, "assets/brand/history-wordmark.png");
const temporaryWordmarkPath = `${wordmarkPath}.interactive-optimized`;
await rm(temporaryWordmarkPath, { force: true });
await sharp(wordmarkPath)
  .resize({ width: 920, withoutEnlargement: true })
  .png({
    compressionLevel: 9,
    palette: true,
    quality: 85,
    colours: 256,
    dither: 0.7,
  })
  .toFile(temporaryWordmarkPath);
optimizationResults.push(await replaceWhenSmaller(wordmarkPath, temporaryWordmarkPath));

const filesAfterImages = await collectFiles(outputRoot);
for (const file of filesAfterImages) {
  if (!textExtensions.has(path.extname(file))) continue;
  const original = await readFile(file, "utf8");
  let updated = original;
  for (const [from, to] of replacements) {
    updated = updated.replaceAll(from, to);
  }
  if (updated !== original) await writeFile(file, updated);
}

const finalFiles = await collectFiles(outputRoot);
let totalBytes = 0;
for (const file of finalFiles) {
  totalBytes += (await stat(file)).size;
}

const beforeBytes = optimizationResults.reduce((sum, result) => sum + result.before, 0);
const afterBytes = optimizationResults.reduce((sum, result) => sum + result.after, 0);
const changedFiles = optimizationResults.filter((result) => result.changed).length;

if (totalBytes > maxUncompressedBytes) {
  throw new Error(
    `Interactive Space build is ${totalBytes} bytes; expected at most ${maxUncompressedBytes} bytes before ZIP packaging.`,
  );
}

console.log(JSON.stringify({
  changedFiles,
  optimizedAssetBytes: {
    before: beforeBytes,
    after: afterBytes,
  },
  totalBuildBytes: totalBytes,
  maxUncompressedBytes,
}, null, 2));
