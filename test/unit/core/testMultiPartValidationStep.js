'use strict';

const expect = require('chai').expect;
const TestStep = require('test/data/steps/multipartvalidation/TestStep');
const InvalidChildSteps = require('test/data/steps/multipartvalidation/InvalidChildSteps');
const i18next = require('i18next');

describe('MultiPartValidationStep', () => {
    const steps = {};
    const section = 'test';
    // Using StartPage for resources (only affects template and content which are not required for these tests)
    const resourcePath = 'startpage';
    const schema = {
        'properties': {}
    };
    const language = 'en';

    describe('validChildSteps()', () => {
        const invalidChildSteps = new InvalidChildSteps(steps, section, resourcePath, i18next, schema, language);
        const testStep = new TestStep(steps, section, resourcePath, i18next, schema, language);

        it('should return false if any of the child step do not inherit MPVS', (done) => {
            expect(invalidChildSteps.validChildSteps()).to.equal(false);
            done();
        });

        it('should skip formdata deletion if childsteps is invalid', (done) => {
            let formdata = {
                pcqAnswers: {
                    'test1': 1,
                    'test2': 0,
                    'test3': 'This is a test'
                }
            };
            let ctx;
            [ctx, formdata] = invalidChildSteps.action({}, formdata);
            expect(formdata.pcqAnswers).to.deep.equal({
                'test1': 1,
                'test2': 0,
                'test3': 'This is a test'
            });
            done();
        });

        it('should return true if all child steps inherit MPVS', (done) => {
            expect(testStep.validChildSteps()).to.equal(true);
            done();
        });
    });

    describe('action()', () => {
        const testStep = new TestStep(steps, section, resourcePath, i18next, schema, language);

        it('should delete specified formdata fields if set to', (done) => {
            let formdata = {
                pcqAnswers: {
                    'test1': 1,
                    'test2': 0,
                    'dontdeleteme': 'please'
                }
            };
            let ctx;
            [ctx, formdata] = testStep.action({'test': 1}, formdata);
            expect(formdata.pcqAnswers).to.deep.equal({
                'dontdeleteme': 'please'
            });
            done();
        });

        it('should not delete specified formdata fields if not set to', (done) => {
            let formdata = {
                pcqAnswers: {
                    'test1': 1,
                    'test2': 0,
                    'dontdeleteme': 'please'
                }
            };
            let ctx;
            [ctx, formdata] = testStep.action({'test': 0}, formdata);
            expect(formdata.pcqAnswers).to.deep.equal({
                'test1': 1,
                'test2': 0,
                'dontdeleteme': 'please'
            });
            done();
        });

        it('should not complain if pcqAnswers is undefined', (done) => {
            let formdata = {};
            let ctx;
            [ctx, formdata] = testStep.action({}, formdata);
            expect(formdata).to.deep.equal({});
            done();
        });
    });

});
