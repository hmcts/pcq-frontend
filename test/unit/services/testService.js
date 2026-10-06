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
            const asyncFetch = {fetch: sinon.stub().resolves({result: 'something'})};
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
    });

    describe('fetchText()', () => {
        it('should return a text response', (done) => {
            const asyncFetch = {fetch: sinon.stub().resolves('something')};
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
    });

    describe('fetchBuffer()', () => {
        it('should return a buffer response', (done) => {
            const buffer = Buffer.from('really interesting file contents');
            const asyncFetch = {fetch: sinon.stub().resolves(buffer)};
            const service = new Service(undefined, undefined, {asyncFetch});
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
