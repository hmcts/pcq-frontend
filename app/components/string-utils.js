'use strict';

const prefixHttps = (url = '') => {
    url = url.trim().replace(/\s/g, '');
    if (!(/^(?:f|ht)tps?:\/\//).test(url)) {
        url = 'https://' + url;
    }
    if(!isUrlWhitelisted(url)){
        url = '';
    }
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
            'apps.hmcts.net'
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
