'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const config = require('config');
const registerIncomingService = require('app/middleware/registerIncomingService');

describe('registerIncomingService', () => {
    it('should assign valid incoming query params to the session and redirect to the start page', (done) => {
        const req = {
            query: {
                serviceId: 'PROBATE',
                actor: 'APPLICANT',
                pcqId: '78e69022-2468-4370-a88e-bea2a80fa51f',
                ccdCaseId: 1234567890123456,
                partyId: 'applicant@email.com',
                returnUrl: 'invoking-service-return-url/',
                language: 'en',
                channel: 2
            },
            session: {
                form: {}
            }
        };
        const res = {
            redirect: sinon.spy()
        };

        registerIncomingService(req, res);

        expect(req.session).to.deep.equal({
            returnUrl: 'https://invoking-service-return-url/',
            language: 'en',
            form: {
                serviceId: 'probate',
                actor: 'applicant',
                pcqId: '78e69022-2468-4370-a88e-bea2a80fa51f',
                ccdCaseId: 1234567890123456,
                partyId: 'applicant@email.com',
                channel: 2
            },
            token: req.session.token,
            validParameters: true
        });
        expect(res.redirect.calledOnce).to.equal(true);
        expect(res.redirect.calledWith('/start-page')).to.equal(true);

        done();
    });

    it('should assign default params to the session when none passed and redirect to the start page', (done) => {
        const req = {
            query: {},
            session: {
                form: {}
            }
        };
        const res = {
            redirect: sinon.spy()
        };

        registerIncomingService(req, res);

        expect(req.session).to.deep.equal({
            form: {
                channel: 1
            }
        });
        expect(res.redirect.calledOnce).to.equal(true);
        expect(res.redirect.calledWith('/start-page')).to.equal(true);

        done();
    });

    it('should assign a valid JWT token to the session', (done) => {
        const req = {
            query: {
                serviceId: 'PROBATE',
                actor: 'APPLICANT',
                pcqId: '78e69022-2468-4370-a88e-bea2a80fa51f',
                partyId: 'applicant@email.com',
                returnUrl: 'invoking-service-return-url/'
            },
            session: {
                form: {}
            }
        };
        const res = {
            redirect: sinon.spy()
        };

        registerIncomingService(req, res);

        const validToken = jwt.verify(req.session.token, config.auth.jwt.secret, (err) => {
            return !err;
        });

        expect(validToken).to.equal(true);

        done();
    });

    it('should not create a token or validate the service if its not registered', (done) => {
        const req = {
            query: {
                serviceId: 'NOTREGISTERED',
                actor: 'APPLICANT',
                pcqId: '78e69022-2468-4370-a88e-bea2a80fa51f',
                partyId: 'applicant@email.com',
                returnUrl: 'http://invoking-service-return-url/'
            },
            session: {
                form: {}
            }
        };
        const res = {
            redirect: sinon.spy()
        };

        registerIncomingService(req, res);

        expect(req.session).to.not.have.property('token');
        expect(req.session).to.not.have.property('validParameters');

        done();
    });
});
