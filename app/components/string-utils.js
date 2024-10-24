'use strict';

const whitelist = [
    'www.apply-for-probate.service.gov.uk',
    'www.moneyclaims.service.gov.uk',
    'www1.moneyclaims.service.gov.uk',
    'www.ocmc.service.gov.uk',
    'www.apply-divorce.service.gov.uk',
    'www.respond-divorce.service.gov.uk',
    'www.end-civil-partnership.service.gov.uk',
    'www.appeal-benefit-decision.service.gov.uk',
    'www.appeal-immigration-asylum-decision.service.gov.uk',
    'apply-to-adopt-a-child-placed-in-your-care.service.gov.uk',
    'www.claim-employment-tribunals.service.gov.uk',
    'onlineplea.cjscp.org.uk',
    'special-tribunals.service.gov.uk',
    'reply-jury-summons.service.gov.uk',
    'www.apply-to-court-about-child-arrangements-c100.service.gov.uk'
];

const prefixHttps = (url = '') => {
    url = url.trim().replace(/\s/g, '');
    if (!(/^(?:f|ht)tps?:\/\//).test(url)) {
        url = 'https://' + url;
    }
    if(!(isUrlWhitelisted(url) || url.includes('platform.hmcts.net') 
        || url.includes('staging.apps.hmcts.net')
        || url.endsWith('test.gov.uk') 
        || url.startsWith('https://localhost') || url.startsWith('http://localhost'))){
        url ='';
    }
    return url;
};

function isUrlWhitelisted(url) {
    // Extract the hostname from the URL
    const hostname = new URL(url).hostname;
    return whitelist.includes(hostname);
}

module.exports = {
    prefixHttps
};
