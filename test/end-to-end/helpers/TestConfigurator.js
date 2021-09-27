'use strict';
// eslint-disable-next-line no-unused-vars
const CONF = require('config');
const testConfig = require('test/config');
const uuidv4 = require('uuid/v4');
const request = require('request');
const assert = require('chai').assert;

class TestConfigurator {
    constructor() {
        console.log(`Running tests against URL: ${CONF.testUrl}`);
    }

    getUserData(pcqid) {
        request({
            url: `http://pcq-backend-aat.service.core-compute-aat.internal/pcq/backend/getAnswer/${pcqid}`,
            method: 'GET',
            headers: {'content-type': 'application/json'},
            // eslint-disable-next-line no-unused-vars
        },
        function (err, res, body) {
            if (!res) {
                err = new Error('node-librato-metrics: No response received!');
            } else {
                const userData = JSON.parse(body);
                assert.equal(userData.pcqId, pcqid, 'pcqid verfication');
                assert.equal(userData.ccdCaseId, testConfig.TestccdCaseId, 'Caseid verification');
                assert.equal(userData.partyId, testConfig.TestpartyId.toLowerCase());
                assert.equal(userData.serviceId, testConfig.TestserviceId.toLowerCase());
                assert.equal(userData.actor, testConfig.Testactor.toLowerCase());
                assert.equal(userData.versionNo, testConfig.TestVerison);
            }
        });
    }

    setPcqId() {
        return uuidv4();
    }
}

module.exports = TestConfigurator;
