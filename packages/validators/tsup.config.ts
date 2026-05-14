import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/global.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  target: "es2022",
});
