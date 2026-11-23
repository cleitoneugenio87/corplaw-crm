import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45000,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4190', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile-390', use: { viewport: { width: 390, height: 900 }, isMobile: true, hasTouch: true } },
    { name: 'mobile-320', use: { viewport: { width: 320, height: 800 }, isMobile: true, hasTouch: true } }
  ],
  webServer: { command: 'node scripts/serve.mjs', url: 'http://127.0.0.1:4190', reuseExistingServer: true }
});
