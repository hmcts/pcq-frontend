'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/ui/pregnant`]);
const ApplicantPregnant = steps.ApplicantPregnant;

describe('ApplicantPregnant', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantPregnant.constructor.getUrl();
            expect(url).to.equal('/pregnant');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx = {};
        let errors = [];
        let formdata = {};
        const session = {};

        it('should return the required fields set to null if no options are selected', (done) => {
            ctx = {};
            errors = [];
            [ctx, errors] = ApplicantPregnant.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'pregnancy': null
            });
            done();
        });
    });
});
