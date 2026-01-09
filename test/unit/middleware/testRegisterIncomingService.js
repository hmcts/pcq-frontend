
'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const config = require('config');
const app = require('../../../app');
const nock = require('nock');
const rewire = require('rewire');
const request = require('supertest');
const {setSession, registerIncomingService} = require('app/middleware/registerIncomingService');

describe('registerIncomingService', () => {
    describe('middleware', () => {
        it('should assign valid incoming query params to the session and redirect to the start page with returnUrl empty', () => {
            const req = {
                query: {
                    serviceId: 'CMC',
                    actor: 'CLAIMANT',
                    pcqId: '78e69022-2468-4370-a88e-bea2a80fa51f',
                    ccdCaseId: 1234567890123456,
                    partyId: 'applicant@email.com',
                    returnUrl: 'invoking-service-return-url/',
                    language: 'en',
                    channel: 2,
                    token: '3b74573af3cf7403d07f8f9b58e8fbfae5b41a389469858da85f94caf089a4dd3bdfa79bfd347275329900c54' +
                        'e06eee027383c3b2cfe5fb0258033e72bd8cc82334d69d2ac2d11208cd825b52b1a9b7769f8aafaa15b9c4d9e433' +
                        'cb3f49f5b29047a22f48005c37dd9a4e9cba5c11ac95b8b42197c3928a9afd475f5141ed7cd8d56b848b464ea191' +
                        'af59df6d85156dc63f20baf0bf6dfe064984b6cc98486f362940ee262b48a13086913999fa18116f7270f5e509a3' +
                        '4b515304f0aeff45e75f23b60cb0053d03b9ed96116815f055855065fcb4dd73ffab1db137e6d30013f'               
                },
                session: {
                    form: {}
                }
            };

            setSession(req);
            registerIncomingService(req);

            expect(req.session).to.deep.equal({
                returnUrl: '',
                language: 'en',
                form: {
                    serviceId: 'cmc',
                    actor: 'claimant',
                    pcqId: '78e69022-2468-4370-a88e-bea2a80fa51f',
                    ccdCaseId: 1234567890123456,
                    partyId: 'applicant@email.com',
                    channel: 2
                },
                token: req.session.token,
                validParameters: true
            });
        });

        it('should assign valid incoming query params to the session and redirect to the start page with correct returnUrl', () => {
            const req = {
                query: {
                    serviceId:'CMC',
                    actor:'CLAIMANT',
                    ccdCaseId:'9aaff0bc-a544-48e1-ae43-dae0044a20dd',
                    pcqId:'fda99051-cbbe-4765-905c-e70905841d38',
                    partyId:'CMC_CLAIMANT@test.gov.uk',
                    returnUrl:'CMC_CLAIMANT.test.gov.uk',
                    language:'en',
                    channel: 2,
                    token: '3b74573af3cf7403d07f8f9b58e8fbfae5b41a389469858da85f94caf089a4ddc2b21e1e9980e048'+
                            '8b83af38d89e170388aadba3bfda51c887c0c9753fca431e452da02561fa302fb75fd41cc7887d8b6'+
                            '66f09a746a38375ad1aff3cedb3173cb8f557fbbaa5d3a2f726d263695f89703e31a8b8ddb02e1c76'+
                            '3286b597cb564c47836ebb502eff1c0b72a1ba82d2e6af73abb9df683f820ed5570ea09a3423cc848d'+
                            '7c0400e6f49fc9bb2ab19f3f7e56047d758f23bac0c64bbdf94d09755e791e9978461b434d3f4305498'+
                            '94871d9d24459fbd80989a15ca9d07fa3990840f28137b47bb2ea35686f9057fd6690dc6799d798eb74'+
                            'ad1312ef42b512bf6807e0'
                },
                session: {
                    form: {}
                }
            };

            setSession(req);
            registerIncomingService(req);

            expect(req.session).to.deep.equal({
                returnUrl: 'https://CMC_CLAIMANT.test.gov.uk',
                language: 'en',
                form: {
                    serviceId: 'cmc',
                    actor: 'claimant',
                    pcqId: 'fda99051-cbbe-4765-905c-e70905841d38',
                    ccdCaseId: '9aaff0bc-a544-48e1-ae43-dae0044a20dd',
                    partyId: 'CMC_CLAIMANT@test.gov.uk',
                    channel: 2
                },
                token: req.session.token,
                validParameters: true
            });
        });

        it('should assign default params to the session when none passed and redirect to the start page', async () => {
            const req = {
                query: {},
                session: {
                    form: {}
                }
            };
            const res = {
                redirect: sinon.spy()
            };

            setSession(req);
            await registerIncomingService(req, res);

            expect(req.session).to.deep.equal({
                form: {channel: 1}
            });
        });

        it('should assign a valid JWT token to the session', async () => {
            const req = {
                query: {
                    serviceId: 'CMC',
                    actor: 'CLAIMANT',
                    pcqId: '78e69022-2468-4370-a88e-bea2a80fa51f',
                    partyId: 'applicant@email.com',
                    returnUrl: 'invoking-service-return-url/',
                    token: '3b74573af3cf7403d07f8f9b58e8fbfae5b41a389469858da85f94caf089a4dd3bdfa79bfd347275329900c5' +
                        '4e06eee027383c3b2cfe5fb0258033e72bd8cc82334d69d2ac2d11208cd825b52b1a9b77b2dd48e344018c4cf7f' +
                        'fc08297beb6cb6f344a70fe9bcd21d0cf1af6b1d69858442853ce245b66ce086818e3faed638d38db4036f396db' +
                        '28f20bd333db5a2d9207671fc69c551d112fc23fd9c7f9eae41cbecb9b2bd37457268c6f14e751507c'
                },
                session: {
                    form: {}
                }
            };
            const res = {
                redirect: sinon.spy()
            };

            setSession(req);
            await registerIncomingService(req, res);

            const validToken = jwt.verify(req.session.token, config.auth.jwt.secret, (err) => {
                return !err;
            });

            expect(validToken).to.equal(true);
        });

        it('should not create a token or validate the service if its not registered', async () => {
            const req = {
                query: {
                    serviceId: 'NOTREGISTERED',
                    actor: 'APPLICANT',
                    pcqId: '78e69022-2468-4370-a88e-bea2a80fa51f',
                    partyId: 'applicant@email.com',
                    returnUrl: 'http://invoking-service-return-url/',
                    token: '13008eff475abb48ecf18b9e6ea316fa61a0c371f95ff75977cc92093397d765e3b124d4d058f1345e812f76d4ff' +
                        '47d4e1a0949da0aacfb2721247aa4fd380729777ebfbb2f068af034189cd6b22f7368c002444e1c8c8f4d7d436aa339' +
                        'b9cb034e551917d27e9ef6008a0930c29f6baecadcb61baf46409eadbbc274b0fdca322fc3bcd6e96848c8a75495e74' +
                        '5d83152b9fed597839d4caf52bdfa3ec2491d801d53af860e749ce313f89858fc908848acc9328e643d89b613cbf3b6' +
                        '2056a44'
                },
                session: {
                    form: {}
                }
            };
            const res = {
                redirect: sinon.spy()
            };

            setSession(req);
            await registerIncomingService(req, res);

            expect(req.session).to.not.have.property('token');
            expect(req.session).to.not.have.property('validParameters');
        });
    });
    describe('route', () => {

        afterEach(() => {
            nock.cleanAll();
        });

        it('should redirect to /start-page if the backend is up', (done) => {
            nock('http://localhost:4000')
                .get('/health')
                .reply(
                    200,
                    {'pcq-backend': {'status': 'UP'}}
                );
            const server = app.init();
            const agent = request.agent(server.app);
            agent.get('/service-endpoint?serviceId=PROBATE&actor=APPLICANT&pcqId=12&ccdCaseId=12&partyId=12&returnUrl=test')
                .expect(302)
                .end((err, res) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    expect(res.redirect).to.equal(true);
                    expect(res.header.location).to.equal('/start-page');
                    done();
                });
        });

        it('should redirect to /offline if the backend is down', (done) => {
            nock(config.services.pcqBackend.url)
                .get('/health')
                .reply(
                    500,
                    {'status': 'DOWN'}
                );
            const server = app.init();
            const agent = request.agent(server.app);
            agent.get('/service-endpoint')
                .expect(302)
                .end((err, res) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    expect(res.redirect).to.equal(true);
                    expect(res.header.location).to.equal('/offline');
                    done();
                });
        });

        it('should redirect to /start-page if the backend is DOWN and backend \'enabled\' is set to false', (done) => {
            nock('http://localhost:4000')
                .get('/health')
                .reply(
                    200,
                    {'pcq-backend': {'status': 'DOWN'}}
                );
            const rewiredApp = rewire('../../../app');
            rewiredApp.__set__('config.services.pcqBackend.enabled', 'false');
            const server = rewiredApp.init();
            const agent = request.agent(server.app);
            agent.get('/service-endpoint?serviceId=PROBATE&actor=APPLICANT&pcqId=12&ccdCaseId=12&partyId=12&returnUrl=test')
                .expect(302)
                .end((err, res) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    expect(res.redirect).to.equal(true);
                    expect(res.header.location).to.equal('/start-page');
                    done();
                });
        });
    });
});