import TestWrapper from 'test/util/TestWrapper.js';
import ApplicantDisabilityImplications from 'app/steps/ui/disabilityimplications/index.js';
import ApplicantPregnant from 'app/steps/ui/pregnant/index.js';
import testCommonContent from 'test/component/common/testCommonContent.js';
import config from 'config';
const basePath = config.app.basePath;

describe('ApplicantDisability', () => {
    let testWrapper;
    const expectedNextUrlForApplicantDisabilityImplications = basePath + ApplicantDisabilityImplications.getUrl();
    const expectedNextUrlForApplicantPregnant = basePath + ApplicantPregnant.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantDisability');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantDisability');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it(`test it redirects to applicant disability implications page: ${expectedNextUrlForApplicantDisabilityImplications}`, (done) => {
            const data = {
                disability_conditions: 1
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantDisabilityImplications);
        });

        it(`test it redirects to applicant pregnant page: ${expectedNextUrlForApplicantPregnant}`, (done) => {
            const data = {
                disability_conditions: 2
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantPregnant);
        });

        it(`test it redirects to applicant pregnant page: ${expectedNextUrlForApplicantPregnant} - Prefer not to say`, (done) => {
            const data = {
                disability_conditions: 0
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantPregnant);
        });

        it(`test it redirects to applicant pregnant page: ${expectedNextUrlForApplicantPregnant} - when no data is entered`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForApplicantPregnant);
        });
    });
});
