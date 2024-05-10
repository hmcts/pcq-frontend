/* eslint-disable max-lines */
'use strict';

/* eslint no-console: 0 no-unused-vars: 0 */

const appInsights = require('app/components/app-insights');
const logger = require('app/components/logger');
const path = require('path');
const express = require('express');
const rewrite = require('express-urlrewrite');
const session = require('express-session');
const nunjucks = require('nunjucks');
const routes = require(`${__dirname}/app/routes`);
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('config');
const utils = require(`${__dirname}/app/components/utils`);
const packageJson = require(`${__dirname}/package`);
const helmet = require('helmet');
const csrf = require('csurf');
const healthcheck = require(`${__dirname}/app/healthcheck`);
const fs = require('fs');
const https = require('https');
const {v4: uuidv4} = require('uuid');
const uuid = uuidv4();
const sanitizeRequestBody = require('app/middleware/sanitizeRequestBody');
const isEmpty = require('lodash').isEmpty;
const invoker = require('app/middleware/invoker');

exports.init = function (isA11yTest = false, a11yTestSession = {}, ftValue) {
    const app = express();
    const port = config.app.port;
    const releaseVersion = packageJson.version;
    const useHttps = config.app.useHttps.toLowerCase();
    const govUkFrontendPath = path.resolve(require.resolve('govuk-frontend'), '../../');

    // Initialise Azure Application Insights
    appInsights();

    // Application settings
    app.set('view engine', 'html');
    app.set('views', ['app/steps', 'app/views']);

    const isDev = app.get('env') === 'development';

    const njkEnv = nunjucks.configure([
        'app/steps',
        'app/views',
        govUkFrontendPath
    ], {
        noCache: isDev,
        express: app
    });

    const globals = {
        currentYear: new Date().getFullYear(),
        gtmId: config.gtmId,
        enableTracking: config.enableTracking,
        links: config.links,
        nonce: uuid,
        basePath: config.app.basePath
    };
    njkEnv.addGlobal('globals', globals);

    app.use(rewrite(`${globals.basePath}/public/*`, '/public/$1'));

    app.enable('trust proxy');

    // Security library helmet to verify 11 smaller middleware functions
    app.use(helmet());

    // Content security policy to allow just assets from same domain
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ['\'self\''],
            fontSrc: ['\'self\' data:', 'fonts.gstatic.com'],
            scriptSrc: [
                '\'self\'',
                '\'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU=\'',
                '\'sha256-AaA9Rn5LTFZ5vKyp3xOfFcP4YbyOjvWn2up8IKHVAKk=\'',
                '\'sha256-G29/qSW/JHHANtFhlrZVDZW1HOkCDRc78ggbqwwIJ2g=\'',
                'https://www.google-analytics.com',
                'https://*.googletagmanager.com',
                'https://*.dynatrace.com',
                'vcc-eu4.8x8.com',
                'vcc-eu4b.8x8.com',
                `'nonce-${uuid}'`
            ],
            connectSrc: [
                '\'self\'',
                'https://*.google-analytics.com',
                'https://*.analytics.google.com',
                'https://*.googletagmanager.com',
                'https://*.dynatrace.com',
                'https://*.g.doubleclick.net'
            ],
            mediaSrc: ['\'self\''],
            frameSrc: ['vcc-eu4.8x8.com', 'vcc-eu4b.8x8.com'],
            imgSrc: [
                '\'self\'',
                '\'self\' data:',
                'https://*.google-analytics.com',
                'https://*.analytics.google.com',
                'https://*.googletagmanager.com',
                'https://*.dynatrace.com',
                'https://*.g.doubleclick.net',
                'vcc-eu4.8x8.com',
                'vcc-eu4b.8x8.com',
                'ssl.gstatic.com',
                'www.gstatic.com'
            ],
            styleSrc: [
                '\'self\'',
                '\'unsafe-inline\'',
                'tagmanager.google.com',
                'fonts.googleapis.com'
            ],
            frameAncestors: ['\'self\'']
        },
        browserSniff: false,
        setAllHeaders: false
    }));

    // Http public key pinning
    app.use(helmet.hpkp({
        maxAge: 900,
        sha256s: ['AbCdEf123=', 'XyzABC123=']
    }));

    // Referrer policy for helmet
    app.use(helmet.referrerPolicy({
        policy: 'origin'
    }));

    app.use(helmet.noCache());

    app.use(helmet.xssFilter({setOnOldIE: true}));

    app.use((req, res, next) => {
        res.removeHeader('Accept-Ranges');
        next();
    });

    const staticOptions = {
        cacheControl: true,
        setHeaders: (res) => res.setHeader('Cache-Control', 'max-age=604800'),
        acceptRanges: false,
    };

    // Middleware to serve static assets
    app.use('/public/stylesheets', express.static(`${__dirname}/public/stylesheets`, staticOptions));
    app.use('/public/images', express.static(`${__dirname}/app/assets/images`, staticOptions));
    app.use('/public/javascripts/govuk-frontend', express.static(govUkFrontendPath, staticOptions));
    app.use('/public/javascripts', express.static(`${__dirname}/app/assets/javascripts`, staticOptions));
    app.use('/public/javascripts', express.static(`${__dirname}/public/javascripts`, staticOptions));
    app.use('/public/pdf', express.static(`${__dirname}/app/assets/pdf`));
    app.use('/assets', express.static(`${govUkFrontendPath}/govuk/assets`, staticOptions));

    // Elements refers to icon folder instead of images folder
    app.use(favicon(path.join(govUkFrontendPath, 'govuk', 'assets', 'images', 'favicon.ico')));

    // Support for parsing data in POSTs
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(cookieParser());

    // Send assetPath to all views
    app.use((req, res, next) => {
        res.locals.asset_path = `${globals.basePath}/public/`;
        next();
    });

    // Support session data
    app.use(session({
        proxy: config.redis.proxy,
        resave: config.redis.resave,
        saveUninitialized: config.redis.saveUninitialized,
        secret: config.redis.secret,
        cookie: {
            httpOnly: config.redis.cookie.httpOnly,
            sameSite: config.redis.cookie.sameSite
        },
        store: utils.getStore(config.redis, session)
    }));

    healthcheck.setup(app);

    app.use((req, res, next) => {
        if (!req.session) {
            return next(new Error('Unable to reach redis'));
        }

        if (isA11yTest && !isEmpty(a11yTestSession)) {
            req.session = Object.assign(req.session, a11yTestSession);
        }

        next();
    });

    app.use((req, res, next) => {
        req.session.cookie.secure = req.protocol === 'https';
        next();
    });

    app.use((req, res, next) => {
        if (!req.session.language) {
            req.session.language = 'en';
        }

        if (req.query && req.query.lng && config.languages.includes(req.query.lng)) {
            req.session.language = req.query.lng;
        }

        if (isA11yTest && !isEmpty(a11yTestSession)) {
            req.session = Object.assign(req.session, a11yTestSession);
        }

        next();
    });

    if (config.app.useCSRFProtection === 'true') {
        app.use((req, res, next) => {
            // Exclude Dynatrace Beacon POST requests from CSRF check
            if (req.method === 'POST' && req.path.startsWith('/rb_')) {
                next();
            } else {
                csrf({})(req, res, next);
            }
        });

        app.use((req, res, next) => {
            if (req.csrfToken) {
                res.locals.csrfToken = req.csrfToken();
            }
            next();
        });
    }

    // Add variables that are available in all views
    app.use(function (req, res, next) {
        const commonContent = require(`app/resources/${req.session.language}/translation/common`);

        res.locals.govuk = commonContent.govuk;
        res.locals.serviceName = commonContent.serviceName;
        res.locals.releaseVersion = releaseVersion;
        next();
    });

    // Force HTTPs on production connections
    if (useHttps === 'true') {
        app.use(utils.forceHttps);
    }

    app.post('*', sanitizeRequestBody);

    app.use(`${config.livenessEndpoint}`, (req, res) => {
        res.json({status: 'UP'});
    });

    app.use((req, res, next) => {
        res.locals.launchDarkly = {};
        if (ftValue) {
            res.locals.launchDarkly.ftValue = ftValue;
        }
        next();
    });

    app.use(`${config.app.basePath}/`, (req, res, next) => {
        if (req.query.id && req.query.id !== req.session.regId) {
            delete req.session.form;
        }
        req.session.regId = req.query.id || req.session.regId || req.sessionID;
        next();
    }, routes);

    // Start the app
    let http;

    if (['development', 'testing'].includes(config.nodeEnvironment)) {
        const sslDirectory = path.join(__dirname, 'app', 'resources', 'localhost-ssl');
        const sslOptions = {
            minVersion: 'TLSv1.2',
            key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
            cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt'))
        };
        const server = https.createServer(sslOptions, app);

        http = server.listen(port, () => {
            console.log(`Application started: http://localhost:${port}${config.app.basePath}`);
        });
    } else {
        http = app.listen(port, () => {
            console.log(`Application started: http://localhost:${port}${config.app.basePath}`);
        });
    }

    // PCQ Invoker
    if (config.environment !== 'prod') {
        invoker.addTo(app);
    }

    app.all('*', (req, res) => {
        const commonContent = require(`app/resources/${req.session.language}/translation/common`);
        const content = require(`app/resources/${req.session.language}/translation/errors/404`);

        logger(req.sessionID).error(`Unhandled request ${req.url}`);
        res.status(404).render('errors/error', {common: commonContent, content: content, error: '404'});
    });

    app.use((err, req, res, next) => {
        const lang = req.session ? req.session.language : 'en';
        const commonContent = require(`app/resources/${lang}/translation/common`);
        const content = require(`app/resources/${lang}/translation/errors/500`);

        logger(req.sessionID).error(err);
        res.status(500).render('errors/error', {common: commonContent, content: content, error: '500'});
    });

    return {app, http};
};
