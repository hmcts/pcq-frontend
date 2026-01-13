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

    describe('getStore (stubbed)', () => {
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
    });

});
