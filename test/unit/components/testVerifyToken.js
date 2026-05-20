'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const Proxyquire = require('proxyquire/lib/proxyquire');
const proxyquire = new Proxyquire(module).callThru();
const config = require('config');
const tokenModule = require('app/components/encryption-token');

const buildParams = (serviceId = 'PROBATE', returnUrl = 'test.com') => ({
    serviceId,
    actor: 'APPLICANT',
    pcqId: '12345',
    partyId: 'test@test.com',
    returnUrl
});

const buildTokenModuleWithKey = (tokenKey = 'REGISTERED_TOKEN_KEY') => {
    const loggerStub = {info: sinon.spy(), error: sinon.spy(), warn: sinon.spy()};
    return proxyquire('app/components/encryption-token', {
        config: {
            ...config,
            tokenKeys: {
                ...config.tokenKeys,
                registered: tokenKey
            },
            get: config.get
        },
        'app/components/logger': () => loggerStub
    });
};

describe('VerifyToken', () => {
    it('should fail verification if token is missing from req query', (done) => {
        const reqQuery = buildParams();

        expect(tokenModule.verifyToken(reqQuery)).to.equal(false);
        done();
    });

    it('should fail verification if serviceId is missing from req query', (done) => {
        const reqQuery = {
            actor: 'APPLICANT',
            pcqId: '12345',
            partyId: 'test@test.com',
            returnUrl: 'test.com',
            token: 'token'
        };

        expect(tokenModule.verifyToken(reqQuery)).to.equal(false);
        done();
    });

    it('should fail verification if there is no token key for the service', (done) => {
        const reqQuery = {
            serviceId: 'NO_TOKEN_KEY',
            actor: 'APPLICANT',
            pcqId: '12345',
            partyId: 'test@test.com',
            returnUrl: 'test.com',
            token: 'token'
        };

        expect(tokenModule.verifyToken(reqQuery)).to.equal(false);
        done();
    });

    it('should fail verification on mismatched tokens', (done) => {
        const reqQuery = {
            serviceId: 'PROBATE',
            actor: 'APPLICANT',
            pcqId: '12345',
            partyId: 'test@test.com',
            returnUrl: 'test.com',
            token: 'mismatched_token'
        };

        expect(tokenModule.verifyToken(reqQuery)).to.equal(false);
        done();
    });

    it('should successfully verify a valid req query with a matching token', (done) => {
        const params = buildParams('REGISTERED');
        const moduleWithKnownKey = buildTokenModuleWithKey();
        const reqQuery = {
            ...params,
            token: '4ab384df14b77f245d02b33f2f5176ec08d372ab18100688f9c62560b2f5aa17ffc1870b7eef5d4b67413eeff1999f2' +
                'fb5953843b3b284329cbfd54cd7713fdf94f5cad773fd5f751bc28957898152917b15b81b70e217e531174a256a86a' +
                'ae5c04287db6139fdb172ce78ac3af8d8'
        };

        expect(moduleWithKnownKey.verifyToken(reqQuery)).to.equal(true);
        done();
    });

    it('should successfully verify a valid req query with a matching token using legacy encryption', (done) => {
        const params = buildParams('REGISTERED', 'REGISTERED_APPLICANT.test.gov.uk');
        const moduleWithKnownKey = buildTokenModuleWithKey();
        const reqQuery = {
            ...params,
            token: '05ae10bf33f9b7dbc1f5e5e3636565ed974cf7e1ed14315dbd2890d6884a70d0a51c9042769c'+
                'f1804052fb367d5a8db7d1214e43fad2d70eba7bf9ccb3780db76471bdfcc20c3840efde9f4d325'+
                'a5f6fb02075357b7e7bafae2517426a126d009cd94e49c85aae58ec6e438b4d9632cf72045d82ca12'+
                'c1e1fadb522fd3fab85e7546af19962364d34105a1329c9a60ee'
        };

        expect(moduleWithKnownKey.verifyToken(reqQuery)).to.equal(true);
        done();
    });

    it('should log auth tag when logging is enabled', () => {
        const loggerStub = {info: sinon.spy(), error: sinon.spy(), warn: sinon.spy()};
        const configStub = {
            ...config,
            tokenKeys: {
                ...config.tokenKeys,
                registered: 'REGISTERED_TOKEN_KEY'
            },
            get: sinon.stub(config, 'get').callsFake((key) => {
                if (key === 'loggingEnabled') {
                    return 'true';
                }
                return config[key];
            })
        };

        const tokenModuleWithLogging = proxyquire('app/components/encryption-token', {
            config: configStub,
            'app/components/logger': () => loggerStub
        });

        const result = tokenModuleWithLogging.generateToken(buildParams('REGISTERED'));
        configStub.get.restore();

        expect(result.authTag).to.not.equal('');
        sinon.assert.calledWith(loggerStub.info, sinon.match(/^Auth Tag : /));
    });

    it('should successfully verify a secure token using authTag, iv and salt', () => {
        const moduleWithKnownKey = buildTokenModuleWithKey();
        const params = buildParams('REGISTERED');

        const secureToken = moduleWithKnownKey.generateSecureToken(params);
        const reqQuery = {
            ...params,
            ...secureToken
        };

        expect(moduleWithKnownKey.verifyToken(reqQuery)).to.equal(true);
    });

    it('should fail verification when secure token auth tag is tampered', () => {
        const moduleWithKnownKey = buildTokenModuleWithKey();
        const params = buildParams('REGISTERED');

        const secureToken = moduleWithKnownKey.generateSecureToken(params);
        const reqQuery = {
            ...params,
            ...secureToken,
            authTag: secureToken.authTag.slice(0, -2) + 'AA'
        };

        expect(moduleWithKnownKey.verifyToken(reqQuery)).to.equal(false);
    });
});
