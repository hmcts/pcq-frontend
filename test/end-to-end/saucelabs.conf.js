const supportedBrowsers = require('../crossbrowser/supportedBrowsers.js');
const tunnelName = process.env.TUNNEL_IDENTIFIER || 'reformtunnel';

const clone = o => JSON.parse(JSON.stringify(o));

const getBrowserConfig = (browserGroup) => {
  const group = supportedBrowsers[browserGroup];
  if (!group) throw new Error(`Unknown browserGroup: ${browserGroup}`);

  return Object.keys(group).map(k => {
    const caps = clone(group[k]);

    caps['sauce:options'] = caps['sauce:options'] || {};
    caps['sauce:options'].tunnelIdentifier = tunnelName;
    caps['sauce:options'].tags = ['pcq-frontend'];
    caps['sauce:options'].idleTimeout = 180;
    caps['sauce:options'].maxDuration = 1800;


    caps.acceptInsecureCerts = true;

    if (String(caps.browserName).toLowerCase() === 'microsoftedge') {
      caps.browserName = 'MicrosoftEdge';
    }

    return { browser: caps.browserName, desiredCapabilities: caps };
  });

};

const setupConfig = {
    output: `${process.cwd()}/functional-output`,
    helpers: {
        WebDriver: {
        host: 'ondemand.eu-central-1.saucelabs.com',
        port: 443,
        protocol: 'https',
        user: process.env.SAUCE_USERNAME,
        key: process.env.SAUCE_ACCESS_KEY,
        url: process.env.TEST_URL || 'https://pcq.aat.platform.hmcts.net',
        desiredCapabilities: { 'sauce:options': {} },
        cssSelectorsEnabled: true,
        },
        SauceLabsReportingHelper: { require: './helpers/SauceLabsReportingHelper.js' },
    },
    plugins: {
        autoDelay: { enabled: true },
        retryFailedStep: { enabled: true },
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
        /*},
        firefox: {
            browsers: getBrowserConfig('firefox')
        },
        safari: {
            browsers: getBrowserConfig('safari')*/
        }
    }
};

exports.config = setupConfig;
