'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const session = require('express-session');
const Module = require('module');

const utils = require('app/components/utils');

describe('api-utils', () => {

    describe('forceHttps', () => {
        it('redirects to https site on http call', () => {
            const req = {
                headers: {'x-forwarded-proto': 'http'},
                url: '/test',
                get: () => 'localhost'
            };
            const res = {redirect: sinon.spy()};
            const next = sinon.spy();

            utils.forceHttps(req, res, next);

            expect(res.redirect.calledOnce).to.equal(true);
            expect(res.redirect.args[0][1].href).to.equal('https://localhost/test');
            expect(next.notCalled).to.equal(true);
        });

        it('calls next if req is https already', () => {
            const req = {
                headers: {'x-forwarded-proto': 'https'},
                url: '/test',
                get: () => 'localhost'
            };
            const res = {redirect: sinon.spy()};
            const next = sinon.spy();

            utils.forceHttps(req, res, next);

            expect(next.calledOnce).to.equal(true);
            expect(res.redirect.notCalled).to.equal(true);
        });

        it('redirects to offline if url not valid', () => {
            const req = {
                headers: {'x-forwarded-proto': 'http'},
                url: '[/]test',
                get: () => 'localhost'
            };
            const res = {redirect: sinon.spy()};
            const next = sinon.spy();

            utils.forceHttps(req, res, next);

            expect(res.redirect.calledOnce).to.equal(true);
            expect(res.redirect.args[0][1].href).to.equal('https://localhost/offline');
            expect(next.notCalled).to.equal(true);
        });
    });

    describe('getStore', () => {
        let originalIoredis;
        let ioredisPath;

        const createFakeRedisModule = () => {
            function FakeRedis() {
                this._handlers = {};
            }
            FakeRedis.prototype.on = function(event, handler) {
                this._handlers[event] = handler;
                if (event === 'ready') {
                    process.nextTick(handler);
                }
            };
            FakeRedis.prototype.ping = function() {};
            FakeRedis.prototype.end = function() {
                if (this._handlers.end) {
                    this._handlers.end();
                }
            };
            FakeRedis.prototype.quit = FakeRedis.prototype.end;
            FakeRedis.prototype.disconnect = FakeRedis.prototype.end;

            const fakeModule = new Module(ioredisPath);
            fakeModule.exports = FakeRedis;
            fakeModule.loaded = true;
            return fakeModule;
        };

        beforeEach(() => {
            ioredisPath = require.resolve('ioredis');
            originalIoredis = require.cache[ioredisPath];
            require.cache[ioredisPath] = createFakeRedisModule();
        });

        afterEach(() => {
            if (originalIoredis) {
                require.cache[ioredisPath] = originalIoredis;
            } else {
                delete require.cache[ioredisPath];
            }
        });

        it('creates a valid RedisStore', () => {
            const redisConfig = {
                enabled: 'true',
                password: 'secure',
                useTLS: 'true',
                host: 'localhost',
                port: '6379',
                keepAlive: 'false'
            };
            const redisStore = utils.getStore(redisConfig, session);
            const redisStoreName = redisStore.constructor.name;

            // End and destroy before expect in case of error. These will hang the tests if not run.
            if (redisStore.client) {
                if (typeof redisStore.client.end === 'function') {
                    redisStore.client.end();
                } else if (typeof redisStore.client.quit === 'function') {
                    redisStore.client.quit();
                } else if (typeof redisStore.client.disconnect === 'function') {
                    redisStore.client.disconnect();
                }
            }
            redisStore.destroy();

            expect(redisStoreName).to.equal('RedisStore');
        });

        it('creates a valid MemoryStore', () => {
            const redisConfig = {
                enabled: 'false'
            };
            const memoryStore = utils.getStore(redisConfig, session);
            expect(memoryStore.constructor.name).to.equal('MemoryStore');
        });
    });

});
