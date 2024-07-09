'use strict';

const appInsights = require('app/components/app-insights');

const startPageBackService = (req, res) => {
    appInsights.trackTrace({message: 'Returning to primary service from Start Page', properties: {['ServiceId']:req.session.form.serviceId}});
    
};

module.exports = startPageBackService;