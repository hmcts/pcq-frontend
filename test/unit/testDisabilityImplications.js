'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/ui/disabilityimplications`]);
const ApplicantDisabilityImplications = steps.ApplicantDisabilityImplications;

describe('ApplicantDisabilityImplications', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantDisabilityImplications.constructor.getUrl();
            expect(url).to.equal('/disability-implications');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = ApplicantDisabilityImplications.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'disability_impact', value: 1, choice: 'Yes'},
                    {key: 'disability_impact', value: 2, choice: 'Yes'}
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

        it('should return the required fields set to null if no options are selected', (done) => {
            ctx = {};
            errors = [];
            [ctx, errors] = ApplicantDisabilityImplications.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'disability_impact': null
            });
            done();
        });
    });

    describe('formdata', () => {
        it('should delete implicationsareas formdata if set to', (done) => {
            let formdata = {
                pcqAnswers: {
                    'disability_other_details': 'qweqweqew',
                    'disability_vision': 1,
                    'disability_hearing': 1,
                    'disability_mobility': 1,
                    'disability_dexterity': 0,
                    'disability_learning': 0,
                    'disability_memory': 0,
                    'disability_mental_health': 0,
                    'disability_stamina': 0,
                    'disability_social': 0,
                    'disability_other': 1,
                    'disability_none': 0
                }
            };
            let ctx;
            [ctx, formdata] = ApplicantDisabilityImplications.action({'disability_impact': 3}, formdata);
            expect(formdata.pcqAnswers).to.deep.equal({});
            done();
        });

        it('should not delete implicationsareas formdata if not set', (done) => {
            let formdata = {
                pcqAnswers: {
                    'disability_other_details': 'qweqweqew',
                    'disability_vision': 1,
                    'disability_hearing': 1,
                    'disability_mobility': 1,
                    'disability_dexterity': 0,
                    'disability_learning': 0,
                    'disability_memory': 0,
                    'disability_mental_health': 0,
                    'disability_stamina': 0,
                    'disability_social': 0,
                    'disability_other': 1,
                    'disability_none': 0
                }
            };
            let ctx;
            [ctx, formdata] = ApplicantDisabilityImplications.action({'disability_impact': 1}, formdata);
            expect(formdata.pcqAnswers).to.deep.equal({
                'disability_other_details': 'qweqweqew',
                'disability_vision': 1,
                'disability_hearing': 1,
                'disability_mobility': 1,
                'disability_dexterity': 0,
                'disability_learning': 0,
                'disability_memory': 0,
                'disability_mental_health': 0,
                'disability_stamina': 0,
                'disability_social': 0,
                'disability_other': 1,
                'disability_none': 0
            });
            done();
        });
    });
});
