'use strict';

const config = require('config');
const ServiceMapper = require('app/utils/ServiceMapper');
const moment = require('moment');
const appInsights = require('app/components/app-insights');
const validateUrl = require('app/middleware/validateUrl');

const setOptOut = (req, res) => {
    const token = req.session.token;
    const correlationId = req.session.correlationId;
    const formData = ServiceMapper.map(
        'FormData',
        [config.services.pcqBackend.url, req.session.id]
    );
    // Set the completed date
    const form = req.session.form;
    form.completedDate = moment().toISOString();

    // Set the opt out flag
    form.optOut = 'Y';

    //set pcqAnswers to empty to call backend in anycase continue or optout
    form.pcqAnswers = form.pcqAnswers || {};

    return formData.post(token, correlationId, form)
        .catch(err => {
            req.log.error(err);
        })
        .finally(() => {
            res.redirect(validateUrl(req));
        });
};

const optOut = (req, res) => {
    const form = req.session.form;
    appInsights.trackTrace({message: `Opting out PCQ Journey - ServiceId: ${req.session.form.serviceId}`, 
        properties: {['ServiceId']:req.session.form.serviceId}});
    // Now in all case we are creating a backend record either user has continued or optout.
    if (!('optOut' in form)) {
        return setOptOut(req, res);
    }
    res.redirect(validateUrl(req));
    
};

module.exports = optOut;
