'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/ui`]);
const EndPage = steps.EndPage;

describe('EndPage', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = EndPage.constructor.getUrl();
            expect(url).to.equal('/end-page');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the context with the return url', (done) => {
            const req = {
                session: {
                    returnUrl: 'http://some-return-url/',
                    language: 'cy',
                    form: {}
                }
            };

            const ctx = EndPage.getContextData(req);
            expect(ctx.returnUrl).to.equal('http://some-return-url/?locale=cy');
            done();
        });
    });

    describe('action()', () => {
        it('test that context variables are removed and empty object returned', () => {
            let formdata = {};
            let ctx = {
                returnUrl: 'some_url'
            };
            [ctx, formdata] = EndPage.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });
    });
});
