
'use strict';

const event = require('codeceptjs').event;
const container = require('codeceptjs').container;
const exec = require('child_process').exec;

const sauceUsername = process.env.SAUCE_USERNAME;
const sauceKey = process.env.SAUCE_ACCESS_KEY;

function updateSauceLabsResult(result, sessionId) {
    console.log('SauceOnDemandSessionID=' + sessionId + ' job-name=pcq-frontend');
    return `curl -X PUT -s -d '{"passed": ${result}}' -u ${sauceUsername}:${sauceKey} https://eu-central-1.saucelabs.com/rest/v1/${sauceUsername}/jobs/${sessionId}`;
}

async function getSessionId() {
    const helper = container.helpers('WebDriver');
    if (!helper || !helper.browser) {
        return null;
    }
    
    try {
        // Primary method - direct sessionId property
        if (helper.browser.sessionId) {
            return helper.browser.sessionId;
        }
        
        // Fallback - async getSessionId method
        if (typeof helper.browser.getSessionId === 'function') {
            return await helper.browser.getSessionId();
        }
        
        return null;
    } catch (error) {
        console.error('Error getting session ID:', error);
        return null;
    }
}

module.exports = function() {
    event.dispatcher.on(event.test.passed, async (test) => {
        const sessionId = await getSessionId();
        if (!sessionId) {
            return;
        }
        exec(updateSauceLabsResult('true', sessionId));
    });

    event.dispatcher.on(event.test.failed, async (test) => {
        const sessionId = await getSessionId();
        if (!sessionId) {
            return;
        }
        exec(updateSauceLabsResult('false', sessionId));
    });
};