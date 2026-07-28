import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(root, "release");
const outputPath = path.join(outputDirectory, "interactive-space-icon.png");
const backgroundPath = path.join(root, "public/assets/picker/archive-stage-v2.webp");
const wordmarkPath = path.join(root, "public/assets/brand/history-wordmark.png");

const frame = Buffer.from(`
  <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="shade" cx="50%" cy="46%" r="72%">
        <stop offset="0%" stop-color="#111717" stop-opacity="0.04"/>
        <stop offset="70%" stop-color="#050707" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="#020303" stop-opacity="0.62"/>
      </radialGradient>
    </defs>
    <rect width="300" height="300" fill="url(#shade)"/>
    <rect x="8" y="8" width="284" height="284" fill="none" stroke="#bc2d20" stroke-width="3"/>
    <rect x="14" y="14" width="272" height="272" fill="none" stroke="#e9dcc2" stroke-opacity="0.35"/>
    <path d="M18 247 H282" stroke="#bc2d20" stroke-width="8"/>
  </svg>
`);

await mkdir(outputDirectory, { recursive: true });

const wordmark = await sharp(wordmarkPath)
  .resize({ width: 270, fit: "inside", withoutEnlargement: true })
  .png()
  .toBuffer();

await sharp(backgroundPath)
  .resize(300, 300, { fit: "cover", position: "centre" })
  .composite([
    { input: frame },
    { input: wordmark, gravity: "centre" },
  ])
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

console.log(`Interactive Space icon created: ${outputPath}`);
