'use strict';

const logger = require('app/components/logger')('Init');
const {endsWith} = require('lodash');
const HttpsProxyAgent = require('https-proxy-agent');
const config = require('config');

const buildRequest = (url, options) => {
    return new Request(url, options);
};

const retryOptions = () => {
    return {
        retries: config.utils.api.retries,
        retryDelay: config.utils.api.retryDelay
    };
};

const asyncFetch = (url, options, parseBody) => {
    const isHealthOrInfo = endsWith(url, 'health') || endsWith(url, 'info');

    if (!isHealthOrInfo) {
        logger.info('Calling external service');
    }

    return new Promise((resolve, reject) => {
        const asyncReq = buildRequest(url, options);
        fetch(asyncReq, retryOptions())
            .then(res => {
                if (!isHealthOrInfo) {
                    logger.info(`Status: ${res.status}`);
                }
                if (res.ok) {
                    return parseBody(res);
                }
                logger.error(res.statusText);
                return parseBody(res)
                    .then(body => {
                        if (body instanceof Buffer) {
                            logger.error(body.toLocaleString());
                        } else {
                            logger.error(body);
                        }
                        reject(new Error(res.statusText));
                    });
            })
            .then(body => {
                resolve(body);
            })
            .catch(err => {
                logger.error(`${err}`);
                reject(Error(err));
            });
    });
};

const fetchJson = (url, options) => {
    return asyncFetch(url, options, res => res.json())
        .then(json => json)
        .catch(err => err);
};

const fetchText = (url, options) => {
    return asyncFetch(url, options, res => res.text())
        .then(text => text)
        .catch(err => err);
};

const fetchBuffer = (url, options) => {
    return asyncFetch(url, options, res => res.arrayBuffer().then(buffer => Buffer.from(buffer)))
        .then(buffer => buffer)
        .catch(err => {
            logger.error(`Error${err}`);
            throw (err);
        });
};

const fetchOptions = (data, method, headers, proxy) => {
    return {
        method: method,
        mode: 'cors',
        redirect: 'follow',
        follow: 10,
        timeout: config.utils.api.timeout,
        body: method === 'POST' ? JSON.stringify(data) : null,
        headers: new Headers(headers || {}),
        agent: proxy ? new HttpsProxyAgent(proxy) : null
    };
};

module.exports = {
    fetchOptions: fetchOptions,
    fetchJson: fetchJson,
    asyncFetch: asyncFetch,
    fetchText: fetchText,
    fetchBuffer: fetchBuffer
};
