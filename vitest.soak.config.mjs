import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

const loadedEnvironment = loadEnv("test", process.cwd(), "");
for (const [key, value] of Object.entries(loadedEnvironment)) {
  process.env[key] ??= value;
}

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/soak/**/*.soak.ts"],
    testTimeout: 7_200_000,
    hookTimeout: 120_000,
    maxConcurrency: 1,
  },
});
