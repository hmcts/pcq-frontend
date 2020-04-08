'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/ui`]);
const ApplicantLanguage = steps.ApplicantLanguage;

describe('ApplicantLanguage', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantLanguage.constructor.getUrl();
            expect(url).to.equal('/language');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = ApplicantLanguage.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'language_main', value: 2, choice: 'otherLanguage'},
                ]
            });
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};

        it('should delete the language_other field from the context when not selected', (done) => {
            ctx = {
                'language_main': 1,
                'language_other': 'To be deleted'
            };
            errors = [];
            [ctx, errors] = ApplicantLanguage.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                language_main: 1,
                english_language_level: null
            });
            done();
        });

        it('should return the required fields set to null if no options are selected', (done) => {
            ctx = {};
            errors = [];
            [ctx, errors] = ApplicantLanguage.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'language_main': null,
                'english_language_level': null
            });
            done();
        });

        it('should set english_language_level to null if not selecting "other" option', (done) => {
            ctx = {
                'language_main': 1
            };
            errors = [];
            [ctx, errors] = ApplicantLanguage.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                language_main: 1,
                english_language_level: null
            });
            done();
        });
    });
});
