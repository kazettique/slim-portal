import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  reporter: "list",
  retries: process.env.CI ? 2 : 0,
  testDir: "e2e",
  use: {
    baseURL: "http://localhost:4321",
  },
  webServer: {
    command: "bun run dev:web",
    reuseExistingServer: !process.env.CI,
    url: "http://localhost:4321",
  },
});
