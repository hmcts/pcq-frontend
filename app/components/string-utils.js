'use strict';

const prefixHttps = (url = '') => {
    url = url.trim().replace(/\s/g, '');
    if (!(/^(?:f|ht)tps?:\/\//).test(url)) {
        url = 'https://' + url;
    }
    if(!(url.includes('service.gov.uk') || url.includes('cjscp.org.uk')
        || url.includes('platform.hmcts.net') 
        || url.includes('staging.apps.hmcts.net')
        || url.endsWith('test.gov.uk') 
        || url.startsWith('https://localhost') || url.startsWith('http://localhost'))){
        url ='';
    }
    return url;
};

module.exports = {
    prefixHttps
};
