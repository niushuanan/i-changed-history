import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { unzipSync, zipSync } from "fflate";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(projectRoot, "diagnostics", "interactive-ai-mvp");
const releaseRoot = path.join(projectRoot, "release");
const zipPath = path.join(releaseRoot, "interactive-ai-mvp.zip");
const maxZipBytes = 8 * 1024 * 1024;
const deterministicMtime = new Date("1980-01-01T00:00:00.000Z");

async function collectFiles(directory, relativeDirectory = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === ".DS_Store") continue;
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(absolutePath, relativePath));
    } else if (entry.isFile()) {
      files.push({ absolutePath, relativePath });
    }
  }
  return files;
}

const files = await collectFiles(sourceRoot);
const packageEntries = {};

for (const { absolutePath, relativePath } of files) {
  const content = await readFile(absolutePath);
  const source = content.toString("utf8");
  if (
    [".html", ".css", ".js"].includes(path.extname(relativePath))
    && /https?:\/\/|fetch\s*\(|XMLHttpRequest|WebSocket/.test(source)
  ) {
    throw new Error(`Interactive AI MVP contains a forbidden network reference: ${relativePath}`);
  }
  packageEntries[relativePath] = [
    new Uint8Array(content),
    { mtime: deterministicMtime },
  ];
}

if (!packageEntries["index.html"]) {
  throw new Error("Interactive AI MVP must contain index.html at its root.");
}

await mkdir(releaseRoot, { recursive: true });
await rm(zipPath, { force: true });
const archive = zipSync(packageEntries, { level: 9 });
await writeFile(zipPath, archive);

const zipBytes = (await stat(zipPath)).size;
if (zipBytes > maxZipBytes) {
  throw new Error(`Interactive AI MVP ZIP is ${zipBytes} bytes; expected at most ${maxZipBytes}.`);
}

const unpackedEntries = Object.keys(unzipSync(new Uint8Array(await readFile(zipPath))));
if (!unpackedEntries.includes("index.html")) {
  throw new Error("Packaged Interactive AI MVP lost its root index.html.");
}

console.log(JSON.stringify({
  zipPath,
  files: files.length,
  zipBytes,
  maxZipBytes,
  md5: createHash("md5").update(await readFile(zipPath)).digest("hex"),
  model: "doubao-seed-2-0-lite-260428",
  stream: false,
}, null, 2));
