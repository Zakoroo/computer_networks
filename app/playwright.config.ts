import { defineConfig } from '@playwright/test';

const packaged = Boolean(process.env.NETWORK_STUDY_EXECUTABLE);
const baseURL = `http://127.0.0.1:${packaged ? 4173 : 5174}`;

export default defineConfig({
  testDir: './tests/browser',
  timeout: 60_000,
  use: {
    baseURL, trace: 'retain-on-failure',
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : undefined,
  },
  webServer: {
    command: packaged ? 'node ../tools/run_packaged_study.mjs' : 'npm run test:serve',
    url: baseURL,
    reuseExistingServer: false,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 15_000 },
  },
});
