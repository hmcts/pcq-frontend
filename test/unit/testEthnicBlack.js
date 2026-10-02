import initSteps from 'app/core/initSteps.js';
import chai from 'chai';
import { fileURLToPath } from 'node:url';

const { expect } = chai;
const steps = initSteps([fileURLToPath(new URL('../../app/steps/ui', import.meta.url))]);
const ApplicantEthnicBackgroundBlack = steps.ApplicantEthnicBackgroundBlack;

describe('ApplicantEthnicBackgroundBlack', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantEthnicBackgroundBlack.constructor.getUrl();
            expect(url).to.equal('/black-ethnic-group');
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
                'ethnicity': 16,
                'ethnicity_other': 'Other ethnicity'
            };
            errors = [];
            [ctx, errors] = ApplicantEthnicBackgroundBlack.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                ethnicity: 16,
                ethnicity_other: 'Other ethnicity'
            });
            done();
        });

        it('should set the ethnicity_other field to null when not selected', (done) => {
            ctx = {
                'ethnicity': 14,
                'ethnicity_other': 'To be set to null'
            };
            errors = [];
            [ctx, errors] = ApplicantEthnicBackgroundBlack.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                ethnicity: 14,
                ethnicity_other: null
            });
            done();
        });

        it('should return the required fields set to null if no options are selected', (done) => {
            ctx = {};
            errors = [];
            [ctx, errors] = ApplicantEthnicBackgroundBlack.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'ethnicity': null,
                'ethnicity_other': null
            });
            done();
        });
    });
});
