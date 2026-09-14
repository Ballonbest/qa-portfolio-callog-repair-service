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

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.CI
    ? [["html", { outputFolder: "playwright-report", open: "never" }]]
    : [["ortoni-report", reportConfig]],

  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
},

projects: [
  {
    name: "chrome",
    use: {
      ...devices["Desktop Chrome"],
      channel: "chrome",
    },
  },
],
});