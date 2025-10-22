const supportedBrowsers = require('../crossbrowser/supportedBrowsers.js');

const browser = process.env.SAUCELABS_BROWSER;
const tunnelName = process.env.TUNNEL_IDENTIFIER || 'reformtunnel';
const getBrowserConfig = (browserGroup) => {
    const browserConfig = [];
    for (const candidateBrowser in supportedBrowsers[browserGroup]) {
        if (candidateBrowser) {
            const desiredCapability = supportedBrowsers[browserGroup][candidateBrowser];
            desiredCapability['sauce:options'].tunnelIdentifier = tunnelName;
            desiredCapability['sauce:options'].acceptSslCerts = true;
            desiredCapability['sauce:options'].tags = ['pcq-frontend'];
            browserConfig.push({
                browser: desiredCapability.browserName,
                desiredCapabilities: desiredCapability
            });
        } else {
            console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
        }
    }
    return browserConfig;
};

const setupConfig = {
    output: `${process.cwd()}/functional-output`,
    helpers: {
        WebDriver: {
            url: process.env.TEST_URL || 'https://pcq.aat.platform.hmcts.net',
            browser,
            cssSelectorsEnabled: 'true',

            user: process.env.SAUCE_USERNAME,
            key: process.env.SAUCE_ACCESS_KEY,
            region: 'eu',
            sauceConnect: true,
            services: ['sauce'],

            // This line is required to ensure test name and browsers are set correctly for some reason.
            desiredCapabilities: {'sauce:options': {}}
        },
        SauceLabsReportingHelper: {
            require: './helpers/SauceLabsReportingHelper.js'
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
        'I': './pages/steps.js'
    },
    mocha: {
        reporter: 'mochawesome',
        reporterOptions: {
            reportDir: process.env.E2E_CROSSBROWSER_OUTPUT_DIR || './functional-output',
            reportTitle: 'Crossbrowser results',
            inline: true
        }
    },
    multiple: {
        microsoftEdge: {
            browsers: getBrowserConfig('microsoftEdge')
        },
        chrome: {
            browsers: getBrowserConfig('chrome')
        },
        firefox: {
            browsers: getBrowserConfig('firefox')
        },
        safari: {
            browsers: getBrowserConfig('safari')
        }
    }
};

exports.config = setupConfig;
