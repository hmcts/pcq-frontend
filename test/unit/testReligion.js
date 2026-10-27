import initSteps from 'app/core/initSteps.js';
import chai from 'chai';
import { fileURLToPath } from 'node:url';

const { expect } = chai;
const steps = initSteps([fileURLToPath(new URL('../../app/steps/ui', import.meta.url))]);
const ApplicantReligion = steps.ApplicantReligion;

describe('ApplicantReligion', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantReligion.constructor.getUrl();
            expect(url).to.equal('/religion');
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
                'religion': 8,
                'religion_other': 'Other religion'
            };
            errors = [];
            [ctx, errors] = ApplicantReligion.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                religion: 8,
                religion_other: 'Other religion'
            });
            done();
        });

        it('should delete the religion_other field from the context when not selected', (done) => {
            ctx = {
                'religion': 1,
                'religion_other': 'To be deleted'
            };
            errors = [];
            [ctx, errors] = ApplicantReligion.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                religion: 1
            });
            done();
        });

        it('should return the required fields set to null if no options are selected', (done) => {
            ctx = {};
            errors = [];
            [ctx, errors] = ApplicantReligion.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'religion': null
            });
            done();
        });
    });
});
