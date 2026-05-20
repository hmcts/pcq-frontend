'use strict';

const expect = require('chai').expect;
const nock = require('nock');
const sinon = require('sinon');
const AsyncFetch = require('app/utils/AsyncFetch');
const asyncFetch = new AsyncFetch();

describe('AsyncFetch', () => {
    const testUrl = 'http://localhost:8888';
    it('parses a valid request', async () => {
        nock(testUrl)
            .get('/')
            .reply(
                200,
                {expect: 'this json'}
            );

        const body = await asyncFetch.fetch(testUrl, {}, res => res.json());
        expect(body).to.deep.equal({expect: 'this json'});
    });

    it('parses body on 400', async () => {
        nock(testUrl)
            .get('/')
            .reply(
                400,
                {expect: 'this json'}
            );

        const body = await asyncFetch.fetch(testUrl, {}, res => res.json());
        expect(body).to.deep.equal({expect: 'this json'});
    });

    it('rejects bad requests (not 400)', async () => {
        nock(testUrl)
            .get('/')
            .reply(404);

        let errored = false;
        try {
            await asyncFetch.fetch(testUrl, {}, res => res.json());
        } catch (err) {
            errored = true;
            expect(err.message).to.contain('Unexpected end of JSON input');
        }
        expect(errored).to.equal(true);
    });

    it('rejects bad requests (not 400) with json body', async () => {
        nock(testUrl)
            .get('/')
            .reply(
                404,
                {test: 'json'}
            );

        let errored = false;
        try {
            await asyncFetch.fetch(testUrl, {}, res => res.json());
        } catch (err) {
            errored = true;
            expect(err.message).to.contain('Not Found');
        }
        expect(errored).to.equal(true);
    });

    it('logs a non json body', () => {
        const stringifyStub = sinon.stub(JSON, 'stringify').throws(new Error('Force error'));
        const testAsyncFetch = new AsyncFetch();

        // Test will fail if the error thrown is not caught
        const err = testAsyncFetch.logBody('non json');
        expect(err.message).to.equal('Force error');
        stringifyStub.restore();
    });
});
