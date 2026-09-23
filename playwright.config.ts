import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    // Usa o Chromium já instalado no ambiente de desenvolvimento, evitando
    // um download que pode não bater com a versão do @playwright/test.
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : undefined,
  },
  webServer: {
    command: 'npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})
