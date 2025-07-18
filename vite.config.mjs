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
        "src/interfaces/@types",
        "src/domain/interviewer/repositories",
        "src/domain/company/repositories",
        "src/domain/client/repositories",
        "src/domain/administrator/repositories",
        "src/**/*.schema.ts",
        "src/**/*.type.ts",
      ],
    },
    projects: [
      {
        plugins: [tsConfigPaths()],
        test: {
          name: "unit",
          environment: "node",
          include: [
            "src/domain/**/*.spec.ts",
            "src/application/**/*.spec.ts",
            "src/application/**/*.spec.ts",
          ],
          globals: true,
          testTimeout: 10000,
        },
      },
      {
        plugins: [tsConfigPaths()],
        test: {
          name: "e2e",
          environment: "prisma",
          include: ["src/interfaces/**/*.spec.ts"],
          globals: true,
          testTimeout: 20000,
        },
      },
    ],
  },
});
