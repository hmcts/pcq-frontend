'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');
const Service = rewire('app/services/Service');
const sinon = require('sinon');

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
        let revert;

        beforeEach(() => {
            revert = Service.__set__('logger', sinon.stub().returns({
                info: () => true
            }));
        });

        afterEach(() => {
            revert();
        });

        it('should log a message without a sessionId', (done) => {
            const service = new Service();
            service.log();
            expect(Service.__get__('logger').calledOnce).to.equal(true);
            expect(Service.__get__('logger').calledWith('Init')).to.equal(true);
            revert();
            done();
        });

        it('should log a message with a sessionId', (done) => {
            const sessionId = 'sid123';
            const service = new Service();
            service.sessionId = sessionId;
            service.log();
            expect(Service.__get__('logger').calledOnce).to.equal(true);
            expect(Service.__get__('logger').calledWith(sessionId)).to.equal(true);
            revert();
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
            const revert = Service.__set__('asyncFetch', class {
                static fetch() {
                    return Promise.resolve({result: 'something'});
                }
            });
            const service = new Service();
            service
                .fetchJson('http://localhost/forms', {})
                .then((res) => {
                    expect(res).to.deep.equal({result: 'something'});
                    revert();
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });
    });

    describe('fetchText()', () => {
        it('should return a text response', (done) => {
            const revert = Service.__set__('asyncFetch', class {
                static fetch() {
                    return Promise.resolve('something');
                }
            });
            const service = new Service();
            service
                .fetchText('http://localhost/forms', {})
                .then((res) => {
                    expect(res).to.equal('something');
                    revert();
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
            const revert = Service.__set__('asyncFetch', class {
                static fetch() {
                    return Promise.resolve(buffer);
                }
            });
            const service = new Service();
            service
                .fetchBuffer('http://localhost/forms', {})
                .then((res) => {
                    expect(res).to.equal(buffer);
                    revert();
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
            const service = new Service();
            const options = service.fetchOptions(data, method, headers);
            expect(options.method).to.equal('POST');
            expect(options.mode).to.equal('cors');
            expect(options.redirect).to.equal('follow');
            expect(options.follow).to.equal(10);
            expect(options.timeout).to.equal(10000);
            expect(options.body).to.equal(JSON.stringify(data));
            expect(options.headers.get('Content-Type')).to.equal('application/json');
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
