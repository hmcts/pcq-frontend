'use strict';

const config = require('config');
const logger = require('app/components/logger');
const log = logger('Init');

class AsyncFetch {
    buildRequest(url, fetchOptions) {
        return new Request(url, fetchOptions);
    }

    retryOptions() {
        return {
            retries: config.utils.api.retries,
            retryDelay: config.utils.api.retryDelay
        };
    }

    isHealthEndpoint(url) {
        return url.endsWith('health');
    }

    async fetch(url, fetchOptions, parseBody) {
        if (!this.isHealthEndpoint(url)) {
            log.info('Calling external service');
        }

        try {
            const asyncReq = this.buildRequest(url, fetchOptions);
            const response = await fetch(asyncReq, this.retryOptions());

            if (!this.isHealthEndpoint(url)) {
                log.info(`Status: ${response.status}`);
            }

            if (response.ok) {
                return await parseBody(response);
            }

            if (response.status === 400) {
                log.error(response.statusText);
                const body = await parseBody(response);
                this.logBody(body);
                return body;
            }

            log.error(response.statusText);
            const body = await parseBody(response);
            this.logBody(body);
            throw new Error(response.statusText);
        } catch (err) {
            log.error(`Error${err}`);
            throw err;
        }
    }

    logBody(body) {
        try {
            const json = JSON.stringify(body);
            log.error(json);
        } catch (e) {
            log.error(body);
            return e;
        }
    }
}

module.exports = AsyncFetch;
