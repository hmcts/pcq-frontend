
const event = require('codeceptjs').event;
const container = require('codeceptjs').container;
const exec = require('child_process').exec;

const sauceUsername = process.env.SAUCE_USERNAME;
const sauceKey = process.env.SAUCE_ACCESS_KEY;

function updateSauceLabsResult(result, sessionId) {
    console.log('SauceOnDemandSessionID=' + sessionId + ' job-name=pcq-frontend');
    return 'curl -X PUT -s -d \'{"passed": ' + result + '}\' -u ' + sauceUsername + ':' + sauceKey + ' https://eu-central-1.saucelabs.com/rest/v1/' + sauceUsername + '/jobs/' + sessionId;
}

module.exports = function() {
    event.dispatcher.on(event.test.passed, async (test) => {
        const helper = container.helpers('WebDriver');
        const sessionId = helper?.browser?.sessionId;
        
        if (!sessionId) {
            return;
        }
        
        exec(updateSauceLabsResult('true', sessionId));
    });

    event.dispatcher.on(event.test.failed, async (test) => {
        const helper = container.helpers('WebDriver');
        const sessionId = helper?.browser?.sessionId;
        
        if (!sessionId) {
            return;
        }
        
        exec(updateSauceLabsResult('false', sessionId));
    });
};
