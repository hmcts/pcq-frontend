const CONF = require('config');
exports.config = {
    output: process.cwd()+'/functional-output',
    helpers: {
        Playwright: {
            url: CONF.testUrl || 'https://pcq.aat.platform.hmcts.net',
            show: false,
            browser: 'chromium',
            waitForTimeout: true,
            waitForAction: 350,
            timeout: 10000,
            waitForNavigation: 'load',
            ignoreHTTPSErrors: true,
        },
    },
    include: {
        I: 'test/end-to-end/pages/steps.js'
    },
    mocha: {
        reporter: 'mochawesome',
        reporterOptions: {
            reportDir: './functional-output/mochawesome',
            inline: true
        }
    },
    bootstrap: null,
    teardown: null,
    hooks: [],
    gherkin: {
        features: 'features/probate.feature',
        steps: ['./step_definitions/probatepcqjourney.js']
    },
    name: 'pcq-frontend'
};
