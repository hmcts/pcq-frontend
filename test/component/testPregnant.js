import TestWrapper from 'test/util/TestWrapper.js';
import EndPage from 'app/steps/ui/endpage/index.js';
import testCommonContent from 'test/component/common/testCommonContent.js';
import config from 'config';
const basePath = config.app.basePath;

describe('ApplicantPregnant', () => {
    let testWrapper;
    const expectedNextUrlForEndPage = basePath + EndPage.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantPregnant');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantPregnant');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it(`test it redirects to end page: ${expectedNextUrlForEndPage} - Yes`, (done) => {
            const data = {
                pregnancy: 1
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForEndPage);
        });

        it(`test it redirects to end page: ${expectedNextUrlForEndPage} - No`, (done) => {
            const data = {
                pregnancy: 2
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForEndPage);
        });

        it(`test it redirects to end page: ${expectedNextUrlForEndPage} - Prefer not to say`, (done) => {
            const data = {
                pregnancy: 0
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForEndPage);
        });

        it(`test it redirects to end page: ${expectedNextUrlForEndPage} - when no data is entered`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForEndPage);
        });
    });
});
