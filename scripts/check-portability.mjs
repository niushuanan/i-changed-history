import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROOT_FILES = [
  ".env.example",
  ".npmrc",
  "index.html",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "vite.config.mjs",
];
const SOURCE_DIRECTORIES = [".github", "src", "scripts"];
const TEXT_EXTENSIONS = new Set([".css", ".html", ".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".yml", ".yaml"]);

const machinePathPatterns = [
  {
    label: "Unix user home",
    regex: new RegExp(String.raw`(?:^|[\s"'=:(])\/(?:Users|home)\/[^/\s"']+\/`, "g"),
  },
  {
    label: "Windows user home",
    regex: new RegExp(String.raw`(?:^|[\s"'=:(])[A-Za-z]:[\\/](?:Users|home)[\\/][^\\/\s"']+[\\/]`, "g"),
  },
];

async function collectFiles(relativeDirectory) {
  const absoluteDirectory = path.join(ROOT, relativeDirectory);
  let entries;
  try {
    entries = await readdir(absoluteDirectory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }

  const files = [];
  for (const entry of entries) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(relativePath));
    } else if (entry.isFile() && TEXT_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(relativePath);
    }
  }
  return files;
}

const files = [
  ...ROOT_FILES,
  ...(await Promise.all(SOURCE_DIRECTORIES.map(collectFiles))).flat(),
].filter((file, index, all) => all.indexOf(file) === index);

const violations = [];
for (const relativePath of files) {
  let content;
  try {
    content = await readFile(path.join(ROOT, relativePath), "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") continue;
    throw error;
  }

  const lines = content.split(/\r?\n/);
  for (const [lineIndex, line] of lines.entries()) {
    for (const { label, regex } of machinePathPatterns) {
      regex.lastIndex = 0;
      if (regex.test(line)) {
        violations.push(`${relativePath}:${lineIndex + 1} ${label}: ${line.trim()}`);
      }
    }
  }
}

if (violations.length > 0) {
  console.error("Machine-specific absolute paths found in runtime files:\n");
  console.error(violations.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Portability check passed (${files.length} runtime files scanned).`);
}
