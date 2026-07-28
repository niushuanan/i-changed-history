import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { unzipSync, zipSync } from "fflate";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(projectRoot, "dist-interactive");
const releaseRoot = path.join(projectRoot, "release");
const zipPath = path.join(releaseRoot, "i-changed-history-interactive-space.zip");
const maxZipBytes = 8 * 1024 * 1024;

function runNode(label, relativeScript, args = []) {
  console.log(`\n[interactive review] ${label}`);
  const result = spawnSync(
    process.execPath,
    [path.join(projectRoot, relativeScript), ...args],
    { cwd: projectRoot, stdio: "inherit" },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status ?? "unknown"}.`);
  }
}

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

runNode(
  "build the three-script runtime",
  "node_modules/vite/bin/vite.js",
  ["build", "--config", "vite.interactive.config.ts"],
);
runNode("remove non-review assets", "scripts/prepare-interactive-build.mjs");
runNode("optimize mobile assets", "scripts/optimize-interactive-assets.mjs");
runNode("verify the three-script boundary", "scripts/verify-interactive-review-build.mjs");

await mkdir(releaseRoot, { recursive: true });
await rm(zipPath, { force: true });

const packageFiles = await collectFiles(outputRoot);
const zipEntries = {};
for (const { absolutePath, relativePath } of packageFiles) {
  zipEntries[relativePath] = new Uint8Array(await readFile(absolutePath));
}

const archive = zipSync(zipEntries, { level: 9 });
await writeFile(zipPath, archive);

const zipBytes = (await stat(zipPath)).size;
if (zipBytes > maxZipBytes) {
  throw new Error(`Interactive review ZIP is ${zipBytes} bytes; expected at most ${maxZipBytes} bytes.`);
}

const unpackedEntries = Object.keys(unzipSync(new Uint8Array(await readFile(zipPath))));
if (!unpackedEntries.includes("index.html")) {
  throw new Error("Interactive review ZIP must contain index.html at its root.");
}

console.log(JSON.stringify({
  zipPath,
  files: packageFiles.length,
  zipBytes,
  maxZipBytes,
  md5: createHash("md5").update(await readFile(zipPath)).digest("hex"),
}, null, 2));
