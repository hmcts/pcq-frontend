const supportedBrowsers = {
  
    browser: 'chrome',
  desiredCapabilities: {
    browserName: 'chrome',
    browserVersion: 'latest',
    platformName: 'Windows 11',
    'sauce:options': {
      username: process.env.SAUCE_USERNAME,
      accessKey: process.env.SAUCE_ACCESS_KEY,
      name: 'PCQ Chrome Sauce Test'
    }
  },

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
