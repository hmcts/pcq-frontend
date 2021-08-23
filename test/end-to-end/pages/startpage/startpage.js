'use strict';
const serviceEndpointUrl = require('test/end-to-end/utils').serviceEndpointUrl;
const {generateToken} = require('app/components/encryption-token');

module.exports = function (pcqId) {
    const I = this;

    const params = {
        serviceId: 'PROBATE',
        actor: 'APPLICANT',
        pcqId: pcqId,
        ccdCaseId: '1234567890123456',
        partyId: 'test@gmail.com',
        returnUrl: 'dummy-return-url',
        language: 'en'
    };
    params.token = generateToken(params).token;

    // eslint-disable-next-line no-unused-vars
    I.amOnPage(serviceEndpointUrl(params));
    I.see('Continue to the question');
    I.click('Continue to the question');
};
