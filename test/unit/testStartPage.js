'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/ui`]);
const StartPage = steps.StartPage;

describe('StartPage', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = StartPage.constructor.getUrl();
            expect(url).to.equal('/start-page');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the context with the return url', (done) => {
            const req = {
                sessionID: 'some session id',
                session: {
                    returnUrl: 'http://some-return-url/',
                    ctx: {}
                }
            };

            const ctx = StartPage.getContextData(req);
            expect(ctx).to.contains({
                sessionID: 'some session id',
                returnUrl: 'http://some-return-url/'
            });
            done();
        });

        it('should return the context when no return url is present', (done) => {
            const req = {
                sessionID: 'some session id',
                session: {
                    ctx: {}
                }
            };

            const ctx = StartPage.getContextData(req);
            expect(ctx).to.contains({
                sessionID: 'some session id'
            });
            done();
        });
    });

    describe('action()', () => {
        it('test that context variables are removed and empty object returned', () => {
            let formdata = {};
            let ctx = {
                returnUrl: 'some_url'
            };
            [ctx, formdata] = StartPage.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });
        it('removes the optOut flag from formdata if present', () => {
            let formdata = {
                optOut: 'Y'
            };
            let ctx = {};
            [ctx, formdata] = StartPage.action(ctx, formdata);
            expect(formdata).to.deep.equal({});
        });
    });

    describe('generateContent()', () => {
        it('should return variable text for a service', () => {
            const formdata = {
                serviceId: 'cmc',
                actor: 'claimant'
            };
            const content = StartPage.generateContent({}, formdata);
            expect(content.paragraph2).to.equal('Your answers will not affect your claim.');
        });

        it('should return variable text for a service in welsh', () => {
            const formdata = {
                serviceId: 'cmc',
                actor: 'claimant'
            };
            const content = StartPage.generateContent({}, formdata, 'cy');
            expect(content.paragraph2).to.equal('Ni fydd eich atebion yn effeithio ar eich hawliad.');
        });
    });
});
