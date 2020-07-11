'use strict';

const logger = require('app/components/logger')('Init');
const auth = require('app/components/auth');
const stringUtils = require('../components/string-utils');
const registeredServices = require('app/registeredServices');
const featureToggle = new (require('app/utils/FeatureToggle'))();
const {verifyToken} = require('app/components/encryption-token');

// This excludes the token as this is handled separately
const pcqParameters = [
    {name: 'serviceId', required: true},
    {name: 'actor', required: true},
    {name: 'pcqId', required: true},
    {name: 'ccdCaseId', required: false},
    {name: 'partyId', required: true},
    {name: 'returnUrl', required: true},
    {name: 'language', required: false}
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
        req.session.validParameters = true;
        // Create the JWT Token after the required parameters have been set.
        auth.createToken(req, req.session.form.partyId);
    }
};

const validatedService = (serviceId) => {
    return Boolean(serviceId &&
        registeredServices.map(s => s.serviceId.toLowerCase()).includes(serviceId.toLowerCase()));
};

const registerIncomingService = (req, res) => {
    logger.info(req.query);
    featureToggle.checkToggle('ft_verify_token', (err, enabled) => {
        if (err) {
            req.log.error(err);
        } else if (enabled) {
            if (verifyToken(req.query)) {
                validateParameters(req);
            }
        } else {
            validateParameters(req);
        }

        res.redirect('/start-page');
    }, req, res);
};

module.exports = {
    registerIncomingService,
    setSession
};
