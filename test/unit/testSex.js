import initSteps from 'app/core/initSteps.js';
import chai from 'chai';
import { fileURLToPath } from 'node:url';

const { expect } = chai;
const steps = initSteps([fileURLToPath(new URL('../../app/steps/ui', import.meta.url))]);
const ApplicantSex = steps.ApplicantSex;

describe('ApplicantSex', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantSex.constructor.getUrl();
            expect(url).to.equal('/sex');
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
            [ctx, errors] = ApplicantSex.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'sex': null
            });
            done();
        });
    });
});
