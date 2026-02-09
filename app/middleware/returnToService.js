'use strict';

const validateUrl = require('app/middleware/validateUrl');
const appInsights = require('app/components/app-insights');

const returnToService = (req, res) => {
    appInsights.trackTrace({message: `Returning to primary service - ServiceId: ${req.session.form.serviceId}`, 
        properties: {['ServiceId']:req.session.form.serviceId}});
    res.redirect(validateUrl(req));
};

module.exports = returnToService;