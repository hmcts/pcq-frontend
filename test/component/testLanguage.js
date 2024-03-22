'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantEnglishLevel = require('app/steps/ui/englishlevel');
const ApplicantSex = require('app/steps/ui/sex');
const testCommonContent = require('test/component/common/testCommonContent.js');
const config = require('config');
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
