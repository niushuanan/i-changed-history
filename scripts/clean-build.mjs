import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const buildDirectory = path.join(projectRoot, "dist");

if (path.dirname(buildDirectory) !== projectRoot || path.basename(buildDirectory) !== "dist") {
  throw new Error("Refusing to clean an unexpected build directory.");
}

await rm(buildDirectory, { recursive: true, force: true });
