'use strict';

const expect = require('chai').expect;
const utils = require('app/components/utils');
const sinon = require('sinon');

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
            expect(res.redirect.args[0][1]).to.equal('https://localhost/test');
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
    });

    describe('getStore', () => {
        it('creates a valid RedisStore', () => {
            const redisConfig = {
                enabled: 'true',
                password: 'secure',
                useTLS: 'true',
                host: 'localhost',
                port: '6379'
            };
            const redisStore = utils.getStore(redisConfig);
            const redisStoreName = redisStore.constructor.name;

            // End and destroy before expect in case of error. These will hang the tests if not run.
            redisStore.destroy();

            expect(redisStoreName).to.equal('RedisStore');
        });

        it('creates a valid MemoryStore', () => {
            const redisConfig = {
                enabled: 'false'
            };
            const memoryStore = utils.getStore(redisConfig);
            expect(memoryStore.constructor.name).to.equal('MemoryStore');
        });
    });

});
