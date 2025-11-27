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
            platformName: 'Windows 11',
            browserVersion: 'latest',
            'sauce:options': {
                name: 'PCQ_WIN11_CHROME_LATEST',
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
            platformName: 'macOS 11',
            browserVersion: 'latest',
            'sauce:options': {
                name: 'PCQ_MAC_FIREFOX_LATEST',
                extendedDebugging: true
            }
        }
  }
  
};

module.exports = supportedBrowsers;
