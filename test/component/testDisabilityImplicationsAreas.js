import TestWrapper from 'test/util/TestWrapper.js';
import ApplicantPregnant from 'app/steps/ui/pregnant/index.js';
import testCommonContent from 'test/component/common/testCommonContent.js';
import config from 'config';
const basePath = config.app.basePath;

describe('ApplicantDisabilityImplicationAreas', () => {
    let testWrapper;
    const expectedNextUrlForApplicantPregnant = basePath + ApplicantPregnant.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantDisabilityImplicationAreas');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantDisabilityImplicationAreas');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it(`test it redirects to applicant pregnant page: ${expectedNextUrlForApplicantPregnant}`, (done) => {
            const data = {
                disabilityImplicationsAreas: ['disability_vision', 'disability_dexterity']
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantPregnant);
        });

        it(`test it redirects to applicant pregnant page: ${expectedNextUrlForApplicantPregnant} - when no data is entered`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForApplicantPregnant);
        });
    });
});
