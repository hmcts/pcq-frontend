'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
let ApplicantDateOfBirth;
const content = require('app/resources/en/translation/dateofbirth');

describe('ApplicantDateOfBirth', () => {
    before(() => {
        const steps = initSteps([`${__dirname}/../../app/steps/ui/dateofbirth`]);
        ApplicantDateOfBirth = steps.ApplicantDateOfBirth;
    });

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantDateOfBirth.constructor.getUrl();
            expect(url).to.equal('/date-of-birth');
            done();
        });
    });

    describe('dateName()', () => {
        it('should return the date names array', (done) => {
            const dateName = ApplicantDateOfBirth.dateName();
            expect(dateName).to.deep.equal(['dob']);
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx = {};
        let errors = [];
        let formdata = {};
        const session = {};

        it('should return the ctx with the deceased dob', (done) => {
            ctx = {
                'dob_provided': 1,
                'dob-day': '02',
                'dob-month': '03',
                'dob-year': '1952'
            };
            errors = [];
            [ctx, errors] = ApplicantDateOfBirth.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'dob_provided': 1,
                'dob-day': '02',
                'dob-month': '03',
                'dob-year': '1952'
            });
            done();
        });

        it('should return the error for a date in the future', (done) => {
            ctx = {
                'dob_provided': 1,
                'dob-day': '02',
                'dob-month': '03',
                'dob-year': '3000'
            };
            errors = [];
            [ctx, errors] = ApplicantDateOfBirth.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dob-year',
                    href: '#dob-year',
                    msg: {
                        summary: content.errors['dob-year'].invalid.summary,
                        message: content.errors['dob-year'].invalid.message
                    }
                },
                {
                    field: 'dob',
                    href: '#dob',
                    msg: {
                        summary: content.errors.dob.dateInFuture.summary,
                        message: content.errors.dob.dateInFuture.message
                    }
                }
            ]);
            done();
        });

        it('should return the error for an invalid date', (done) => {
            ctx = {
                'dob_provided': 1,
                'dob-day': '31',
                'dob-month': '02',
                'dob-year': '2012'
            };
            errors = [];
            [ctx, errors] = ApplicantDateOfBirth.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'dob',
                    href: '#dob',
                    msg: {
                        summary: content.errors.dob.invalid.summary,
                        message: content.errors.dob.invalid.message
                    }
                }
            ]);
            done();
        });

        it('should return the required fields set to null if no options are selected', (done) => {
            ctx = {};
            errors = [];
            [ctx, errors] = ApplicantDateOfBirth.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'dob_provided': null
            });
            done();
        });
    });

    describe('validate()', () => {
        it('should not try to validate dob prefer not to say option', (done) => {
            const formdata = {};
            const ctx = {
                'dob_provided': 0,
                'dob-day': 'ab',
                'dob-month': 3,
                'dob-year': 2000
            };
            const language = 'en';

            const [isValid, errors] = ApplicantDateOfBirth.validate(ctx, formdata, language);
            expect(isValid).to.equal(true);
            expect(errors).to.deep.equal({});
            done();
        });

        it('should error on an invalid dob', (done) => {
            const formdata = {};
            const ctx = {
                'dob_provided': 1,
                'dob-day': 'ab',
                'dob-month': 3,
                'dob-year': 2000
            };
            const language = 'en';

            const [isValid, errors] = ApplicantDateOfBirth.validate(ctx, formdata, language);
            expect(isValid).to.equal(false);
            expect(errors.length).to.equal(1);
            done();
        });
    });

    describe('action()', () => {
        it('should delete the dob variables if the user doesn\'t want to provide it', (done) => {
            let ctx;
            [ctx] = ApplicantDateOfBirth.action({dob_provided: 0, 'dob-day': '02', 'dob-month': '03', 'dob-year': '3000'}, {});
            expect(ctx).to.deep.equal({
                dob_provided: 0
            });
            done();
        });
    });
});
