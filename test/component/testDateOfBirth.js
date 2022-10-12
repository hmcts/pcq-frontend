'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantLanguage = require('app/steps/ui/language');
const testCommonContent = require('test/component/common/testCommonContent.js');
const config = require('config');
const basePath = config.app.basePath;

describe('ApplicantDateOfBirth', () => {
    let testWrapper;
    const expectedNextUrlForApplicantLanguage = basePath + ApplicantLanguage.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ApplicantDateOfBirth');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ApplicantDateOfBirth');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it('test errors message displayed for invalid day', (done) => {
            const errorsToTest = ['dob-day'];
            const data = {
                'dob_provided': 1,
                'dob-day': '32',
                'dob-month': '9',
                'dob-year': '2000'
            };

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for invalid month', (done) => {
            const errorsToTest = ['dob-month'];
            const data = {
                'dob_provided': 1,
                'dob-day': '13',
                'dob-month': '14',
                'dob-year': '2000'
            };

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for invalid year', (done) => {
            const errorsToTest = ['dob-year'];
            const data = {
                'dob_provided': 1,
                'dob-day': '12',
                'dob-month': '12',
                'dob-year': '2099'
            };

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for non-numeric day', (done) => {
            const errorsToTest = ['dob-day'];
            const data = {
                'dob_provided': 1,
                'dob-day': 'ab',
                'dob-month': '09',
                'dob-year': '2000'
            };

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for non-numeric month', (done) => {
            const errorsToTest = ['dob-month'];
            const data = {
                'dob_provided': 1,
                'dob-day': '13',
                'dob-month': 'ab',
                'dob-year': '2000'
            };

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for non-numeric year', (done) => {
            const errorsToTest = ['dob-year'];
            const data = {
                'dob_provided': 1,
                'dob-day': '13',
                'dob-month': '12',
                'dob-year': '20ab'
            };

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for three digits in year field', (done) => {
            const errorsToTest = ['dob-year'];
            const data = {
                'dob_provided': 1,
                'dob-day': '12',
                'dob-month': '9',
                'dob-year': '200'
            };

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for date in the future', (done) => {
            const errorsToTest = ['dob'];
            const data = {
                'dob_provided': 1,
                'dob-day': '12',
                'dob-month': '9',
                'dob-year': '3000'
            };

            testWrapper.testErrors(done, data, 'dateInFuture', errorsToTest);
        });

        it('test error message displayed for missing dob fields', (done) => {
            const errorsToTest = ['dob-month', 'dob-year'];
            const data = {
                'dob_provided': 1,
                'dob-day': '12',
            };

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test error message displayed for missing dob field', (done) => {
            const errorsToTest = ['dob-year'];
            const data = {
                'dob_provided': 1,
                'dob-day': '12',
                'dob-month': '12',
            };

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it(`test it redirects to applicant language page: ${expectedNextUrlForApplicantLanguage}  - DoB entered`, (done) => {
            const data = {
                'dob_provided': 1,
                'dob-day': '01',
                'dob-month': '01',
                'dob-year': '1999'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantLanguage);
        });

        it(`test it redirects to applicant language page: ${expectedNextUrlForApplicantLanguage} - DoB fields empty`, (done) => {
            const data = {'dob_provided': 1};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantLanguage);
        });

        it(`test it redirects to applicant language page: ${expectedNextUrlForApplicantLanguage} - Prefer not to say`, (done) => {
            const data = {'dob_provided': 0};

            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantLanguage);
        });

        it(`test it redirects to applicant language page: ${expectedNextUrlForApplicantLanguage} - when no data is entered`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForApplicantLanguage);
        });
    });
});
