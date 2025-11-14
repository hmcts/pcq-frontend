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
        /*chrome_win_latest: {
            browserName: 'chrome',
            browserVersion: 'latest',
            platformName: 'Windows 11',
            'sauce:options': {
                name: 'PCQ_WIN11_CHROME_LATEST',
                extendedDebugging: true
            }
        },*/
        chrome_android_16: {
            platformName: 'Android',
            browserName: 'Chrome',
            'appium:deviceName': 'Google Pixel 9 Pro Emulator',
            'appium:platformVersion': '16.0',
            'appium:automationName': 'UiAutomator2',
            'sauce:options': {
                appiumVersion: '2.11.0',
                name: 'PCQ_ANDROID_CHROME_16',
                deviceOrientation: 'PORTRAIT',
            }
        },
        
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
        safari_ios_simulator_17: {
            browserName: 'Safari',
            platformName: 'iOS',
            'appium:deviceName': 'iPhone Simulator',
            'appium:platformVersion': '17.0',
            'appium:automationName': 'XCUITest',
            'sauce:options': {
                appiumVersion: '2.1.3',
                name: 'PCQ_IOS_SAFARI_17',
            }
        }
  }
  
};

module.exports = supportedBrowsers;
