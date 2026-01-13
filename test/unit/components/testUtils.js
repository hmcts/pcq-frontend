'use strict';

const expect = require('chai').expect;
const utils = require('app/components/utils');
const sinon = require('sinon');
const session = require('express-session');

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

    /*describe('getStore (stubbed)', () => {
        let RedisStub;

        beforeEach(() => {
            // Stub ioredis constructor BEFORE calling getStore
            RedisStub = sinon.stub(require('ioredis').prototype, 'connect').resolves();
        });

        afterEach(() => {
            sinon.restore();
        });

        it('creates a valid RedisStore', () => {
            const redisConfig = {
                enabled: 'true',
                host: 'localhost',
                port: '6379',
                useTLS: 'false',
                keepAlive: 'false'
            };

            const redisStore = utils.getStore(redisConfig, session);

            expect(redisStore.constructor.name).to.equal('RedisStore');
        });

        it('creates a valid MemoryStore', () => {
            const redisConfig = { enabled: 'false' };
            const memoryStore = utils.getStore(redisConfig, session);
            expect(memoryStore.constructor.name).to.equal('MemoryStore');
        });
    });*/


    describe('getStore', () => {
        let redisClientStub;
        let RedisClientFactoryStub;
        let RedisStoreStub;
        let setIntervalStub;
        let clearIntervalStub;

        beforeEach(() => {
            redisClientStub = {
                on: sinon.stub(),
                ping: sinon.stub().resolves()
            };

            RedisClientFactoryStub = sinon.stub().returns(redisClientStub);

            RedisStoreStub = function RedisStoreStub() {};

            setIntervalStub = sinon.stub(global, 'setInterval').returns(1);
            clearIntervalStub = sinon.stub(global, 'clearInterval');
        });

        afterEach(() => {
            sinon.restore();
        });

        it('creates RedisStore when redis is enabled', () => {
            const redisConfig = {
                enabled: 'true',
                host: 'localhost',
                port: '6379',
                keepAlive: 'false'
            };

            const store = utils.getStore(redisConfig, null, {
                Redis: RedisClientFactoryStub,
                connectRedis: { default: RedisStoreStub }
            });

            expect(store).to.be.instanceOf(RedisStoreStub);
        });

        it('starts keepAlive when enabled', () => {
            const redisConfig = {
                enabled: 'true',
                keepAlive: 'true',
                host: 'localhost',
                port: '6379'
            };

            utils.getStore(redisConfig, null, {
                Redis: RedisClientFactoryStub,
                connectRedis: { default: RedisStoreStub }
            });

            const readyHandler = redisClientStub.on
                .withArgs('ready')
                .getCall(0).args[1];

            readyHandler();

            expect(setIntervalStub.calledOnce).to.be.true;
        });

        it('clears keepAlive on client end', () => {
            const redisConfig = {
                enabled: 'true',
                keepAlive: 'true',
                host: 'localhost',
                port: '6379'
            };

            utils.getStore(redisConfig, null, {
                Redis: RedisClientFactoryStub,
                connectRedis: { default: RedisStoreStub }
            });

            const readyHandler = redisClientStub.on
                .withArgs('ready')
                .getCall(0).args[1];

            readyHandler();

            const endHandler = redisClientStub.on
                .withArgs('end')
                .getCall(0).args[1];

            endHandler();

            expect(clearIntervalStub.calledOnce).to.be.true;
        });

        it('sets password and tls options when TLS is enabled', () => {
            const redisConfig = {
                enabled: 'true',
                useTLS: 'true',
                keepAlive: 'false',
                host: 'localhost',
                port: '6379',
                password: 'secret'
            };

            utils.getStore(redisConfig, null, {
                Redis: RedisClientFactoryStub,
                connectRedis: { default: RedisStoreStub }
            });

            // Assert constructor was called
            sinon.assert.calledOnce(RedisClientFactoryStub);

            const redisOptionsPassed =
                RedisClientFactoryStub.getCall(0).args[0];

            expect(redisOptionsPassed).to.deep.include({
                host: 'localhost',
                port: '6379',
                password: 'secret'
            });

            expect(redisOptionsPassed.tls).to.deep.equal({});
        });


        it('does not set password or tls when TLS is disabled', () => {
            const redisConfig = {
                enabled: 'true',
                useTLS: 'false',
                keepAlive: 'false',
                host: 'localhost',
                port: '6379'
            };

            utils.getStore(redisConfig, null, {
                Redis: RedisClientFactoryStub,
                connectRedis: { default: RedisStoreStub }
            });

            const redisOptionsPassed =
                RedisClientFactoryStub.getCall(0).args[0];

            expect(redisOptionsPassed.password).to.be.undefined;
            expect(redisOptionsPassed.tls).to.be.undefined;
        });

    });

});
