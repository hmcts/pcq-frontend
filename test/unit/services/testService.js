import chai from 'chai';
import sinon from 'sinon';
import Service from '../../../app/services/Service.js';

const { expect } = chai;

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
            const loggerInfo = sinon.stub();
            const logger = sinon.stub().returns({info: loggerInfo});
            const service = new Service(undefined, undefined, {logger});
            service.log();
            expect(logger.calledOnce).to.equal(true);
            expect(logger.calledWith('Init')).to.equal(true);
            expect(loggerInfo.calledOnce).to.equal(true);
            done();
        });

        it('should log a message with a sessionId', (done) => {
            const sessionId = 'sid123';
            const loggerInfo = sinon.stub();
            const logger = sinon.stub().returns({info: loggerInfo});
            const service = new Service(undefined, undefined, {logger});
            service.sessionId = sessionId;
            service.log();
            expect(logger.calledOnce).to.equal(true);
            expect(logger.calledWith(sessionId)).to.equal(true);
            expect(loggerInfo.calledOnce).to.equal(true);
            done();
        });

        it('should log the message at the requested level', (done) => {
            const loggerError = sinon.stub();
            const logger = sinon.stub().returns({error: loggerError});
            const service = new Service(undefined, 'sid123', {logger});
            service.log('something failed', 'error');
            expect(logger.calledWith('sid123')).to.equal(true);
            expect(loggerError.calledOnceWith('something failed')).to.equal(true);
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
            const asyncFetch = {
                fetch: (url, options, parseBody) => Promise.resolve(parseBody({json: () => ({result: 'something'})}))
            };
            const service = new Service(undefined, undefined, {asyncFetch});
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

        it('should resolve with the error when the fetch fails', async () => {
            const error = new Error('json failure');
            const asyncFetch = {fetch: sinon.stub().rejects(error)};
            const service = new Service(undefined, undefined, {asyncFetch});
            const res = await service.fetchJson('http://localhost/forms', {});
            expect(res).to.equal(error);
        });
    });

    describe('fetchText()', () => {
        it('should return a text response', (done) => {
            const asyncFetch = {
                fetch: (url, options, parseBody) => Promise.resolve(parseBody({text: () => 'something'}))
            };
            const service = new Service(undefined, undefined, {asyncFetch});
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

        it('should resolve with the error when the fetch fails', async () => {
            const error = new Error('text failure');
            const asyncFetch = {fetch: sinon.stub().rejects(error)};
            const service = new Service(undefined, undefined, {asyncFetch});
            const res = await service.fetchText('http://localhost/forms', {});
            expect(res).to.equal(error);
        });
    });

    describe('fetchBuffer()', () => {
        it('should return a buffer response', (done) => {
            const buffer = Buffer.from('really interesting file contents');
            const asyncFetch = {
                fetch: (url, options, parseBody) => Promise.resolve(parseBody({
                    arrayBuffer: () => Promise.resolve(buffer)
                }))
            };
            const service = new Service(undefined, undefined, {asyncFetch});
            service
                .fetchBuffer('http://localhost/forms', {})
                .then((res) => {
                    expect(res.equals(buffer)).to.equal(true);
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

        it('should log the formatted error and rethrow when the fetch fails', async () => {
            const asyncFetch = {fetch: sinon.stub().rejects(new Error('buffer failure'))};
            const service = new Service(undefined, undefined, {asyncFetch});
            service.log = sinon.spy();
            let caught;
            try {
                await service.fetchBuffer('http://localhost/forms', {});
            } catch (err) {
                caught = err;
            }
            expect(caught).to.be.instanceOf(Error);
            expect(caught.message).to.contain('buffer failure');
            expect(service.log.calledOnce).to.equal(true);
            expect(service.log.firstCall.args[0]).to.contain('Fetch buffer error: Error: buffer failure');
            expect(service.log.firstCall.args[1]).to.equal('error');
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

    describe('fetchOptions() defaults', () => {
        it('should default to empty headers when none are provided', () => {
            const service = new Service();
            const options = service.fetchOptions({a: 1}, 'GET');
            expect(options.method).to.equal('GET');
            expect(options.body).to.equal(JSON.stringify({a: 1}));
            expect(Array.from(options.headers.keys())).to.have.lengthOf(0);
        });

        it('should serialise undefined data to an undefined body', () => {
            const service = new Service();
            const options = service.fetchOptions(undefined, 'GET', {});
            expect(options.body).to.equal(undefined);
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
