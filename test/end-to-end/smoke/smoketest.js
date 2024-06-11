'use strict';
const serviceEndpointUrl = require('test/end-to-end/utils').serviceEndpointUrl;
const {generateToken} = require('app/components/encryption-token');
const {v4: uuidv4} = require('uuid');
const CONF = require('config');
/* eslint-disable no-undef */
console.log(`Running tests against URL: ${CONF.testUrl}`);

const {I} = inject();

const params = {
    serviceId: 'PROBATE',
    actor: 'CITIZEN',
    pcqId: uuidv4(),
    ccdCaseId: '1234567890123456',
    partyId: 'test@gmail.com',
    returnUrl: 'dummy-return-url',
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
