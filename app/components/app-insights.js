'use strict';

const appInsights = require('applicationinsights');
const logger = require('app/components/logger')('Init');
const config = require('config');

let client;
const connectionString = config.get('appInsights.connectionString');

exports.initAppInsights = function initAppInsights() {
    if (connectionString) {
        logger.info('Starting Application Insights');

        appInsights.setup(connectionString)
            .setAutoCollectConsole(true)
            .setSendLiveMetrics(true)
            .start();

        client = appInsights.defaultClient;
        client.context.tags[client.context.keys.cloudRole] = 'pcq-frontend';
        client.trackTrace({ message: 'App Insights activated' });

        // Safely delay context setup and re-enable features
        /*setTimeout(() => {
            client.context.tags[client.context.keys.cloudRole] = 'pcq-frontend';
            client.config.autoCollectConsole = true;
            client.config.setSendLiveMetrics = true;
            client.trackTrace({ message: 'App Insights activated' });
        }, 2000);*/
    } else {
        logger.warn('No Application Insights connection string found. Telemetry is disabled.');
        client = null;
    }
};

exports.trackTrace = function trackTrace(trace) {
    if (client) {
        client.trackTrace(trace);
    }
};

