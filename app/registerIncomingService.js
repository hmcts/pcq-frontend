'use strict';

const router = require('express').Router();
const {registerIncomingService, setSession} = require('app/middleware/registerIncomingService');
const initSession = require('app/middleware/initSession');
const config = require('config');
const AsyncFetch = require('app/utils/AsyncFetch');
const asyncFetch = new AsyncFetch();
const logger = require('app/components/logger')('Init');

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
        .fetch('http://localhost:4000/health', {}, fetchRes => fetchRes.json())
        .then(json => {
            if ((json['pcq-backend'] && json['pcq-backend'].actualStatus === 'UP') || config.services.pcqBackend.enabled === 'false') {
                registerIncomingService(req, res);
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
