'use strict';

const TestWrapper = require('test/util/TestWrapper');

describe('shutter-page', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('ShutterPage');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page with no returnUrl in session', (done) => {
            testWrapper.testContent(done, {}, [
                'paragraph1'
            ]);
        });

        it('test content loaded on the page with returnUrl in session', (done) => {
            testWrapper.agent.post('/prepare-session-field/returnUrl/some-return-url')
                .end(() => {
                    testWrapper.testContent(done, {}, [
                        'paragraph1_noUrl',
                        'probate',
                        'caveats',
                        'cmc_claimant',
                        'cmc_defendant',
                        'divorce_petitioner',
                        'divorce_respondent',
                        'sscs',
                        'iac',
                        'adoption',
                        'et_claimant',
                        'et_respondent'
                    ]);
                });
        });
    });
});
