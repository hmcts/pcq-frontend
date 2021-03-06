'use strict';

const expect = require('chai').expect;
const FormData = require('app/services/FormData');
const co = require('co');
const config = require('config');
const nock = require('nock');

describe('FormDataService', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('should call post() successfully', (done) => {
        const endpoint = 'http://localhost';
        const inputForm = {deceased: {name: 'test'}};
        const expectedForm = {deceased: {name: 'test'}};
        const token = 'token';
        const correlationId = 'correlationId';
        const formData = new FormData(endpoint, 'abc123');
        nock(endpoint, {
            reqheaders: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'X-Correlation-Id': correlationId
            }
        }).post(config.services.pcqBackend.paths.forms, expectedForm)
            .reply(200, expectedForm);

        co(function* () {
            const actualForm = yield formData.post(token, correlationId, inputForm);
            expect(actualForm).to.deep.equal(expectedForm);
            done();
        }).catch(err => {
            done(err);
        });
    });
});
