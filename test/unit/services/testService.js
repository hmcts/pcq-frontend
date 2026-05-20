'use strict';

const expect = require('chai').expect;
const Proxyquire = require('proxyquire/lib/proxyquire');
const proxyquire = new Proxyquire(module).noCallThru();
const Service = require('app/services/Service');
const HttpsProxyAgent = require('https-proxy-agent');
const sinon = require('sinon');

const buildServiceClass = (overrides = {}) => {
    return proxyquire('app/services/Service', overrides);
};

describe('Service', () => {
    describe('get()', () => {
        it('should throw a reference error', (done) => {
            const service = new Service();
            expect(service.get).to.throw(ReferenceError, 'get() must be overridden when extending Service');
            done();
        });
    });

    describe('post()', () => {
        it('should throw a reference error', (done) => {
            const service = new Service();
            expect(service.post).to.throw(ReferenceError, 'post() must be overridden when extending Service');
            done();
        });
    });

    describe('patch()', () => {
        it('should throw a reference error', (done) => {
            const service = new Service();
            expect(service.patch).to.throw(ReferenceError, 'patch() must be overridden when extending Service');
            done();
        });
    });

    describe('delete()', () => {
        it('should throw a reference error', (done) => {
            const service = new Service();
            expect(service.delete).to.throw(ReferenceError, 'delete() must be overridden when extending Service');
            done();
        });
    });

    describe('log()', () => {
        it('should log a message without a sessionId', (done) => {
            const loggerFactory = sinon.stub().returns({
                info: () => true
            });
            const ServiceWithLogger = buildServiceClass({'app/components/logger': loggerFactory});
            const service = new ServiceWithLogger();
            service.log();
            expect(loggerFactory.calledOnce).to.equal(true);
            expect(loggerFactory.calledWith('Init')).to.equal(true);
            done();
        });

        it('should log a message with a sessionId', (done) => {
            const sessionId = 'sid123';
            const loggerFactory = sinon.stub().returns({
                info: () => true
            });
            const ServiceWithLogger = buildServiceClass({'app/components/logger': loggerFactory});
            const service = new ServiceWithLogger();
            service.sessionId = sessionId;
            service.log();
            expect(loggerFactory.calledOnce).to.equal(true);
            expect(loggerFactory.calledWith(sessionId)).to.equal(true);
            done();
        });
    });

    describe('replacePlaceholderInPath()', () => {
        it('should replace the placeholder with a value', (done) => {
            const path = '/forms/{emailAddress}';
            const email = 'fred@example.com';
            const service = new Service();
            const newPath = service.replacePlaceholderInPath(path, 'emailAddress', email);
            expect(newPath).to.equal('/forms/fred@example.com');
            done();
        });
    });

    describe('fetchJson()', () => {
        it('should return a json response', (done) => {
            const ServiceWithAsyncFetch = buildServiceClass({
                'app/utils/AsyncFetch': class {
                    fetch() {
                        return Promise.resolve({result: 'something'});
                    }
                }
            });
            const service = new ServiceWithAsyncFetch();
            service
                .fetchJson('http://localhost/forms', {})
                .then((res) => {
                    expect(res).to.deep.equal({result: 'something'});
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });
    });

    describe('fetchText()', () => {
        it('should return a text response', (done) => {
            const ServiceWithAsyncFetch = buildServiceClass({
                'app/utils/AsyncFetch': class {
                    fetch() {
                        return Promise.resolve('something');
                    }
                }
            });
            const service = new ServiceWithAsyncFetch();
            service
                .fetchText('http://localhost/forms', {})
                .then((res) => {
                    expect(res).to.equal('something');
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });
    });

    describe('fetchBuffer()', () => {
        it('should return a buffer response', (done) => {
            const buffer = new Buffer('really interesting file contents');
            const ServiceWithAsyncFetch = buildServiceClass({
                'app/utils/AsyncFetch': class {
                    fetch() {
                        return Promise.resolve(buffer);
                    }
                }
            });
            const service = new ServiceWithAsyncFetch();
            service
                .fetchBuffer('http://localhost/forms', {})
                .then((res) => {
                    expect(res).to.equal(buffer);
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });

        it('should throw an error', (done) => {
            const service = new Service();

            service.log = sinon.spy();

            service
                .fetchBuffer('http://localhost/forms', {})
                .catch((err) => {
                    expect(service.log.calledOnce).to.equal(true);
                    expect(err.message).to.contain('fetch failed');
                    done();
                });
        });
    });

    describe('fetchOptions()', () => {
        it('should return the fetch options', (done) => {
            const data = {
                fullName: 'Fred Miller'
            };
            const method = 'POST';
            const headers = {
                'Content-Type': 'application/json'
            };
            const proxy = 'http://localhost';
            const service = new Service();
            const options = service.fetchOptions(data, method, headers, proxy);
            expect(options).to.deep.equal({
                method: 'POST',
                mode: 'cors',
                redirect: 'follow',
                follow: 10,
                timeout: 10000,
                body: JSON.stringify(data),
                headers: new Headers(headers),
                agent: new HttpsProxyAgent(proxy)
            });
            done();
        });

        it('should return the agent set to null if a proxy is not given', (done) => {
            const service = new Service();
            const options = service.fetchOptions();
            expect(options.agent).to.equal(null);
            done();
        });
    });

    describe('formatErrorMessage()', () => {
        it('should return an error string', (done) => {
            const service = new Service();
            const error = service.formatErrorMessage(new Error('Error: Not Found'));
            expect(error).to.equal('Error: Error: Not Found');
            done();
        });
    });
});
