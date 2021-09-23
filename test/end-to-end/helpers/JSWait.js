class JSWait extends codecept_helper { // eslint-disable-line camelcase
    _beforeStep(step) {
        const helper = this.helpers.WebDriver || this.helpers.Puppeteer;

        // Wait for content to load before checking URL
        if (step.name === 'seeCurrentUrlEquals') {
            helper.waitForElement('#content', 5000);
        }
    }
}
module.exports = JSWait;
