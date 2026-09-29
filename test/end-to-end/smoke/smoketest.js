import {serviceEndpointUrl} from 'test/end-to-end/utils.js';
import {generateToken} from 'app/components/encryption-token.js';
import {v4 as uuidv4} from 'uuid';
import CONF from 'config';
/* eslint-disable no-undef */
console.log(`Running tests against URL: ${CONF.testUrl}`);

const {I} = inject();

const params = {
    serviceId: 'PROBATE',
    actor: 'CITIZEN',
    pcqId: uuidv4(),
    ccdCaseId: '1234567890123456',
    partyId: 'test@gmail.com',
    returnUrl: 'dummy.test.gov.uk',
    language: 'en'
};
params.token = generateToken(params).token;

Given('user is on pcq start page', () => {
    I.amOnPage(serviceEndpointUrl(params));
});

Then('user should see Equality and diversity questions', () => {
    I.see('Continue to the question');
    I.see('I don\'t want to answer these questions');
    I.see('Equality and diversity questions');
});
