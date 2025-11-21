'use strict';
const setupSecrets = require('app/setupSecrets');

// Setup secrets before loading the app
setupSecrets();

const app = require('./app');

const { http } = app.init();

function shutdown() {
    http.close(() => {
        process.exit(0);
    });
    setTimeout(() => process.exit(1), 5000).unref();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
