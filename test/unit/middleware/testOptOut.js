'use strict';

const expect = require('chai').expect;
const nock = require('nock');
const sinon = require('sinon');
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

        it('should redirect to the given return URL', () => {
            nock('http://localhost:4550')
                .post('/pcq/backend/submitAnswers')
                .reply(
                    200,
                    {status: ':thumbs_up:'}
                );

            req.session.returnUrl = 'http://test.com';

            optOut(req, res).then(() => {
                expect(res.redirect.calledOnce).to.equal(true);
                expect(res.redirect.args[0][0].href).to.equal('http://test.com');
                nock.cleanAll();
            });
        });

        it('should redirect to offline if URL not valid', () => {
            nock('http://localhost:4550')
                .post('/pcq/backend/submitAnswers')
                .reply(
                    200,
                    {status: ':thumbs_up:'}
                );

            req.session.returnUrl = 'http:/[/]test.com';

            optOut(req, res).then(() => {
                expect(res.redirect.calledOnce).to.equal(true);
                expect(res.redirect.args[0][0].href).to.equal('/offline');
                nock.cleanAll();
            });
        });

        it('should redirect to the given return URL when backend is down', () => {
            nock('http://localhost:4550')
                .post('/pcq/backend/submitAnswers')
                .reply(
                    500
                );

            req.session.returnUrl = 'http://test.com';

            optOut(req, res).then(() => {
                expect(res.redirect.calledOnce).to.equal(true);
                expect(res.redirect.args[0][0].href).to.equal('http://test.com');
                nock.cleanAll();
            });
        });

        it('should set the optOut flag and retain the session', () => {
            const pcqAnswers = JSON.parse(JSON.stringify(req.session.form.pcqAnswers));
            const ctx = JSON.parse(JSON.stringify(req.session.ctx));

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
                expect(req.session.form.pcqAnswers).to.deep.equal(pcqAnswers);
                expect(req.session.ctx).to.deep.equal(ctx);
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

        it('should set the optOut flag in database and create record', () => {
            const ctx = JSON.parse(JSON.stringify(req.session.ctx));

            nock('http://localhost:4550')
                .post('/pcq/backend/submitAnswers')
                .reply(
                    200,
                    {status: ':thumbs_up:'}
                );

            optOut(req, res).then(() => {
                expect(req.session.form).to.have.property('optOut');
                expect(req.session.form.pcqAnswers).to.deep.equal({});
                expect(req.session.ctx).to.deep.equal(ctx);
                nock.cleanAll();
            });

        });

    });
});
