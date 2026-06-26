// @playwright/test is required — install via: yarn add -D @playwright/test
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    outputDir: '../../functional-output/playwright-native',
    reporter: [
        ['list'],
        ['html', { outputFolder: '../../playwright-report', open: 'never' }]
    ],
    use: {
        baseURL: process.env.TEST_URL || 'http://localhost:4000',
        ignoreHTTPSErrors: true,
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    retries: 2,
    timeout: 60000,
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
        { name: 'edge',     use: { ...devices['Desktop Edge'], channel: 'msedge' } }
    ]
});