'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/ui`]);
const ApplicantGenderSameAsSex = steps.ApplicantGenderSameAsSex;

describe('ApplicantGenderSameAsSex', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantGenderSameAsSex.constructor.getUrl();
            expect(url).to.equal('/gender-same-as-sex');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx = {};
        let errors = [];
        let formdata = {};
        const session = {};

        it('should delete the gender_other field from the context when not selected', (done) => {
            ctx = {
                'gender_different': 1,
                'gender_other': 'To be deleted'
            };
            errors = [];
            [ctx, errors] = ApplicantGenderSameAsSex.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                gender_different: 1
            });
            done();
        });

        it('should return the required fields set to null if no options are selected', (done) => {
            ctx = {};
            errors = [];
            [ctx, errors] = ApplicantGenderSameAsSex.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'gender_different': null
            });
            done();
        });
    });
});
