'use strict';

const TestWrapper = require('test/util/TestWrapper');
const commonContent = require('app/resources/en/translation/common');

class TestCommonContent {
    static runTest(page) {
        describe('Test the help content', () => {
            const testWrapper = new TestWrapper(page);

            it('test help block content is loaded on page', (done) => {
                testWrapper.setValidParameters(() => {
                    const playbackData = {
                        whyAskingParagraph: commonContent.whyAskingParagraph,
                        whyAsking: commonContent.whyAsking
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
            });

            testWrapper.destroy();
        });
    }
}

module.exports = TestCommonContent;
