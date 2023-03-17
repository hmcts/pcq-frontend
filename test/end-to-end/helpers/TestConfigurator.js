'use strict';
// eslint-disable-next-line no-unused-vars
const CONF = require('config');
const testConfig = require('test/config');
const uuidv4 = require('uuid/v4');
const fetch = require('node-fetch');
const assert = require('chai').assert;

class TestConfigurator {
    constructor() {
        console.log(`Running tests against URL: ${CONF.testUrl}`);
    }

    getUserData(pcqid) {
        fetch(`http://pcq-backend-aat.service.core-compute-aat.internal/pcq/backend/getAnswer/${pcqid}`, {
            headers: {'Content-Type': 'application/json'},
        })
            .then(res => res.json())
            .then(json => {
                const userData = json;
                assert.equal(userData.pcqId, pcqid, 'pcqid verfication');
                assert.equal(userData.ccdCaseId, testConfig.TestccdCaseId, 'Caseid verification');
                assert.equal(userData.partyId, testConfig.TestpartyId.toLowerCase());
                assert.equal(userData.serviceId, testConfig.TestserviceId.toLowerCase());
                assert.equal(userData.actor, testConfig.Testactor.toLowerCase());
                assert.equal(userData.versionNo, testConfig.TestVerison);
            })
            .catch(err => console.log(err));
    }

    setPcqId() {
        return uuidv4();
    }
}

module.exports = TestConfigurator;
