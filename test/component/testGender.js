'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantSexualOrientation = require('app/steps/ui/sexualorientation');
const testCommonContent = require('test/component/common/testCommonContent.js');
const config = require('app/config');
const basePath = config.app.basePath;

describe('ApplicantGenderSameAsSex', () => {
    let testWrapper;
    const expectedNextUrlForApplicantSexualOrientation = basePath + ApplicantSexualOrientation.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantGenderSameAsSex');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantGenderSameAsSex');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it(`test it redirects to applicant sexual orientation page: ${expectedNextUrlForApplicantSexualOrientation} - Yes`, (done) => {
            const data = {gender_different: 1};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantSexualOrientation);
        });

        it(`test it redirects to applicant sexual orientation page: ${expectedNextUrlForApplicantSexualOrientation} - No`, (done) => {
            const data = {gender_different: 2};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantSexualOrientation);
        });

        it(`test it redirects to applicant sexual orientation page: ${expectedNextUrlForApplicantSexualOrientation} - Prefer not to say`, (done) => {
            const data = {gender_different: 0};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantSexualOrientation);
        });

        it(`test it redirects to applicant sexual orientation page: ${expectedNextUrlForApplicantSexualOrientation} - when no data is entered`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForApplicantSexualOrientation);
        });
    });
});
