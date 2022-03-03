'use strict';
const serviceEndpointUrl = require('test/end-to-end/utils').serviceEndpointUrl;
const {generateToken} = require('app/components/encryption-token');
const contBtnCy = 'Ymlaen i’r cwestiynau';
const contBtnEn = 'Continue to the question';

module.exports = function(pcqId, lang) {
    const I = this;

    const params = {
        serviceId: 'PROBATE',
        actor: 'APPLICANT',
        pcqId: pcqId,
        ccdCaseId: '1234567890123456',
        partyId: 'test@gmail.com',
        returnUrl: 'dummy-return-url',
        language: lang
    };
    params.token = generateToken(params).token;

    // eslint-disable-next-line no-unused-vars
    I.amOnPage(serviceEndpointUrl(params));

    if (lang === 'cy') {
        I.see(contBtnCy);
        I.click(contBtnCy);
    } else {
        I.see(contBtnEn);
        I.click(contBtnEn);
    }
};
