import TestWrapper from 'test/util/TestWrapper.js';
import ApplicantEthnicBackgroundWhite from 'app/steps/ui/ethnicwhite/index.js';
import ApplicantEthnicBackgroundMixed from 'app/steps/ui/ethnicmixed/index.js';
import ApplicantEthnicBackgroundAsian from 'app/steps/ui/ethnicasian/index.js';
import ApplicantEthnicBackgroundBlack from 'app/steps/ui/ethnicblack/index.js';
import ApplicantEthnicBackgroundOther from 'app/steps/ui/ethnicother/index.js';
import ApplicantReligion from 'app/steps/ui/religion/index.js';
import testCommonContent from 'test/component/common/testCommonContent.js';
import config from 'config';
const basePath = config.app.basePath;

describe('ApplicantEthnicGroup', () => {
    let testWrapper;
    const expectedNextUrlForApplicantEthnicBackgroundWhite = basePath + ApplicantEthnicBackgroundWhite.getUrl();
    const expectedNextUrlForApplicantEthnicBackgroundMixed = basePath + ApplicantEthnicBackgroundMixed.getUrl();
    const expectedNextUrlForApplicantEthnicBackgroundAsian = basePath + ApplicantEthnicBackgroundAsian.getUrl();
    const expectedNextUrlForApplicantEthnicBackgroundBlack = basePath + ApplicantEthnicBackgroundBlack.getUrl();
    const expectedNextUrlForApplicantEthnicBackgroundOther = basePath + ApplicantEthnicBackgroundOther.getUrl();
    const expectedNextUrlForApplicantReligion = basePath + ApplicantReligion.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantEthnicGroup');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantEthnicGroup');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it(`test it redirects to applicant white ethnic group page: ${expectedNextUrlForApplicantEthnicBackgroundWhite}`, (done) => {
            const data = {
                ethnic_group: '1'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantEthnicBackgroundWhite);
        });

        it(`test it redirects to applicant mixed ethnic group page: ${expectedNextUrlForApplicantEthnicBackgroundMixed}`, (done) => {
            const data = {
                ethnic_group: '2'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantEthnicBackgroundMixed);
        });

        it(`test it redirects to applicant asian ethnic group page: ${expectedNextUrlForApplicantEthnicBackgroundAsian}`, (done) => {
            const data = {
                ethnic_group: '3'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantEthnicBackgroundAsian);
        });

        it(`test it redirects to applicant black ethnic group page: ${expectedNextUrlForApplicantEthnicBackgroundBlack}`, (done) => {
            const data = {
                ethnic_group: '4'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantEthnicBackgroundBlack);
        });

        it(`test it redirects to applicant other ethnic group page: ${expectedNextUrlForApplicantEthnicBackgroundOther}`, (done) => {
            const data = {
                ethnic_group: '5'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantEthnicBackgroundOther);
        });

        it(`test it redirects to applicant religion page: ${expectedNextUrlForApplicantReligion}`, (done) => {
            const data = {
                ethnic_group: '0'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantReligion);
        });

        it(`test it redirects to applicant religion page: ${expectedNextUrlForApplicantReligion} - when no data is entered`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForApplicantReligion);
        });
    });
});
