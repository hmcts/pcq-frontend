'use strict';

const router = require('express').Router();
const {registerIncomingService, setSession} = require('app/middleware/registerIncomingService');
const initSession = require('app/middleware/initSession');
const setJourney = require('app/middleware/setJourney');
const config = require('config');
const AsyncFetch = require('app/utils/AsyncFetch');
const asyncFetch = new AsyncFetch();
const logger = require('app/components/logger')('Init');
const frontendHealthUrl = config.services.pcqFrontend.healthUrl;

router.get('/service-endpoint', (req, res) => {
    // Reset the session on registering a new incoming service
    req.session.regenerate(() => {
        initSession(req, res);
        setSession(req);
    });

    const serviceDown = () => {
        res.redirect(`${config.app.basePath}/offline`);
    };

    asyncFetch
        .fetch(frontendHealthUrl, {}, fetchRes => fetchRes.json())
        .then(async json => {
            if ((json['pcq-backend'] && json['pcq-backend'].status === 'UP') || config.services.pcqBackend.enabled === 'false') {
                registerIncomingService(req);
                await setJourney(req, res);

                res.redirect('/start-page');
            } else {
                serviceDown();
            }
        })
        .catch(err => {
            logger.error('Error retrieving app heath: ' + err);
            serviceDown();
        });
});

module.exports = router;
