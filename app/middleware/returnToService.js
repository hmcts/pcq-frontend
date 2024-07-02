'use strict';

const validateUrl = require('app/middleware/validateUrl');
const appInsights = require('app/components/app-insights');

const returnToService = (req, res) => {
    appInsights.trackTrace({message: 'Returning to primary service', properties: {['ServiceId']:req.session.form.serviceId}});
    res.redirect(validateUrl(req));
};

module.exports = returnToService;