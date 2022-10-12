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
        reporterOptions: {
            'codeceptjs-cli-reporter': {
                stdout: '-',
                'options': {'steps': true}
            },
            'mocha-junit-reporter': {
                'stdout': '-',
                'options': {'mochaFile': './functional-output/result.xml'}
            },
            mochawesome: {
                'stdout': './functional-output/console.log',
                'options': {
                    'reportDir': './functional-output/mochawesome',
                    'reportName': 'index',
                    'inlineAssets': true
                }
            }
        }
    },
    bootstrap: null,
    teardown: null,
    hooks: [],
    gherkin: {
        features: 'features/probate.feature',
        steps: ['./step_definitions/probatepcqjourney.js']
    },
    plugins: {
        screenshotOnFail: {
            enabled: true
        },
        retryFailedStep: {
            enabled: true
        },
        stepByStepReport: {
            enabled: true,
            deleteSuccessful: true,
            ignoreSteps: ['wait*', 'fill*', 'grab*', 'set*', 'click*', 'select*', 'am*'],
            screenshotsForAllureReport: true
        },
        allure: {
            enabled: true,
            // enableScreenshotDiffPlugin: true,
        },
        autoDelay: {
            enabled: true
        }
    },
    tests: './test/*_test.js',
    name: 'pcq-frontend'
};
