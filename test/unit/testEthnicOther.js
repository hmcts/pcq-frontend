'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/ui/ethnicother`]);
const ApplicantEthnicBackgroundOther = steps.ApplicantEthnicBackgroundOther;

describe('ApplicantEthnicBackgroundOther', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantEthnicBackgroundOther.constructor.getUrl();
            expect(url).to.equal('/other-ethnic-group');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx = {};
        let errors = [];
        let formdata = {};
        const session = {};

        it('should return the ctx with the ethnicity', (done) => {
            ctx = {
                'ethnicity': 18,
                'ethnicity_other': 'Other ethnicity'
            };
            errors = [];
            [ctx, errors] = ApplicantEthnicBackgroundOther.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                ethnicity: 18,
                ethnicity_other: 'Other ethnicity'
            });
            done();
        });

        it('should set the ethnicity_other field to null when not selected', (done) => {
            ctx = {
                'ethnicity': 17,
                'ethnicity_other': 'To be set to null'
            };
            errors = [];
            [ctx, errors] = ApplicantEthnicBackgroundOther.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                ethnicity: 17,
                ethnicity_other: null
            });
            done();
        });

        it('should return the required fields set to null if no options are selected', (done) => {
            ctx = {};
            errors = [];
            [ctx, errors] = ApplicantEthnicBackgroundOther.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'ethnicity': null,
                'ethnicity_other': null
            });
            done();
        });
    });
});
