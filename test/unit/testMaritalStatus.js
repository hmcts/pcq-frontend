'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/ui`]);
const ApplicantMaritalStatus = steps.ApplicantMaritalStatus;

describe('ApplicantMaritalStatus', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantMaritalStatus.constructor.getUrl();
            expect(url).to.equal('/marital-status');
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
            [ctx, errors] = ApplicantMaritalStatus.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'marriage': null
            });
            done();
        });
    });
});
