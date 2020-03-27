'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantDisabilityImplicationAreas = require('app/steps/ui/disabilityimplicationsareas');
const ApplicantPregnant = require('app/steps/ui/pregnant');
const testCommonContent = require('test/component/common/testCommonContent.js');
const config = require('app/config');
const basePath = config.app.basePath;

describe('ApplicantDisabilityImplications', () => {
    let testWrapper;
    const expectedNextUrlForApplicantDisabilityImplicationAreas = basePath + ApplicantDisabilityImplicationAreas.getUrl();
    const expectedNextUrlForApplicantPregnant = basePath + ApplicantPregnant.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantDisabilityImplications');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantDisabilityImplications');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it(`test it redirects to applicant disability implications areas page: ${expectedNextUrlForApplicantDisabilityImplicationAreas}`, (done) => {
            const data = {
                disability_impact: 1
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantDisabilityImplicationAreas);
        });

        it(`test it redirects to applicant disability implications areas page: ${expectedNextUrlForApplicantDisabilityImplicationAreas}`, (done) => {
            const data = {
                disability_impact: 2
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantDisabilityImplicationAreas);
        });

        it(`test it redirects to applicant pregnant page: ${expectedNextUrlForApplicantPregnant}`, (done) => {
            const data = {
                disability_impact: 3
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantPregnant);
        });

        it(`test it redirects to applicant pregnant page: ${expectedNextUrlForApplicantPregnant} - Prefer not to say`, (done) => {
            const data = {
                disability_impact: 0
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantPregnant);
        });

        it(`test it redirects to applicant pregnant page: ${expectedNextUrlForApplicantPregnant} - when no data is entered`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForApplicantPregnant);
        });
    });
});
