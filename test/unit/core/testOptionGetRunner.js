import OptionGetRunner from 'app/core/runners/OptionGetRunner.js';
import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import initSteps from 'app/core/initSteps.js';
import journey from 'app/journeys/default.js';
import { fileURLToPath } from 'node:url';

const { expect } = chai;
const steps = initSteps([fileURLToPath(new URL('../../../app/steps/ui', import.meta.url))], 'en');

chai.use(sinonChai);

describe('OptionGetRunner', () => {
    it('Test GET redirect', () => {
        const step = steps.StartPage;
        const req = {
            params: ['redirect'],
            session: {
                ctx: {StartPage: {}},
                journey: journey()
            },
            sessionID: '123'
        };

        const res = {redirect: sinon.spy()};

        const runner = new OptionGetRunner();
        runner.handleGet(step, req, res);

        expect(res.redirect.calledOnce).to.equal(true);
        expect(res.redirect.args[0][0]).to.equal('/date-of-birth');
    });

    it('Test GET', async () => {
        const step = steps.StartPage;
        const req = {
            params: ['no-redirect'],
            session: {
                ctx: {StartPage: {}},
                journey: journey(),
                language: 'en',
                back: {push: () => 0}
            },
            query: {source: ''},
            sessionID: '123'
        };

        const res = {
            render: sinon.spy()
        };

        const runner = new OptionGetRunner();
        await runner.handleGet(step, req, res);

        expect(res.render.calledOnce).to.equal(true);
    });

    it('Test GET - with dtrum session properties', async () => {
        const step = steps.StartPage;
        const req = {
            params: ['no-redirect'],
            session: {
                featureToggles: {
                    ft_dtrum_session_properties: true
                },
                form: {
                    serviceId: 'test'
                },
                ctx: {StartPage: {}},
                journey: journey(),
                language: 'en',
                back: {push: () => 0}
            },
            query: {source: ''},
            sessionID: '123'
        };

        const res = {
            render: sinon.spy(),
            locals: {releaseVersion: 'testVersion'}
        };

        const runner = new OptionGetRunner();
        await runner.handleGet(step, req, res);

        expect(res.render.calledOnce).to.equal(true);
        expect(res.render.args[0][1].app).to.deep.equal({version: 'testVersion', serviceId: 'test', gaNonceUpdate: false});
    });

    it('Test GET - with GA Nonce Update', async () => {
        const step = steps.StartPage;
        const req = {
            params: ['no-redirect'],
            session: {
                featureToggles: {
                    ft_ga_nonce_update: true
                },
                form: {
                    serviceId: 'test'
                },
                ctx: {StartPage: {}},
                journey: journey(),
                language: 'en',
                back: {push: () => 0}
            },
            query: {source: ''},
            sessionID: '123'
        };

        const res = {
            render: sinon.spy(),
            locals: {releaseVersion: 'testVersion'}
        };

        const runner = new OptionGetRunner();
        await runner.handleGet(step, req, res);

        expect(res.render.calledOnce).to.equal(true);
        expect(res.render.args[0][1].app).to.deep.equal({gaNonceUpdate: true});
    });

    it('Test POST', () => {
        const step = {name: 'test'};

        const req = {};
        req.session = {
            language: 'en'
        };
        req.log = sinon.spy();
        req.log.error = sinon.spy();
        const res = {};
        res.render = sinon.spy();
        res.status = sinon.spy();

        const runner = new OptionGetRunner();
        runner.handlePost(step, req, res);
        expect(req.log.error).to.have.been.calledWith('Post operation not defined for OptionGetRunner');
        expect(res.status).to.have.been.calledWith(404);
        expect(res.render).to.have.been.calledWith('errors/error');
    });
});
