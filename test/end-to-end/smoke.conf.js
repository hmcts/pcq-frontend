const CONF = require('config');

exports.config = {
    output: process.cwd() + '/smoke-output',
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
        }
    },
    include: {
        I: 'test/end-to-end/pages/steps.js'
    },
    mocha: {
        reporter: 'mochawesome',
        reporterOptions: {
            reportDir: './smoke-output',
            inline: true
        }
    },
    gherkin: {
        features: 'features/smoke.feature',
        steps: ['./smoke/smoketest.js']
    },
    bootstrap: null,
    teardown: null,
    hooks: [],
    name: 'pcq-frontend'
};
