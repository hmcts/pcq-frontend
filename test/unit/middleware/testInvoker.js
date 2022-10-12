'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const app = require('app');
const request = require('supertest');
const invoker = rewire('app/middleware/invoker');

describe('Invoker', () => {
    describe('formFiller()', () => {
        it('should fill specified fields', (done) => {
            const formFiller = invoker.__get__('formFiller');
            const req = {
                query: {
                    service: 'SERVICE',
                    actor: 'ACTOR',
                    fields: 'serviceId,partyId,language'
                }
            };
            const res = {
                json: sinon.spy()
            };

            formFiller(req, res);
            const resJson = res.json.args[0][0];

            expect(resJson.serviceId).to.equal('SERVICE');
            expect(resJson.partyId).to.equal('SERVICE_ACTOR@test.gov.uk');
            expect(resJson.language).to.equal('en');

            done();
        });
    });

    describe('postForm()', () => {
        it('should redirect to the service endpoint with the correct params', (done) => {
            const postForm = invoker.__get__('postForm');
            const req = {
                body: {
                    serviceId: 'a',
                    actor: 'b',
                    pcqId: 'c',
                    ccdCaseId: 'd',
                    partyId: 'e',
                    returnUrl: 'f',
                    language: 'g',
                    _csrf: 'h',
                }
            };
            const res = {
                redirect: sinon.spy()
            };

            postForm(req, res);
            const redirectUrl = res.redirect.args[0][0];
            expect(redirectUrl).to.equal('/service-endpoint?serviceId=a&actor=b&pcqId=c&ccdCaseId=d&partyId=e&returnUrl=f&language=g');

            done();
        });
    });

    describe('genToken()', () => {
        it('should generate a valid encryption token for the provided fields', (done) => {
            const genToken = invoker.__get__('genToken');
            const req = {
                query: {
                    serviceId: 'CMC',
                    actor: 'b',
                    ccdCaseId: 'd',
                    pcqId: 'c',
                    partyId: 'e',
                    language: 'g',
                    returnUrl: 'f'
                }
            };
            const res = {
                json: sinon.spy()
            };

            genToken(req, res);
            const token = res.json.args[0][0].token;
            expect(token).to.equal('0677614d23ea22ca9566bcc69956f5c07b488bc49c7ce16f117a12f6dea9a5' +
                'de17e686e5bd7cee0c380516a8a351c07de75203938bec1657aa0f66706ef7' +
                '13b9726de765801a4081d1a9488da29dc4183654eed92462ac4658a092a06a' +
                '06a2438eea3a131c700c58');
            done();
        });
    });

    describe('Routing', () => {
        it('should load the invoker page', (done) => {
            const server = app.init(false, {});
            const agent = request.agent(server.app);
            agent.get('/invoker')
                .expect(200)
                .end((err, res) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    expect(res.text).to.contain('PCQ Invoker');
                    done();
                });
        });

        it('should not load in prod environment', (done) => {
            const rewiredApp = rewire('app');
            rewiredApp.__set__('config.environment', 'prod');
            const server = rewiredApp.init(false, {});
            const agent = request.agent(server.app);
            agent.get('/invoker')
                .expect(404)
                .end((err, res) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    expect(res.text).to.contain('Page not found');
                    done();
                });
        });
    });
});
