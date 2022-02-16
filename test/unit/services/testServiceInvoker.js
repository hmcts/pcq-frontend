'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const config = require('config');
const app = require('app');
const nock = require('nock');
const rewire = require('rewire');
const request = require('supertest');
const serviceInvokerData = require('test/unit/services/testServiceInvokerData.json');
const {setSession, registerIncomingService} = require('app/middleware/registerIncomingService');
const invoker = rewire('app/middleware/invoker');

//requiring path and fs modules
const path = require('path');
const fs = require('fs');
//joining path of directory
const directoryPath = path.join(`${__dirname}/../../../app`, 'journeys');

//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        // your tests logic
        console.log(file);
        const filePathFragments = file.split('.');
        const serviceName = filePathFragments[0];
        if (filePathFragments[1] === 'js' && serviceName !== 'default') {
            describe('Invoking Service : ' + serviceName, () => {
                const datas = serviceInvokerData.services[serviceName].datas;
                for (const data in datas) {
                    const formData = serviceInvokerData.services[serviceName].datas[data].formData;
                    describe('Valid Params : '+ data, () => {
                        it('should assign valid incoming query params to the session', () => {
                            const genToken = invoker.__get__('genToken');
                            const req = {
                                query: {
                                    serviceId: formData.serviceId,
                                    actor: formData.actor,
                                    pcqId: formData.pcqId,
                                    ccdCaseId: formData.ccdCaseId,
                                    partyId: formData.partyId,
                                    returnUrl: formData.returnUrl,
                                    language: formData.language,
                                    channel: formData.channel
                                },
                                session: {
                                    form: {}
                                }
                            };
                            const res = {
                                json: sinon.spy()
                            };

                            genToken(req, res);
                            const generatedToken = res.json.args[0][0].token;
                            req.query.token = generatedToken;

                            setSession(req);
                            registerIncomingService(req);

                            expect(req.session).to.deep.equal({
                                returnUrl: 'https://'+formData.returnUrl,
                                language: formData.language,
                                form: {
                                    serviceId: formData.serviceId.toLowerCase(),
                                    actor: formData.actor.toLowerCase(),
                                    pcqId: formData.pcqId,
                                    ccdCaseId: formData.ccdCaseId,
                                    partyId: formData.partyId,
                                    channel: formData.channel
                                },
                                token: req.session.token,
                                validParameters: true
                            });
                        });
                    });

                    describe('Route : '+ data, () => {
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
                            const url = '/service-endpoint?serviceId='+formData.serviceId+'&actor='+formData.actor+'&pcqId='+formData.pcqId+'&ccdCaseId='+formData.ccdCaseId+
                            '&partyId='+formData.partyId+'&returnUrl'+formData.returnUrl;
                            agent.get(`${url}`)
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
                        it('should redirect to /offline if the serviceId is not sent', (done) => {
                            nock('http://localhost:4000')
                                .get('/health')
                                .reply(
                                    200,
                                    {'pcq-backend': {'status': 'UP'}}
                                );
                            const server = app.init();
                            const agent = request.agent(server.app);
                            const url = '/service-endpoint?actor='+formData.actor+'&pcqId='+formData.pcqId+'&ccdCaseId='+formData.ccdCaseId+
                            '&partyId='+formData.partyId+'&returnUrl'+formData.returnUrl;
                            agent.get(`${url}`).redirects(1)
                                .expect(302)
                                .end((err, res) => {
                                    server.http.close();
                                    if (err) {
                                        throw err;
                                    }
                                    //res.redirect()
                                    expect(res.redirect).to.equal(true);
                                    expect(res.header.location).to.equal('/offline');
                                    done();
                                });
                        });
                        it('should redirect to /offline if the redirectURL is not sent', (done) => {
                            nock('http://localhost:4000')
                                .get('/health')
                                .reply(
                                    200,
                                    {'pcq-backend': {'status': 'UP'}}
                                );
                            const server = app.init();
                            const agent = request.agent(server.app);
                            const url = '/service-endpoint?serviceId='+formData.serviceId+'&actor='+formData.actor+'&pcqId='+formData.pcqId+'&ccdCaseId='+formData.ccdCaseId+
                            '&partyId='+formData.partyId;
                            agent.get(`${url}`).redirects(1)
                                .expect(302)
                                .end((err, res) => {
                                    server.http.close();
                                    if (err) {
                                        throw err;
                                    }
                                    //res.redirect()
                                    expect(res.redirect).to.equal(true);
                                    expect(res.header.location).to.equal('/offline');
                                    /*To Do checkRedirect Link is there on offline page*/
                                    //expect(res).to.deep.contains(formData.redirect);
                                    done();
                                });
                            });
                    });
                }
            });
        }
    });
});
