'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/ui/ethnicgroup`]);
const ApplicantEthnicGroup = steps.ApplicantEthnicGroup;

describe('ApplicantEthnicGroup', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantEthnicGroup.constructor.getUrl();
            expect(url).to.equal('/ethnic-group');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = ApplicantEthnicGroup.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'ethnic_group', value: 1, choice: 'White'},
                    {key: 'ethnic_group', value: 2, choice: 'Mixed'},
                    {key: 'ethnic_group', value: 3, choice: 'Asian'},
                    {key: 'ethnic_group', value: 4, choice: 'Black'},
                    {key: 'ethnic_group', value: 5, choice: 'Other'},
                ]
            });
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx = {};
        let errors = [];
        let formdata = {};
        const session = {};
        it('sets the ethnicity and resets "other" text when selecting "None"', (done) => {
            ctx = {
                'ethnic_group': 0
            };
            errors = [];
            [ctx, errors] = ApplicantEthnicGroup.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'ethnic_group': 0,
                'ethnicity': 0,
                'ethnicity_other': null
            });
            done();
        });

        it('should return the required fields set to null if no options are selected', (done) => {
            ctx = {};
            errors = [];
            [ctx, errors] = ApplicantEthnicGroup.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'ethnicity': null
            });
            done();
        });
    });
});
