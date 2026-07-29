import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "../services/deepseek",
        replacement: path.join(projectRoot, "src/services/deepseek.interactive.ts"),
      },
      {
        find: "html-to-image",
        replacement: path.join(projectRoot, "src/services/htmlToImage.interactive.ts"),
      },
    ],
  },
  define: {
    "import.meta.env.VITE_INTERACTIVE_SPACE": JSON.stringify("true"),
  },
  build: {
    outDir: "dist-interactive",
    emptyOutDir: true,
    target: ["es2020", "safari13.1"],
    sourcemap: false,
    modulePreload: { polyfill: false },
  },
});
