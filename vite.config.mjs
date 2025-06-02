import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    coverage: {
      reporter: ["text", "lcov"],
      exclude: [
        "**/*.type.ts",
        "**/*.schema.ts",
        "**/*-repository.ts",
        "**/*.d.ts",
        "node_modules/**",
        "dist/**",
        "coverage/**",
        "**/*.mjs",
        "src/infra/config/**",
        "src/infra/http/**",
        "src/infra/database/**",
        "prisma/**",
      ],
    },
    environmentMatchGlobs: [["src/interfaces/http/controllers/**", "prisma"]],
  },
});
