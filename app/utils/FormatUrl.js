'use strict';

const config = require('config');

class FormatUrl {
    static format(serviceUrl, servicePath = '') {
        const urlParts = new URL(serviceUrl);
        const port = urlParts.port ? `:${urlParts.port}` : '';
        let path = servicePath || urlParts.pathname;
        path = path !== '/' ? path : '';
        return `${urlParts.protocol}//${urlParts.hostname}${port}${path}`;
    }

    static createHostname(req) {
        return `${config.frontendPublicHttpProtocol.toLowerCase()}://${req.get('host')}`;
    }

    static getCleanPageUrl(pageUrl, index) {
        return '/' + pageUrl.split('?')[0].split('/')[index];
    }
}

module.exports = FormatUrl;
