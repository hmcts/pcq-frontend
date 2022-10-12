'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');
const {verifyToken} = require('app/components/encryption-token');

describe('VerifyToken', () => {
    it('should fail verification if token is missing from req query', (done) => {
        const reqQuery = {
            serviceId: 'PROBATE',
            actor: 'APPLICANT',
            pcqId: '12345',
            partyId: 'test@test.com',
            returnUrl: 'test.com'
        };

        expect(verifyToken(reqQuery)).to.equal(false);
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

        expect(verifyToken(reqQuery)).to.equal(false);
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

        expect(verifyToken(reqQuery)).to.equal(false);
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

        expect(verifyToken(reqQuery)).to.equal(false);
        done();
    });

    it('should successfully verify a valid req query with a matching token', (done) => {
        const verifyTokenRewired = rewire('app/components/encryption-token');
        verifyTokenRewired.__set__('config', {
            tokenKeys: {
                registered: 'REGISTERED_TOKEN_KEY'
            }
        });

        const reqQuery = {
            serviceId: 'REGISTERED',
            actor: 'APPLICANT',
            pcqId: '12345',
            partyId: 'test@test.com',
            returnUrl: 'test.com',
            token: '4ab384df14b77f245d02b33f2f5176ec08d372ab18100688f9c62560b2f5aa17ffc1870b7eef5d4b67413eeff1999f2' +
                'fb5953843b3b284329cbfd54cd7713fdf94f5cad773fd5f751bc28957898152917b15b81b70e217e531174a256a86a' +
                'ae5c04287db6139fdb172ce78ac3af8d8'
        };

        expect(verifyTokenRewired.verifyToken(reqQuery)).to.equal(true);
        done();
    });

    it('should successfully verify a valid req query with a matching token using legacy encryption', (done) => {
        const verifyTokenRewired = rewire('app/components/encryption-token');
        verifyTokenRewired.__set__('config', {
            tokenKeys: {
                registered: 'REGISTERED_TOKEN_KEY'
            }
        });

        const reqQuery = {
            serviceId: 'REGISTERED',
            actor: 'APPLICANT',
            pcqId: '12345',
            partyId: 'test@test.com',
            returnUrl: 'test.com',
            token: '05ae10bf33f9b7dbc1f5e5e3636565ed974cf7e1ed14315dbd2890d6884a70d0a51c9042769cf1804052fb367d5a8db' +
                '7d1214e43fad2d70eba7bf9ccb3780db76471bdfcc20c3840efde9f4d325a5f6fb02075357b7e7bafae2517426a126d004' +
                '1a5e3ecd000d74a5baa2967b0c958de'
        };

        expect(verifyTokenRewired.verifyToken(reqQuery)).to.equal(true);
        done();
    });
});
