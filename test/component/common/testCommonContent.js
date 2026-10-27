import TestWrapper from 'test/util/TestWrapper.js';
import commonContent from 'app/resources/en/translation/common.json' with { type: 'json' };

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

export default TestCommonContent;
