'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/ui/disability`]);
const ApplicantDisability = steps.ApplicantDisability;

describe('ApplicantDisability', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantDisability.constructor.getUrl();
            expect(url).to.equal('/disability');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = ApplicantDisability.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'disability_conditions', value: 1, choice: 'Yes'}
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
            [ctx, errors] = ApplicantDisability.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'disability_conditions': null
            });
            done();
        });
    });

    describe('formdata', () => {
        it('should delete implications and implicationsareas formdata if set to', (done) => {
            let formdata = {
                pcqAnswers: {
                    'disability_impact': 1,
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
            [ctx, formdata] = ApplicantDisability.action({'disability_conditions': 2}, formdata);
            expect(formdata.pcqAnswers).to.deep.equal({});
            done();
        });

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
            [ctx, formdata] = ApplicantDisability.action({'disability_conditions': 0}, formdata);
            expect(formdata.pcqAnswers).to.deep.equal({});
            done();
        });

        it('should delete implications formdata if set to', (done) => {
            let formdata = {
                pcqAnswers: {
                    'disability_impact': 2,
                }
            };
            let ctx;
            [ctx, formdata] = ApplicantDisability.action({'disability_conditions': 2}, formdata);
            expect(formdata.pcqAnswers).to.deep.equal({});
            done();
        });

        it('should not delete implications and implicationsareas formdata if not set', (done) => {
            let formdata = {
                pcqAnswers: {
                    'disability_impact': 1,
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
            [ctx, formdata] = ApplicantDisability.action({'disability_conditions': 1}, formdata);
            expect(formdata.pcqAnswers).to.deep.equal({
                'disability_impact': 1,
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
