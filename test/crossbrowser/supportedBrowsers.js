const supportedBrowsers = {
    microsoftIE11: {
        ie11: {
            browserName: 'internet explorer',
            platformName: 'Windows 10',
            browserVersion: '11.285',
            'sauce:options': {
                name: 'PCQ_WIN10_IE11_11',
                extendedDebugging: true,
                capturePerformance: true
            }
        }
    },
    microsoftEdge: {
        edge: {
            browserName: 'MicrosoftEdge',
            platformName: 'Windows 10',
            browserVersion: '18.17763',
            'sauce:options': {
                name: 'PCQ_WIN10_EDGE_18',
                extendedDebugging: true,
                capturePerformance: true
            }
        }
    },
    chrome: {
        chrome_win_latest: {
            browserName: 'chrome',
            browserVersion: 'latest',
            platformName: 'Windows 10',
            'sauce:options': {
                name: 'PCQ_WIN10_CHROME_LATEST',
                extendedDebugging: true,
                capturePerformance: true
            }
        },
        chrome_mac_latest: {
            browserName: 'chrome',
            browserVersion: 'latest',
            platformName: 'macOS 10.13',
            'sauce:options': {
                name: 'PCQ_MAC_CHROME_LATEST',
                extendedDebugging: true,
                capturePerformance: true
            }
        }
    },
    firefox: {
        firefox_win_latest: {
            browserName: 'firefox',
            platformName: 'Windows 10',
            browserVersion: 'latest',
            'sauce:options': {
                name: 'PCQ_WIN10_FIREFOX_LATEST',
                extendedDebugging: true,
                capturePerformance: true
            }
        },
        firefox_mac_latest: {
            browserName: 'firefox',
            platformName: 'macOS 10.13',
            browserVersion: 'latest',
            'sauce:options': {
                name: 'PCQ_MAC_FIREFOX_LATEST',
                extendedDebugging: true,
                capturePerformance: true
            }
        },
    },
    safari: {
        safari11: {
            browserName: 'safari',
            browserVersion: '11.1',
            platformName: 'macOS 10.13',
            'sauce:options': {
                name: 'PCQ_MAC_SAFARI_11',
                extendedDebugging: true,
                capturePerformance: true
            }
        }
    }
};

module.exports = supportedBrowsers;
