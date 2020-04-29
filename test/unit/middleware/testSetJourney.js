'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const setJourney = require('app/middleware/setJourney');
const defaultJourney = require('app/journeys/default');
const probateJourney = require('app/journeys/probate');

describe('setJourney', () => {
    it('should set req.journey with the default journey when no form session', (done) => {
        const req = {
            session: {}
        };
        const res = {};
        const next = sinon.spy();

        setJourney(req, res, next);

        expect(req.session).to.deep.equal({
            journey: defaultJourney
        });
        expect(next.calledOnce).to.equal(true);

        done();
    });

    it('should set req.journey with the default journey when no service id', (done) => {
        const req = {
            session: {form: {}}
        };
        const res = {};
        const next = sinon.spy();

        setJourney(req, res, next);

        expect(req.session).to.deep.equal({
            journey: defaultJourney,
            form: {}
        });
        expect(next.calledOnce).to.equal(true);

        done();
    });

    it('should set req.journey with the probate journey when serviceId is PROBATE', (done) => {
        const req = {
            session: {
                form: {
                    serviceId: 'PROBATE'
                }
            }
        };
        const res = {};
        const next = sinon.spy();

        setJourney(req, res, next);

        expect(req.session).to.deep.equal({
            form: {
                serviceId: 'PROBATE',
            },
            journey: probateJourney
        });
        expect(next.calledOnce).to.equal(true);

        done();
    });

    it('should set req.journey with default journey when journey file not found', (done) => {
        const req = {
            session: {
                form: {
                    serviceId: 'NO_JOURNEY_FILE_FOR_ME'
                }
            }
        };
        const res = {};
        const next = sinon.spy();

        setJourney(req, res, next);

        expect(req.session).to.deep.equal({
            form: {
                serviceId: 'NO_JOURNEY_FILE_FOR_ME',
            },
            journey: defaultJourney
        });
        expect(next.calledOnce).to.equal(true);

        done();
    });
});
