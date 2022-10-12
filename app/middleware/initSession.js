'use strict';

const config = require('config');
const uuidv4 = require('uuid/v4');

const initSession = (req, res, next) => {
    if (!req.session.correlationId) {
        req.session.correlationId = uuidv4();
    }
    if (!req.session.ctx) {
        req.session.ctx = {};
    }
    if (!req.session.form) {
        req.session.form = {
            versionNo: config.questionsVersion
        };
        req.session.back = [];
    }
    if (!req.session.validParameters) {
        req.session.validParameters = false;
    }

    if (!req.session.featureToggles) {
        req.session.featureToggles = {};
    }

    if (next) {
        next();
    }
};

module.exports = initSession;
