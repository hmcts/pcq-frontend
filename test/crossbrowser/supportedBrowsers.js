const supportedBrowsers = {
    microsoftEdge: {
        edge: {
            browserName: 'MicrosoftEdge',
            platformName: 'Windows 11',
            browserVersion: 'latest',
            'sauce:options': {
                name: 'PCQ_WIN11_EDGE_LATEST',
            }
        }
    },
    chrome: {
        chrome_win_latest: {
            browserName: 'chrome',
            browserVersion: 'latest',
            platformName: 'Windows 11',
            'sauce:options': {
                name: 'PCQ_WIN11_CHROME_LATEST',
                extendedDebugging: true
            }
        },
        chrome_mac_latest: {
            browserName: 'chrome',
            browserVersion: 'latest',
            platformName: 'macOS 15',
            'sauce:options': {
                name: 'PCQ_MAC_CHROME_LATEST',
                extendedDebugging: true
            }
        }
    },
    firefox: {
        firefox_win_latest: {
            browserName: 'firefox',
            platformName: 'Windows 11',
            browserVersion: 'latest',
            'sauce:options': {
                name: 'PCQ_WIN11_FIREFOX_LATEST',
                extendedDebugging: true
            }
        },
        firefox_mac_latest: {
            browserName: 'firefox',
            platformName: 'macOS 13',
            browserVersion: 'latest',
            'sauce:options': {
                name: 'PCQ_MAC_FIREFOX_LATEST',
                extendedDebugging: true
            }
        },
    },
    safari: {
        safari_latest_mac_arm: {
            browserName: 'safari',
            browserVersion: 'latest',
            platformName: 'macOS 15',
            'sauce:options': {
                armRequired: true,
                name: 'PCQ_MAC_SAFARI_LATEST_ARM',
            }
        },
        safari_latest_mac_intel: {
            browserName: 'safari',
            browserVersion: 'latest',
            platformName: 'macOS 15',
            'sauce:options': {
                name: 'PCQ_MAC_SAFARI_LATEST_INTEL',
            }
        }
    }
};

module.exports = supportedBrowsers;
