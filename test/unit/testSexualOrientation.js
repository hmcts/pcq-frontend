import initSteps from 'app/core/initSteps.js';
import chai from 'chai';
import { fileURLToPath } from 'node:url';

const { expect } = chai;
const steps = initSteps([fileURLToPath(new URL('../../app/steps/ui', import.meta.url))]);
const ApplicantSexualOrientation = steps.ApplicantSexualOrientation;

describe('ApplicantSexualOrientation', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantSexualOrientation.constructor.getUrl();
            expect(url).to.equal('/sexual-orientation');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx = {};
        let errors = [];
        let formdata = {};
        const session = {};

        it('should delete the sexuality_other field from the context when not selected', (done) => {
            ctx = {
                'sexuality': 1,
                'sexuality_other': 'To be deleted'
            };
            errors = [];
            [ctx, errors] = ApplicantSexualOrientation.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                sexuality: 1
            });
            done();
        });

        it('should return the required fields set to null if no options are selected', (done) => {
            ctx = {};
            errors = [];
            [ctx, errors] = ApplicantSexualOrientation.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'sexuality': null
            });
            done();
        });
    });
});
