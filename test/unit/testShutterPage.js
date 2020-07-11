'use strict';

const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/ui`]);
const ShutterPage = steps.ShutterPage;
const expect = require('chai').expect;

describe('ShutterPage', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ShutterPage.constructor.getUrl();
            expect(url).to.equal('/offline');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the context with the return url', (done) => {
            const req = {
                sessionID: 'some session id',
                session: {
                    returnUrl: 'some-return-url',
                    ctx: {}
                }
            };

            const ctx = ShutterPage.getContextData(req);
            expect(ctx).have.property('sessionID', 'some session id');
            expect(ctx).to.have.property('returnUrl', 'some-return-url');
            done();
        });

        it('should return the context when no return url is present', (done) => {
            const req = {
                sessionID: 'some session id',
                session: {
                    ctx: {}
                }
            };

            const ctx = ShutterPage.getContextData(req);
            expect(ctx).have.property('sessionID', 'some session id');
            expect(ctx).to.not.have.property('returnUrl');
            done();
        });

        it('should return the context with the services array', (done) => {
            const req = {
                sessionID: 'some session id',
                session: {
                    ctx: {}
                }
            };

            const ctx = ShutterPage.getContextData(req);
            expect(ctx).have.deep.property('redirectLinks',
                {
                    'probate': 'https://www.apply-for-probate.service.gov.uk/dashboard',
                    'caveats': 'https://www.apply-for-probate.service.gov.uk/caveats/dashboard',
                    'cmc_claimant': 'https://www.moneyclaims.service.gov.uk/dashboard',
                    'cmc_defendant': 'https://www.moneyclaims.service.gov.uk/dashboard'
                }
            );
            done();
        });
    });

    describe('action()', () => {
        it('test that context variables are removed and empty object returned', () => {
            let formdata = {};
            let ctx = {
                returnUrl: 'some_url'
            };
            [ctx, formdata] = ShutterPage.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });
    });

    describe('generateContent()', () => {
        it('should return variable text for a service', () => {
            const formdata = {
                serviceId: 'cmc',
                actor: 'claimant'
            };
            const content = ShutterPage.generateContent({}, formdata);
            expect(content.paragraph1).to.equal('We have saved your answers and will direct you back to your claim now.');
        });

        it('should return variable text for a service in welsh', () => {
            const formdata = {
                serviceId: 'cmc',
                actor: 'claimant'
            };
            const content = ShutterPage.generateContent({}, formdata, 'cy');
            expect(content.paragraph1).to.equal('Rydym wedi arbed eich atebion a byddwn yn eich cyfeirio yn ôl at eich hawliad yn awr.');
        });
    });
});
