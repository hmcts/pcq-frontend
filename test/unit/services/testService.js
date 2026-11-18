import chai from 'chai';
import nock from 'nock';
import Service from 'app/services/Service.js';
import sinon from 'sinon';
import winston from 'winston';

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
            const service = new Service();
            service.log = sinon.spy();
            service.log();
            expect(service.log.calledOnce).to.equal(true);
            done();
        });

        it('should pass the sessionId to the logger', (done) => {
            const sessionId = 'sid123';
            const service = new Service();
            service.sessionId = sessionId;
            const childSpy = sinon.spy(winston.Logger.prototype, 'child');

            try {
                service.log('test message');
                expect(childSpy.firstCall.args[0].sessionId).to.equal('sid123');
            } finally {
                childSpy.restore();
            }
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
        it('should return a json response', () => {
            const mockResponse = { id: 123, name: 'Test' };
            const service = new Service();
            const testUrl = 'http://localhost:8080';

            nock(testUrl)
                .get('/forms')
                .reply(200, mockResponse);

            return service.fetchJson(`${testUrl}/forms`, {})
                .then((result) => {
                    expect(result).to.deep.equal(mockResponse);
                });
        });
    });

    describe('fetchText()', () => {
        it('should return a text response', () => {
            const mockText = 'Hello World';
            const service = new Service();
            const testUrl = 'http://localhost:8080';

            nock(testUrl)
                .get('/forms')
                .reply(200, mockText);

            return service.fetchText(`${testUrl}/forms`, {})
                .then((result) => {
                    expect(result).to.equal(mockText);
                });
        });
    });

    describe('fetchBuffer()', () => {
        it('should return a buffer response', () => {
            const expectedBuffer = Buffer.from('test data');
            const service = new Service();
            const testUrl = 'http://localhost:8080';

            nock(testUrl)
                .get('/forms')
                .reply(200, expectedBuffer);

            return service.fetchBuffer(`${testUrl}/forms`, {})
                .then((result) => {
                    expect(result).to.be.instanceof(Buffer);
                    expect(result).to.deep.equal(expectedBuffer);
                });
        });

        it('should log and throw when the request fails', () => {
            const service = new Service();
            const testUrl = 'http://localhost:8080';
            sinon.stub(service, 'log');

            nock(testUrl)
                .get('/forms')
                .reply(500, 'Internal Server Error');

            return service.fetchBuffer(`${testUrl}/forms`, {})
                .then(() => {
                    throw new Error('Expected fetchBuffer to reject');
                }, (error) => {
                    expect(error).to.be.instanceOf(Error);
                    expect(error.message).to.equal('Error: Internal Server Error');
                    expect(service.log.calledOnce).to.equal(true);
                    expect(service.log.firstCall.args).to.deep.equal([
                        'Fetch buffer error: Error: Internal Server Error',
                        'error'
                    ]);
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