'use strict';

const healthcheck = require('@hmcts/nodejs-healthcheck');
const logger = require('app/components/logger')('Init');
const os = require('os');
const config = require('config');
const getStore = require('app/components/utils').getStore;
const session = require('express-session');
const sessionStore = getStore(config.redis, session);

const osHostname = os.hostname();
const gitProperties = require('git.properties');
const gitCommitId = gitProperties.git.commit.id;
const gitRevision = process.env.GIT_REVISION;

const checks = {};
const readinessChecks = {};

if (config.services.pcqBackend.enabled === 'true') {
    const statusComment = '\'actualStatus\' is the same as \'status\'. It is there for backwards compatibility. Please disregard.';
    checks['pcq-backend'] = healthcheck.web(`${config.services.pcqBackend.url}/health/readiness`, {
        callback: (err, res) => {
            const status = err ? 'DOWN' : res.body.status || 'DOWN';
            if (status === 'DOWN') {
                logger.warn('pcq-backend is DOWN');
                logger.warn(err);
            }
            // DEPRECATED: To be removed after all services stop depending on 'actualStatus'
            const options = {actualStatus: status, comment: statusComment};
            return status === 'UP' ? healthcheck.up(options) : healthcheck.down(options);
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
            version: gitRevision,
            gitCommitId
        }
    });
};

module.exports = {
    setup: setup,
    osHostname: osHostname,
    gitCommitId: gitCommitId
};
