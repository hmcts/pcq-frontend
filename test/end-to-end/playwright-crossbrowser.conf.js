const CONF = require('config');

const setupConfig = {
    output: `${process.cwd()}/functional-output/playwright-crossbrowser`,
    helpers: {
        Playwright: {
            url: process.env.TEST_URL || CONF.testUrl || 'https://pcq.aat.platform.hmcts.net',
            show: false,
            //default browser is chromium, but we can override it in the multiple section below
            browser: 'chromium',
            waitForTimeout: true,
            waitForAction: 350,
            timeout: 10000,
            waitForNavigation: 'load',
            ignoreHTTPSErrors: true,
        },
    },
    plugins: {
        autoDelay: {
            enabled: true,
        },
        retryFailedStep: {
            enabled: true,
        },
    },
    gherkin: {
        features: 'features/crossbrowser.feature',
        steps: ['./step_definitions/probatepcqjourney.js']
    },
    include: {
        I: './pages/steps.js'
    },
    mocha: {
        reporter: 'mochawesome',
        reporterOptions: {
            reportDir: process.env.E2E_CROSSBROWSER_OUTPUT_DIR || './functional-output/playwright-crossbrowser',
            reportTitle: 'Crossbrowser results (Playwright)',
            inline: true
        }
    },
    multiple: {
        chromium: {
            browsers: [{ browser: 'chromium' }]
        },
        firefox: {
            browsers: [{ browser: 'firefox' }]
        },
        webkit: {
            browsers: [{ browser: 'webkit' }]
        },
        edge: {
            browsers: [{ browser: 'chromium', channel: 'msedge'}]
}
    },
    name: 'pcq-frontend-playwright-crossbrowser'
};

exports.config = setupConfig;