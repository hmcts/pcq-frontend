'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/ui/disabilityimplicationsareas`]);
const ApplicantDisabilityImplicationAreas = steps.ApplicantDisabilityImplicationAreas;

describe('ApplicantDisabilityImplicationAreas', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantDisabilityImplicationAreas.constructor.getUrl();
            expect(url).to.equal('/disability-implications-areas');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the context with the disability implications areas', (done) => {
            const req = {
                session: {
                    ctx: {
                        disabilityimplicationsareas: {
                            disabilityImplicationsAreas: [
                                'disability_vision',
                                'disability_memory'
                            ]
                        }
                    }
                }
            };

            const ctx = ApplicantDisabilityImplicationAreas.getContextData(req);
            expect(ctx.disabilityImplicationsAreas).to.deep.equal([
                'disability_vision',
                'disability_memory'
            ]);
            done();
        });

        it('should always return an array', done => {
            const req = {
                session: {
                    ctx: {
                        disabilityimplicationsareas: {
                            disabilityImplicationsAreas: 'disability_none'
                        }
                    }
                }
            };

            const ctx = ApplicantDisabilityImplicationAreas.getContextData(req);
            expect(ctx.disabilityImplicationsAreas).to.deep.equal([
                'disability_none'
            ]);
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx = {};
        let errors = [];
        let formdata = {};
        const session = {};

        it('should return the ctx will all fields null when no options are selected', (done) => {
            ctx = {
                'disabilityImplicationsAreas': []
            };
            errors = [];
            [ctx, errors] = ApplicantDisabilityImplicationAreas.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                disability_vision: null,
                disability_hearing: null,
                disability_mobility: null,
                disability_dexterity: null,
                disability_learning: null,
                disability_memory: null,
                disability_mental_health: null,
                disability_stamina: null,
                disability_social: null,
                disability_other: null,
                disability_none: null
            });
            done();
        });

        it('should return the ctx will all fields returning either 0 or 1 when >=1 option selected', (done) => {
            ctx = {
                'disabilityImplicationsAreas': ['disability_vision']
            };
            errors = [];
            [ctx, errors] = ApplicantDisabilityImplicationAreas.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                disability_vision: 1,
                disability_hearing: 0,
                disability_mobility: 0,
                disability_dexterity: 0,
                disability_learning: 0,
                disability_memory: 0,
                disability_mental_health: 0,
                disability_stamina: 0,
                disability_social: 0,
                disability_other: 0,
                disability_none: 0
            });
            done();
        });

        it('should delete the disability_other_details field from the context when not selected', (done) => {
            ctx = {
                'disabilityImplicationsAreas': [],
                'disability_other_details': 'Other disability'
            };
            errors = [];
            [ctx, errors] = ApplicantDisabilityImplicationAreas.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                disability_vision: null,
                disability_hearing: null,
                disability_mobility: null,
                disability_dexterity: null,
                disability_learning: null,
                disability_memory: null,
                disability_mental_health: null,
                disability_stamina: null,
                disability_social: null,
                disability_other: null,
                disability_none: null
            });
            done();
        });
    });
});
