'use strict';

const OptionGetRunner = require('app/core/runners/OptionGetRunner');
const UIStepRunner = require('app/core/runners/UIStepRunner');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

describe('OptionGetRunner', () => {
    it('Test GET redirect', () => {
        const step = {
            getContextData: sinon.stub().returns({foo: 'bar'}),
            nextStepUrl: sinon.stub().returns('/date-of-birth')
        };
        const req = {
            params: ['redirect'],
            sessionID: '123'
        };

        const res = {redirect: sinon.spy()};

        const runner = new OptionGetRunner();
        runner.handleGet(step, req, res);

        expect(res.redirect.calledOnce).to.equal(true);
        expect(res.redirect.args[0][0]).to.equal('/date-of-birth');
    });

    it('Test GET', async () => {
        const superGetStub = sinon.stub(UIStepRunner.prototype, 'handleGet').resolves('ok');
        const step = {name: 'test-step'};
        const req = {
            params: ['no-redirect'],
            session: {language: 'en'},
            query: {source: ''},
            sessionID: '123'
        };

        const res = {render: sinon.spy()};

        const runner = new OptionGetRunner();
        const result = await runner.handleGet(step, req, res);

        expect(superGetStub.calledOnce).to.equal(true);
        expect(superGetStub.calledWith(step, req, res)).to.equal(true);
        expect(result).to.equal('ok');
        superGetStub.restore();
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
