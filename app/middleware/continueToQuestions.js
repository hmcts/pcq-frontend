'use strict';

const appInsights = require('app/components/app-insights');

const continueToQuestions = (req, res, next) => {
    if (req.originalUrl === '/start-page') {
        appInsights.trackTrace({message: `Continue to questions from start-page - ServiceId: ${req.session.form.serviceId}`, 
            properties: {['ServiceId']:req.session.form.serviceId}});
    }
    next();
    
};

module.exports = continueToQuestions;