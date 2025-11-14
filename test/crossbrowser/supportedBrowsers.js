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
        chrome_andriod_latest: {
            browserName: 'chrome',
            'appium:deviceName': 'Google.*',
            'appium:platformVersion': '10',
            'appium:automationName': 'UiAutomator2',
            browserVersion: 'latest',
            platformName: 'android',
            'sauce:options': {
                appiumVersion: 'latest',
                name: 'PCQ_ANDROID_CHROME_LATEST',
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
            platformName: 'macOS 11',
            browserVersion: 'latest',
            'sauce:options': {
                name: 'PCQ_MAC_FIREFOX_LATEST',
                extendedDebugging: true
            }
        }
   },
   safari: {
        ios_latest: {
            browserName: 'safari',
            'appium:deviceName': 'iPhone.*',
            'appium:platformVersion': '18',
            'appium:automationName': 'XCUITest',
            platformName: 'iOS',
            'sauce:options': {
                appiumVersion: 'latest',
                name: 'PCQ_IOS_SAFARI_LATEST',
                extendedDebugging: true
            }
        }
      
  }
};

module.exports = supportedBrowsers;
