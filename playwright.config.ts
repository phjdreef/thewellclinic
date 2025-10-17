import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./src/tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  timeout: process.env.CI ? 60000 : 30000, // 60s timeout for CI, 30s for local
  expect: {
    timeout: process.env.CI ? 10000 : 5000, // 10s expect timeout for CI, 5s for local
  },
  use: {
    trace: "on-first-retry",
    actionTimeout: process.env.CI ? 15000 : 10000, // 15s action timeout for CI, 10s for local
    navigationTimeout: process.env.CI ? 30000 : 10000, // 30s navigation timeout for CI, 10s for local
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
