'use strict';

const healthcheck = require('@hmcts/nodejs-healthcheck');
const logger = require('app/components/logger')('Init');
const os = require('os');
const config = require('config');

const checks = {};
const readinessChecks = {};

if (config.services.pcqBackend.enabled === 'true') {
    checks['pcq-backend'] = healthcheck.web(`${config.services.pcqBackend.url}/health/readiness`, {
        callback: (err, res) => {
            const status = err ? 'DOWN' : res.body.status || 'DOWN';
            if (status === 'DOWN') {
                logger.warn('pcq-backend is DOWN');
                logger.warn(err);
            }
            return status === 'UP' ? healthcheck.up() : healthcheck.down();
        },
        timeout: 10000,
        deadline: 20000
    });
}

const setup = app => {
    healthcheck.addTo(app, {
        checks: checks,
        readinessChecks: readinessChecks,
        buildInfo: {
            name: config.service.name,
            host: os.hostname(),
            uptime: process.uptime(),
        }
    });
};

module.exports = {
    setup: setup
};
