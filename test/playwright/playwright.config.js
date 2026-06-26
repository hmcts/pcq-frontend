import { CommonConfig, ProjectsConfig } from '@hmcts/playwright-common';
import { defineConfig } from '@playwright/test';

module.exports = defineConfig({
    testDir: './tests',
    outputDir: '../../functional-output/playwright-native',
    reporter: [
        ['list'],
        ['html', { outputFolder: '../../playwright-report', open: 'never' }]
    ],
    use: {
        ...CommonConfig.recommended.use,
        baseURL: process.env.TEST_URL || 'http://localhost:4000',
        ignoreHTTPSErrors: true,
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    retries: 2,
    timeout: 60000,
    projects: [ProjectsConfig.chromium, ProjectsConfig.firefox, ProjectsConfig.webkit, ProjectsConfig.edge]
});