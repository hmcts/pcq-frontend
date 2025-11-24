'use strict';

const config = require('config');
const router = require('express').Router();
const initSteps = require('app/core/initSteps');
const logger = require('app/components/logger');
const get = require('lodash').get;
const initSession = require('app/middleware/initSession');
const registerIncomingService = require('app/registerIncomingService');
const validateParams = require('app/middleware/validateParams');
const optOut = require('app/middleware/optOut');
const returnToService = require('app/middleware/returnToService');
const startPageBackService = require('app/middleware/startPageBackService');
const continueToQuestions = require('app/middleware/continueToQuestions');
const featureToggle = new (require('app/utils/FeatureToggle'))();

router.use(initSession);
router.use(registerIncomingService);

router.get('*', (req, res, next) => validateParams(req, res, next));

router.all('*', (req, res, next) => {
    const correlationId = get(req.session, 'correlationId', 'init');
    req.log = logger(correlationId);
    req.log.info(`Processing ${req.method} for ${req.originalUrl}`);
    next();
});

router.get('/', (req, res) => {
    req.log.info({tags: 'Analytics'}, 'Application Started');
    res.redirect(`${config.app.basePath}/start-page`);
});

router.post('/opt-out', optOut);

router.get('/return-to-service', returnToService);

router.get('/start-page-back-service', startPageBackService);

router.get('/continue-to-questions', continueToQuestions);

router.use(async (req, res, next) => {
    const toggles = await Promise.all([
        featureToggle.checkToggle('ft_dtrum_session_properties', req, res),
        featureToggle.checkToggle('ft_dtrum_opt_out', req, res),
        featureToggle.checkToggle('ft_ga_nonce_update', req, res)
    ]);
    req.session.featureToggles.ft_dtrum_session_properties = toggles[0];
    req.session.featureToggles.ft_dtrum_opt_out = toggles[1];
    req.session.featureToggles.ft_ga_nonce_update = toggles[2];

    res.locals.session = req.session;
    res.locals.pageUrl = req.url;
    next();
});

const stepsByLang = {
    en: initSteps([`${__dirname}/steps/ui`], 'en'),
    cy: initSteps([`${__dirname}/steps/ui`], 'cy')
};

Object.values(stepsByLang.en).forEach(stepEn => {
    const path = stepEn.constructor.getUrl();
    const pickStep = req => stepsByLang[stepsByLang[req.session.language] ? req.session.language : 'en'][stepEn.constructor.name];
    router.get(path, (req, res, next) => pickStep(req).runner().GET(pickStep(req))(req, res, next));
    router.post(path, continueToQuestions, (req, res, next) => pickStep(req).runner().POST(pickStep(req))(req, res, next));
});

router.get('/health/liveness', (req, res) => {
    res.json({status: 'UP'});
});

module.exports = router;
