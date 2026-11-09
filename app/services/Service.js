'use strict';

import { createRequire } from 'node:module';
import config from 'config';

const require = createRequire(import.meta.url);
const logger = require('../components/logger');
const formatUrl = require('../utils/FormatUrl');
const AsyncFetch = require('../utils/AsyncFetch');
const asyncFetch = new AsyncFetch();

class Service {
    constructor(endpoint, sessionId) {
        this.endpoint = endpoint;
        this.sessionId = sessionId;
        this.config = config;
        this.formatUrl = formatUrl;
    }

    /**
     * Fetch data via GET request
     * @returns {Promise}
     */
    get() {
        throw new ReferenceError('get() must be overridden when extending Service');
    }

    /**
     * Fetch data via POST request
     * @returns {Promise}
     */
    post() {
        throw new ReferenceError('post() must be overridden when extending Service');
    }

    /**
     * Fetch data via PATCH request
     * @returns {Promise}
     */
    patch() {
        throw new ReferenceError('patch() must be overridden when extending Service');
    }

    /**
     * Fetch data via DELETE request
     * @returns {Promise}
     */
    delete() {
        throw new ReferenceError('delete() must be overridden when extending Service');
    }

    log(message, level = 'info') {
        const sessionId = this.sessionId ? this.sessionId : 'Init';
        logger(sessionId)[level](message);
    }

    replacePlaceholderInPath(path, placeholder, value) {
        return path.replace(`{${placeholder}}`, value);
    }

    fetchJson(url, fetchOptions) {
        return asyncFetch
            .fetch(url, fetchOptions, res => res.json())
            .then(json => json)
            .catch(err => err);
    }

    fetchText(url, fetchOptions) {
        return asyncFetch
            .fetch(url, fetchOptions, res => res.text())
            .then(text => text)
            .catch(err => err);
    }

    fetchBuffer(url, fetchOptions) {
        return asyncFetch
            .fetch(url, fetchOptions, res => res.arrayBuffer().then(buffer => Buffer.from(buffer)))
            .then(buffer => buffer)
            .catch(err => {
                this.log(`Fetch buffer error: ${this.formatErrorMessage(err)}`, 'error');
                throw new Error(err);
            });
    }

    fetchOptions(data, method, headers) {
        return {
            method: method,
            mode: 'cors',
            redirect: 'follow',
            follow: 10,
            timeout: 10000,
            body: JSON.stringify(data),
            headers: new Headers(headers || {})
        };
    }

    formatErrorMessage(error) {
        return error.toString();
    }
}

export default Service;
