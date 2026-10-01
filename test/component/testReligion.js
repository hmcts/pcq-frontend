import TestWrapper from 'test/util/TestWrapper.js';
import ApplicantDisability from 'app/steps/ui/disability/index.js';
import testCommonContent from 'test/component/common/testCommonContent.js';
import config from 'config';
const basePath = config.app.basePath;

describe('ApplicantReligion', () => {
    let testWrapper;
    const expectedNextUrlForApplicantDisability = basePath + ApplicantDisability.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantReligion');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantReligion');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it(`test it redirects to applicant disability page: ${expectedNextUrlForApplicantDisability} - None`, (done) => {
            const data = {religion: 1};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantDisability);
        });

        it(`test it redirects to applicant disability page: ${expectedNextUrlForApplicantDisability} - Christian`, (done) => {
            const data = {religion: 2};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantDisability);
        });

        it(`test it redirects to applicant disability page: ${expectedNextUrlForApplicantDisability} - Buddhist`, (done) => {
            const data = {religion: 3};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantDisability);
        });

        it(`test it redirects to applicant disability page: ${expectedNextUrlForApplicantDisability} - Hindu`, (done) => {
            const data = {religion: 4};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantDisability);
        });

        it(`test it redirects to applicant disability page: ${expectedNextUrlForApplicantDisability} - Jewish`, (done) => {
            const data = {religion: 5};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantDisability);
        });

        it(`test it redirects to applicant disability page: ${expectedNextUrlForApplicantDisability} - Muslim`, (done) => {
            const data = {religion: 6};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantDisability);
        });

        it(`test it redirects to applicant disability page: ${expectedNextUrlForApplicantDisability} - Sikh`, (done) => {
            const data = {religion: 7};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantDisability);
        });

        it(`test it redirects to applicant disability page: ${expectedNextUrlForApplicantDisability} - Other`, (done) => {
            const data = {religion: 8};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantDisability);
        });

        it(`test it redirects to applicant disability page: ${expectedNextUrlForApplicantDisability} - Prefer not to say`, (done) => {
            const data = {religion: 0};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantDisability);
        });

        it(`test it redirects to applicant disability page: ${expectedNextUrlForApplicantDisability} - when no data is entered`, (done) => {
            const data = {};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantDisability);
        });
    });
});
