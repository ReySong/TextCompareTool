import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
    },
  },
  plugins: [
    react(),
    electron({
      entry: "electron/main/index.js",
    }),
    renderer(),
  ],
  build: {
    rollupOptions: {
      input: "index.html",
    },
    emptyOutDir: false, // 默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录
  },
});
