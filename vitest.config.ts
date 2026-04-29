import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["src/**/*.ts"],
      exclude: ["src/server.ts", "src/types/**/*.ts", "src/grpc/**/*.ts"],
      thresholds: {
        lines: 85,
        statements: 85,
        functions: 95,
        branches: 70,
      },
    },
  },
});
