'use strict';

const pa11y = require('pa11y');

module.exports = (testPage) => {
    return new Promise((resolve, reject) => {
        pa11y(testPage, {
            includeWarnings: true,
            chromeLaunchConfig: {
                executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            },
            hideElements: '.govuk-cookie-banner__heading, .govuk-box-highlight, .govuk-header__logo, .govuk-footer, link[rel=mask-icon], .govuk-skip-link, .govuk-button--start, .govuk-visually-hidden, .govuk-warning-text__assistive, iframe, #ctsc-web-chat, .govuk-warning-text__icon',
        }, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
