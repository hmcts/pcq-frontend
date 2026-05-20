'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
let ApplicantEnglishLevel;

describe('ApplicantEnglishLevel', () => {
    before(() => {
        const steps = initSteps([`${__dirname}/../../app/steps/ui/englishlevel`]);
        ApplicantEnglishLevel = steps.ApplicantEnglishLevel;
    });

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantEnglishLevel.constructor.getUrl();
            expect(url).to.equal('/english-level');
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
            [ctx, errors] = ApplicantEnglishLevel.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                'english_language_level': null
            });
            done();
        });
    });
});
