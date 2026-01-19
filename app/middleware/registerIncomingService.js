'use strict';

const logger = require('app/components/logger')('Init');
const auth = require('app/components/auth');
const stringUtils = require('../components/string-utils');
const registeredServices = require('app/registeredServices');
const {verifyToken} = require('app/components/encryption-token');
const appInsights = require('app/components/app-insights');
const config = require('config');
const shouldLog = String(config.get('loggingEnabled')).toLowerCase() === 'true';

// This excludes the token as this is handled separately
const pcqParameters = [
    {name: 'serviceId', required: true},
    {name: 'actor', required: true},
    {name: 'pcqId', required: true},
    {name: 'ccdCaseId', required: false},
    {name: 'partyId', required: true},
    {name: 'returnUrl', required: true},
    {name: 'language', required: false},
    {name: 'ageCheck', required: false}
];

const setSession = req => {
    const session = req.session;
    const form = session.form;

    pcqParameters.forEach(param => {
        const value = req.query[param.name];
        if (value) {
            switch (param.name) {
                case 'serviceId':
                case 'actor':
                    form[param.name] = typeof value === 'string' ? value.toLowerCase() : value;
                    break;
                case 'pcqId':
                case 'ccdCaseId':
                case 'partyId':
                    form[param.name] = value;
                    break;
                case 'returnUrl':
                    session[param.name] = stringUtils.prefixHttps(value);
                    break;
                case 'language':
                case 'ageCheck':
                    session[param.name] = value;
                    break;
                default:
                    break;
            }
        }
    });

    form.channel = req.query.channel ? req.query.channel : 1;
};

const validateParameters = req => {
    const missingRequiredParams = [];

    pcqParameters.forEach(param => {
        // If a required parameter is missing
        if (param.required && !req.query[param.name]) {
            missingRequiredParams.push(param.name);
        }
    });

    if (missingRequiredParams.length > 0) {
        logger.error('Missing required parameters: ' + missingRequiredParams.join(', '));
    } else if (!validatedService(req.query.serviceId)) {
        logger.error(`Service ${req.query.serviceId} is not registered with PCQ`);
    } else {
        logger.info('Parameters verified successfully.');
        appInsights.trackTrace({message: 'Entering PCQ Journey', properties: {['ServiceId']:req.query.serviceId}});
        req.session.validParameters = true;
        // Create the JWT Token after the required parameters have been set.
        auth.createToken(req, req.session.form.partyId);
    }
};

const validatedService = (serviceId) => {
    return Boolean(serviceId &&
        registeredServices.map(s => s.serviceId.toLowerCase()).includes(serviceId.toLowerCase()));
};

const registerIncomingService = (req) => {
    if (shouldLog) {
        logger.info(JSON.stringify(req.query));
    }
    const partyId = req.query.partyId;
    if (partyId) {
        // Ensure emails are properly encoded
        req.query.partyId = partyId.trim().replace(/\s/g, '+');
    }
    if (verifyToken(req.query)) {
        validateParameters(req);
    }
};

module.exports = {
    registerIncomingService,
    setSession
};
