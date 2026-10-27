import TestWrapper from 'test/util/TestWrapper.js';
import ApplicantEnglishLevel from 'app/steps/ui/englishlevel/index.js';
import ApplicantSex from 'app/steps/ui/sex/index.js';
import testCommonContent from 'test/component/common/testCommonContent.js';
import config from 'config';
const basePath = config.app.basePath;

describe('ApplicantLanguage', () => {
    let testWrapper;
    const expectedNextUrlForApplicantEnglishLevel = basePath + ApplicantEnglishLevel.getUrl();
    const expectedNextUrlForApplicantSex = basePath + ApplicantSex.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantLanguage');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantLanguage');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it(`test it redirects to applicant english level page: ${expectedNextUrlForApplicantEnglishLevel}`, (done) => {
            const data = {
                language_main: 2
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantEnglishLevel);
        });

        it(`test it redirects to applicant sex page: ${expectedNextUrlForApplicantSex}`, (done) => {
            const data = {
                language_main: 3
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantSex);
        });

        it(`test it redirects to applicant sex page: ${expectedNextUrlForApplicantSex}`, (done) => {
            const data = {
                language_main: 4
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantSex);
        });

        it(`test it redirects to applicant sex page: ${expectedNextUrlForApplicantSex} - Prefer not to say`, (done) => {
            const data = {language_main: 0};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantSex);
        });

        it(`test it redirects to applicant sex page: ${expectedNextUrlForApplicantSex} - when no data is entered`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForApplicantSex);
        });
    });
});
