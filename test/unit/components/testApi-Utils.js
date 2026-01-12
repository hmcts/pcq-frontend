'use strict';

const expect = require('chai').expect;
const utils = require('app/components/api-utils');
const config = require('config');
const nock = require('nock');

describe('api-utils', () => {

    const testUrl = 'http://localhost:8888/test';

    describe('Verify body value within fetchOptions', () => {
        const expectedFetchOptions = {
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            follow: 10,
            timeout: config.utils.api.timeout,
            headers: '[object Headers]',
            agent: null,
            body: '{"key":"data"}'
        };

        const data = {
            key: 'data'
        };

        it('test fetchoptions body for a POST method', (done) => {
            const fetchOptions = utils.fetchOptions(data, 'POST', null, null);
            expect(fetchOptions.body).to.equal(expectedFetchOptions.body);
            done();
        });

        it('test fetchoptions body for a GET method', (done) => {
            expectedFetchOptions.body = null;
            const fetchOptions = utils.fetchOptions({}, 'GET', null, null);
            expect(fetchOptions.body).to.equal(expectedFetchOptions.body);
            done();
        });
    });

    describe('fetchJson', () => {
        it('returns valid json on GET request', async () => {
            nock('http://localhost:8888')
                .get('/test')
                .reply(
                    200,
                    {expect: 'this json'}
                );

            const fetchOptions = utils.fetchOptions(null, 'GET', {});
            const json = await utils.fetchJson(testUrl, fetchOptions);

            expect(json).to.deep.equal({expect: 'this json'});
            nock.cleanAll();
        });

        it('catch error on GET request failure', async () => {
            const fetchOptions = utils.fetchOptions(null, 'GET', {});
            const error = await utils.fetchJson(testUrl, fetchOptions);

            expect(error.message).to.contain('fetch failed');
        });
    });

    describe('fetchText', () => {
        it('returns valid text on GET request', async () => {
            nock('http://localhost:8888')
                .get('/test')
                .reply(
                    200,
                    'I expect this text'
                );

            const fetchOptions = utils.fetchOptions(null, 'GET', {});
            const text = await utils.fetchText(testUrl, fetchOptions);

            expect(text).to.equal('I expect this text');
            nock.cleanAll();
        });

        it('catch error on GET request failure', async () => {
            const fetchOptions = utils.fetchOptions(null, 'GET', {});
            const error = await utils.fetchText(testUrl, fetchOptions);

            expect(error.message).to.contain('fetch failed');
        });
    });

    describe('fetchBuffer', () => {
        it('returns valid buffer on GET request', async () => {
            nock('http://localhost:8888')
                .get('/test')
                .reply(
                    200,
                    'I expect this text'
                );

            const fetchOptions = utils.fetchOptions(null, 'GET', {});
            const buffer = await utils.fetchBuffer(testUrl, fetchOptions);

            expect(buffer.equals(Buffer.from('I expect this text', 'utf8'))).to.equal(true);
            nock.cleanAll();
        });

        it('catch error on GET request failure', async () => {
            const fetchOptions = utils.fetchOptions(null, 'GET', {});
            try {
                await utils.fetchBuffer(testUrl, fetchOptions);
            } catch (e) {
                expect(e.message).to.contain('fetch failed');
            }
        });
    });

    describe('asyncFetch', () => {
        it('return error on fetch failure', async () => {
            nock('http://localhost:8888')
                .get('/health')
                .reply(
                    400
                );

            const fetchOptions = utils.fetchOptions(null, 'GET', {});
            try {
                await utils.asyncFetch('http://localhost:8888/health', fetchOptions, res => res.text());
            } catch (e) {
                expect(e.message).to.equal('Bad Request');
            }

            nock.cleanAll();
        });

        it('return error on fetch failure with buffer body', async () => {
            nock('http://localhost:8888')
                .get('/info')
                .reply(
                    400,
                    Buffer.from('test', 'utf8')
                );

            const fetchOptions = utils.fetchOptions(null, 'GET', {});
            try {
                await utils.asyncFetch('http://localhost:8888/info', fetchOptions, res => res.arrayBuffer().then(buffer => Buffer.from(buffer)));
            } catch (e) {
                expect(e.message).to.equal('Bad Request');
            }

            nock.cleanAll();
        });
    });

});
