'use strict';

const prefixHttps = (url = '') => {
    url = url.trim().replace(/\s/g, '');
    if (!(/^(?:f|ht)tps?:\/\//).test(url)) {
        url = 'https://' + url;
    }
    if(!isUrlWhitelisted(url)){
        url = '';
    }
    /*if(!(url.includes('service.gov.uk') || url.includes('cjscp.org.uk')
        || url.includes('platform.hmcts.net') 
        || url.includes('staging.apps.hmcts.net')
        || url.endsWith('test.gov.uk') 
        || url.startsWith('https://localhost') || url.startsWith('http://localhost'))){
        url ='';
    }*/
    return url;
};

function isUrlWhitelisted(url) {
    try {
        // Parse the URL and extract the hostname
        const { hostname } = new URL(url);

        // Define the whitelisted domains and prefixes
        const whitelistedDomains = [
            'service.gov.uk',
            'cjscp.org.uk',
            'platform.hmcts.net',
            'staging.apps.hmcts.net',
            'test.gov.uk',
        ];
        const whitelistedPrefixes = ['https://localhost', 'http://localhost'];

        // Check if the hostname matches any of the whitelisted domains
        const isDomainWhitelisted = whitelistedDomains.some(domain => hostname.endsWith(domain));
        
        // Check if the hostname starts with any of the whitelisted prefixes
        const isPrefixWhitelisted = whitelistedPrefixes.some(prefix => url.startsWith(prefix));

        return isDomainWhitelisted || isPrefixWhitelisted;
    } catch (e) {
        // Return false if the URL is invalid
        return false;
    }
}

module.exports = {
    prefixHttps
};
