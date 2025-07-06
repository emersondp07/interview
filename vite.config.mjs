import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    coverage: {
      reporter: ["text", "lcov"],
      include: [
        "src/domain/**",
        "src/application/**",
        "src/interfaces/**",
        "src/application/**",
      ],
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
