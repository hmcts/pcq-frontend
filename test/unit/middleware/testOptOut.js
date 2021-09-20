'use strict';

const expect = require('chai').expect;
const nock = require('nock');
const sinon = require('sinon');
const rewire = require('rewire');
const optOut = require('app/middleware/optOut');

describe('optOut', () => {
    let req = {};
    let res = {};

    describe('with answers', () => {

        beforeEach(() => {
            req = {
                session: {
                    id: 'ID',
                    token: 'TOKEN',
                    correlationId: 'CORRELATION_ID',
                    form: {
                        pcqAnswers: {
                            dob_provided: 0,
                            language_main: 1,
                            english_language_level: null
                        }
                    },
                    ctx: {
                        startpage: {},
                        dateofbirth: {dob_provided: 0},
                        language: {language_main: 1, english_language_level: null}
                    }
                }
            };
            res = {redirect: sinon.spy()};
        });

        it('should redirect to the given return URL', (done) => {
            nock('http://localhost:4550')
                .post('/pcq/backend/submitAnswers')
                .reply(
                    200,
                    {status: ':thumbs_up:'}
                );

            req.session.returnUrl = 'http://test.com';

            optOut(req, res).then(() => {
                expect(res.redirect.calledOnce).to.equal(true);
                expect(res.redirect.args[0][0]).to.equal('http://test.com');
                nock.cleanAll();
                done();
            });
        });

        it('should redirect to the given return URL when backend is down', (done) => {
            nock('http://localhost:4550')
                .post('/pcq/backend/submitAnswers')
                .reply(
                    500
                );

            req.session.returnUrl = 'http://test.com';

            optOut(req, res).then(() => {
                expect(res.redirect.calledOnce).to.equal(true);
                expect(res.redirect.args[0][0]).to.equal('http://test.com');
                nock.cleanAll();
                done();
            });
        });

        it('should set the optOut flag and retain the session', (done) => {
            nock('http://localhost:4550')
                .post('/pcq/backend/submitAnswers', body => {
                    expect(body.optOut).to.equal('Y');
                    return body;
                })
                .reply(
                    200,
                    {status: ':thumbs_up:'}
                );

            optOut(req, res).then(() => {
                expect(req.session.form).to.have.property('optOut');
                expect(req.session.form.pcqAnswers).to.deep.equal(req.session.form.pcqAnswers);
                expect(req.session.ctx).to.deep.equal(req.session.ctx);
                done();
            });
        });
    });

    describe('without answers', () => {

        beforeEach(() => {
            req = {
                session: {
                    id: 'ID',
                    token: 'TOKEN',
                    correlationId: 'CORRELATION_ID',
                    form: {},
                    ctx: {
                        startpage: {},
                        dateofbirth: {dob_provided: 0},
                        language: {language_main: 1, english_language_level: null}
                    }
                }
            };
            res = {redirect: sinon.spy()};
        });

        it('should redirect to the given return URL', (done) => {
            nock('http://localhost:4550')
                .post('/pcq/backend/submitAnswers')
                .reply(
                    200,
                    {status: ':thumbs_up:'}
                );

            req.session.returnUrl = 'http://test.com';

            optOut(req, res);
            expect(res.redirect.calledOnce).to.equal(true);
            expect(res.redirect.args[0][0]).to.equal('http://test.com');
            nock.cleanAll();
            done();

        });

        it('should redirect to the given return URL when backend is down', (done) => {
            nock('http://localhost:4550')
                .post('/pcq/backend/submitAnswers')
                .reply(
                    500
                );

            req.session.returnUrl = 'http://test.com';

            optOut(req, res);
            expect(res.redirect.calledOnce).to.equal(true);
            expect(res.redirect.args[0][0]).to.equal('http://test.com');
            nock.cleanAll();
            done();
        });

        it('should not call clearAnswers if there are no answers', (done) => {
            const rewiredOptOut = rewire('app/middleware/optOut');
            rewiredOptOut.__set__('clearAnswers', sinon.spy());

            optOut(req, res);
            // eslint-disable-next-line no-unused-expressions
            expect(req.session.form.pcqAnswers).to.be.undefined;
            expect(rewiredOptOut.__get__('clearAnswers').calledOnce).to.equal(false);
            done();
        });

    });
});
