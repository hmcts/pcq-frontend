import TestWrapper from 'test/util/TestWrapper.js';
import ApplicantEthnicGroup from 'app/steps/ui/ethnicgroup/index.js';
import testCommonContent from 'test/component/common/testCommonContent.js';
import config from 'config';
const basePath = config.app.basePath;

describe('ApplicantMaritalStatus', () => {
    let testWrapper;
    const expectedNextUrlForApplicantEthnicGroup = basePath + ApplicantEthnicGroup.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantMaritalStatus');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantMaritalStatus');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it(`test it redirects to applicant ethnic group page: ${expectedNextUrlForApplicantEthnicGroup} - Yes`, (done) => {
            const data = {marriage: 1};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantEthnicGroup);
        });

        it(`test it redirects to applicant ethnic group page: ${expectedNextUrlForApplicantEthnicGroup} - No`, (done) => {
            const data = {marriage: 2};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantEthnicGroup);
        });

        it(`test it redirects to applicant ethnic group page: ${expectedNextUrlForApplicantEthnicGroup} - Prefer not to say`, (done) => {
            const data = {marriage: 0};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantEthnicGroup);
        });

        it(`test it redirects to applicant ethnic group page: ${expectedNextUrlForApplicantEthnicGroup} - when no data is entered`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForApplicantEthnicGroup);
        });
    });
});
