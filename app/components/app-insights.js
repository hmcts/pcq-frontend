'use strict';

const appInsights = require('applicationinsights');
const logger = require('app/components/logger')('Init');
const config = require('config');
const path = require('path');
const fs = require('fs');
const os = require('os');

let client ;
const instrumentationKey = config.get('appInsights.instrumentationKey');
const connectionString = config.get('appInsights.connectionString');
const TEMPDIR_PREFIX = 'appInsights-node';

exports.initAppInsights = function initAppInsights() {
    if (instrumentationKey) {
        createTempDir();

        logger.info('Starting App Insights');

        appInsights.setup(connectionString)
            .setSendLiveMetrics(true)
            .setAutoCollectConsole(true, true)
            .start();
        
        client = appInsights.defaultClient;
        setImmediate(() => {
            client.context.tags[client.context.keys.cloudRole] = 'pcq-frontend';
            client.trackTrace({message: 'App insights activated' });
        });
        
    } else {
        client = null;
    }

    function createTempDir() {
        const tempDir = path.join(os.tmpdir(), TEMPDIR_PREFIX + instrumentationKey);

        if (!fs.existsSync(tempDir)) {
            logger.info('Creating App Insights temp dir');
            fs.mkdirSync(tempDir);
        }
    }
};

exports.trackTrace = function trackTrace(trace){
    if(instrumentationKey && client){
        client.trackTrace(trace);
    }
};
