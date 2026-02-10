'use strict';

const appInsights = require('app/components/app-insights');

const startPageBackService = (req, res) => {
    appInsights.trackTrace({message: `Returning to primary service from Start Page - ServiceId: ${req.session.form.serviceId}`, 
        properties: {['ServiceId']:req.session.form.serviceId}});
    return res.status(200).json({
        'Status':'OK'
    });
};

module.exports = startPageBackService;