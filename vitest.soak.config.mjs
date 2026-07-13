import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/soak/**/*.soak.ts"],
    testTimeout: 7_200_000,
    hookTimeout: 120_000,
    maxConcurrency: 1,
  },
});

