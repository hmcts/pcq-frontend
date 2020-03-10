'use strict';

const router = require('express').Router();
const os = require('os');
const commonContent = require('app/resources/en/translation/common');
const gitRevision = process.env.GIT_REVISION;
const osHostname = os.hostname();
const config = require('app/config');

router.get(`${config.app.basePath}/health`, (req, res) => {
    res.json({
        name: commonContent.serviceName,
        status: 'UP',
        uptime: process.uptime(),
        host: osHostname,
        version: gitRevision,
    });
});

module.exports = router;
module.exports.osHostname = osHostname;

