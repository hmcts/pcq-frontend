import CONF from 'config';
import testConfig from 'test/config.js';
import {v4 as uuidv4} from 'uuid';
import chai from 'chai';
const {assert} = chai;

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

export default TestConfigurator;
