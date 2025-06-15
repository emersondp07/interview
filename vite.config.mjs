import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    coverage: {
      reporter: ["text", "lcov"],
      include: ["src/core/**", "src/domain/**", "src/interfaces/**"],
      exclude: [
        "**/*.d.ts",
        "node_modules/**",
        "dist/**",
        "**/*.mjs",
        "prisma/**",
      ],
    },
    environmentMatchGlobs: [["src/interfaces/http/**", "prisma"]],
  },
});
