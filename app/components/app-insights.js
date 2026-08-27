'use strict';

const appInsights = require('applicationinsights');

let client;

exports.initAppInsights = function initAppInsights(connectionString) {
    if (!connectionString) {
        return;
    }
    appInsights.setup(connectionString)
        .setAutoCollectConsole(false)
        .setAutoCollectDependencies(false)
        .setAutoCollectPerformance(false)
        .setSendLiveMetrics(false)
        .start();

    client = appInsights.defaultClient;
    client.trackTrace({message: 'Application Insights started'});
};

exports.trackTrace = function trackTrace(trace) {
    if (!client) {
        console.warn('trackTrace called before AppInsights client initialised, dropped trace: ', trace);
        return;
    }
    if (typeof trace === 'string') {
        client.trackTrace({message: trace});
    } else {
        client.trackTrace(trace);
    }
};

