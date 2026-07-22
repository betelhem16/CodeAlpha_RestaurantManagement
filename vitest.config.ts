import { defineConfig } from "vitest/config";
import path from "node:path";

const testDbPath = path.resolve(__dirname, "prisma", "test.db").replace(/\\/g, "/");

export default defineConfig({
  test: {
    env: {
      DATABASE_URL: `file:${testDbPath}`,
    },
    setupFiles: ["./src/test-setup.ts"],
    fileParallelism: false,
  },
});