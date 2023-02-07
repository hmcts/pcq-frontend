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
