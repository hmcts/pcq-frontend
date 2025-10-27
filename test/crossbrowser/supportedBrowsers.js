const supportedBrowsers = {
  ios_safari_18: {
    platformName: "iOS",
    "appium:platformVersion": "18.0",
    "appium:deviceName": "iPhone 15",
    "appium:automationName": "XCUITest",
    browserName: "safari",
    "sauce:options": {
      name: "PCQ_IOS_SAFARI_18",
    },
  },

  android_15_chrome_mobile: {
    platformName: "Android",
    "appium:platformVersion": "15.0",
    "appium:deviceName": "Android GoogleAPI Emulator",
    "appium:automationName": "UiAutomator2",
    browserName: "chrome",
    "sauce:options": {
      name: "PCQ_ANDROID15_CHROME_MOBILE",
    },
  },

  windows11_chrome: {
    browserName: "chrome",
    platformName: "Windows 11",
    browserVersion: "latest",
    "sauce:options": {
      name: "PCQ_WIN11_CHROME_LATEST",
      extendedDebugging: true,
    },
  },

  windows11_edge: {
    browserName: "microsoftedge",
    platformName: "Windows 11",
    browserVersion: "latest",
    "sauce:options": {
      name: "PCQ_WIN11_EDGE_LATEST",
      extendedDebugging: true,
    },
  },

  macos_10_15_chrome: {
    browserName: "chrome",
    platformName: "macOS 10.15",
    browserVersion: "latest",
    "sauce:options": {
      name: "PCQ_MAC1015_CHROME",
      extendedDebugging: true,
    },
  },

  macos_10_15_safari: {
    browserName: "safari",
    platformName: "macOS 10.15",
    browserVersion: "15",
    "sauce:options": {
      name: "PCQ_MAC1015_SAFARI",
    },
  },
};

module.exports = supportedBrowsers;
