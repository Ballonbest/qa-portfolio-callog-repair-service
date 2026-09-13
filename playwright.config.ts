import { defineConfig, devices } from "@playwright/test";
import type { OrtoniReportConfig } from "ortoni-report";
import dotenv from "dotenv";

dotenv.config();

const reportConfig: OrtoniReportConfig = {
  open: "always",
  folderPath: "report",
  filename: "index.html",
  title: "Callog Test Report",
  projectName: "Callog",
  testType: "Functional",
};

export default defineConfig({
  testDir: "./tests",

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Use one worker on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter */
  reporter: [["ortoni-report", reportConfig]],

  /* Shared settings */
  use: {
    trace: "on-first-retry",
  },

  /* Browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
