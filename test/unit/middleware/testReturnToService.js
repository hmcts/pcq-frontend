'use strict';

const expect = require('chai').expect;
const nock = require('nock');
const sinon = require('sinon');
const returnToService = require('app/middleware/returnToService');

describe('returnToService', () => {
    let req = {};
    let res = {};

    describe('redirect', () => {

        beforeEach(() => {
            req = {
                session: {
                    form: {
                        serviceId: 'test'
                    }
                }
            };
            res = {redirect: sinon.spy()};
        });

        it('should redirect to the given return URL', () => {
            nock('http://localhost:4550')
                .get('/return-to-service')
                .reply(
                    200,
                    {status: ':thumbs_up:'}
                );

            req.session.returnUrl = 'http://test.com';
            returnToService(req,res);

            expect(res.redirect.calledOnce).to.equal(true);
            expect(res.redirect.args[0][0].href).to.equal('http://test.com/');
            nock.cleanAll();
            
        });

        it('should redirect to offline if URL not valid', () => {
            nock('http://localhost:4550')
                .get('/return-to-service')
                .reply(
                    200,
                    {status: ':thumbs_up:'}
                );

            req.session.returnUrl = 'http:/[/]test.com';
            req.log = sinon.spy();
            req.log.error = sinon.spy();

            returnToService(req, res);
            expect(res.redirect.calledOnce).to.equal(true);
            expect(res.redirect.args[0][0]).to.equal('/offline');
            nock.cleanAll();
        });
    });
});