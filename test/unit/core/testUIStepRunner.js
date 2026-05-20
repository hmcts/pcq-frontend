'use strict';

const chai = require('chai');
const sinon = require('sinon');
const UIStepRunner = require('app/core/runners/UIStepRunner');

const expect = chai.expect;

describe('UIStepRunner', () => {
    const createStep = (featureToggles) => ({
        constructor: {
            getUrl: () => '/start-page'
        },
        template: 'test/template',
        getContextData: () => ({featureToggles}),
        handleGet: (ctx) => Promise.resolve([ctx, []]),
        generateContent: () => ({}),
        generateFields: () => ({}),
        commonContent: () => ({}),
        renderPage: sinon.spy()
    });

    const createRequest = (featureToggles) => ({
        params: ['no-redirect'],
        query: {source: ''},
        sessionID: '123',
        log: {
            info: sinon.spy(),
            error: sinon.spy()
        },
        session: {
            ctx: {errors: []},
            featureToggles,
            form: {serviceId: 'test-service'},
            journey: {},
            language: 'en',
            back: []
        }
    });

    const createResponse = () => ({
        locals: {releaseVersion: '1.2.3'},
        render: sinon.spy((template, payload, cb) => cb(null, '<html></html>')),
        status: sinon.stub().returnsThis()
    });

    it('adds dtrum app fields when dtrum toggle is true', async () => {
        const step = createStep({ft_dtrum_session_properties: 'true'});
        const req = createRequest({ft_dtrum_session_properties: 'true'});
        const res = createResponse();

        const runner = new UIStepRunner();
        await runner.handleGet(step, req, res);

        const payload = res.render.args[0][1];
        expect(payload.app).to.deep.equal({
            serviceId: 'test-service',
            version: '1.2.3',
            gaNonceUpdate: false
        });
    });

    it('sets gaNonceUpdate true when GA nonce toggle is true', async () => {
        const step = createStep({ft_ga_nonce_update: 'true'});
        const req = createRequest({ft_ga_nonce_update: 'true'});
        const res = createResponse();

        const runner = new UIStepRunner();
        await runner.handleGet(step, req, res);

        const payload = res.render.args[0][1];
        expect(payload.app).to.deep.equal({gaNonceUpdate: true});
    });
});
