'use strict';

class ServiceMapper {
    static async map(service, params) {
        const serviceModule = await import(`../services/${service}.js`);
        const serviceClass = serviceModule.default;
        return new serviceClass(...params);
    }
}

module.exports = ServiceMapper;
