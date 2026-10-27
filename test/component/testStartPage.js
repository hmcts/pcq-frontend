import TestWrapper from 'test/util/TestWrapper.js';
import ApplicantDateOfBirth from 'app/steps/ui/dateofbirth/index.js';
import config from 'config';
const basePath = config.app.basePath;

describe('StartPage', () => {
    let testWrapper;
    const expectedNextUrlForApplicantDateOfBirth = basePath + ApplicantDateOfBirth.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('StartPage');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it(`test it redirects to applicant date of birth page: ${expectedNextUrlForApplicantDateOfBirth}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForApplicantDateOfBirth);
        });
    });
});
