import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/server.ts", "src/types/**/*.ts"],
      thresholds: {
        lines: 85,
        statements: 85,
        functions: 85,
        branches: 80
      }
    }
  }
});
