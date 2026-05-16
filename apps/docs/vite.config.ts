import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 3000, open: true },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        experience: resolve(__dirname, "experience.html"),
      },
    },
  },
});
