'use strict';

const {Logger} = require('@hmcts/nodejs-logging');

const log = (sessionId) => Logger.getLogger(`protected-characteristics-frontend, sessionId: ${sessionId}`);

module.exports = log;
