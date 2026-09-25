import {serviceEndpointUrl} from 'test/end-to-end/utils.js';
import {generateToken} from 'app/components/encryption-token.js';
const contBtnCy = 'Ymlaen i’r cwestiynau';
const contBtnEn = 'Continue to the question';

export default function(pcqId, lang) {
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

    I.amOnPage(serviceEndpointUrl(params));

    if (lang === 'cy') {
        I.see(contBtnCy);
        I.click(contBtnCy);
    } else {
        I.see(contBtnEn);
        I.click(contBtnEn);
    }
};
