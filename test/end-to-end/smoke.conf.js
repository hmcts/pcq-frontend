const CONF = require('config');

exports.config = {
    output: process.cwd() + '/smoke-output',
    helpers: {
        Puppeteer: {
            url: CONF.testUrl,
            show: false,
            headless: false,
            chrome: {
                'ignoreHTTPSErrors': true,
                'ignore-certificate-errors': true,
                'defaultViewport': {
                    'width': 1280,
                    'height': 960
                },
                args: [
                    '--no-sandbox',
                    `--proxy-server=${process.env.E2E_PROXY_SERVER || ''}`,
                    `--proxy-bypass-list=${process.env.E2E_PROXY_BYPASS || ''}`,
                    '--window-size=1440,1400'
                ]
            }
        }
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
                'options': {'mochaFile': './smoke-output/result.xml'}
            },
            mochawesome: {
                'stdout': './smoke-output/console.log',
                'options': {
                    'reportDir': './smoke-output',
                    'reportName': 'index',
                    charts: true,
                    'inlineAssets': true
                }
            }
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
