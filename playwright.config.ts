import { defineConfig, devices } from '@playwright/test';

const runTimestamp = new Date().toISOString();
const reportDirectory = process.env.PW_REPORT_DIR ?? 'playwright-report';
const runLabel = process.env.PW_RUN_LABEL ?? 'local';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  metadata: {
    'Run by': '23127027',
    'ISO timestamp': runTimestamp,
    PW_RUN_LABEL: runLabel,
  },
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: reportDirectory,
        open: 'never',
        title: `Run by: 23127027 | ${runTimestamp}`,
      },
    ],
  ],
  use: {
    baseURL: process.env.PW_WEB_URL ?? 'http://localhost:5173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
