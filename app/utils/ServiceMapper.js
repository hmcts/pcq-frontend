'use strict';

const { createRequire } = require('node:module');

class ServiceMapper {
    static map(service, params) {
        const require = createRequire(__filename);
        const serviceModule = require(`app/services/${service}`);
        
        // Handle both ESM and CommonJS exports
        const serviceClass = serviceModule.default || serviceModule;
        return new serviceClass(...params);
    }
}

module.exports = ServiceMapper;
