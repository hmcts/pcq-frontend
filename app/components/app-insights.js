'use strict';

const appInsights = require('applicationinsights');
const Sender = require('applicationinsights/out/Library/Sender');
const logger = require('app/components/logger')('Init');
const config = require('config');
const path = require('path');
const fs = require('fs');
const os = require('os');

let client ;

exports.initAppInsights = function initAppInsights() {
    const instrumentationKey = config.get('appInsights.instrumentationKey');

    if (instrumentationKey) {
        createTempDir();

        logger.info('Starting App Insights');

        appInsights.setup(instrumentationKey)
            .setSendLiveMetrics(true)
            .setAutoCollectConsole(true, true)
            .start();

        client = appInsights.defaultClient;
        client.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'pcq-frontend';
        client.trackTrace({message: 'App insights activated'});
    } else {
        client = null;
    }

    function createTempDir() {
        const tempDir = path.join(os.tmpdir(), Sender.TEMPDIR_PREFIX + instrumentationKey);

        if (!fs.existsSync(tempDir)) {
            logger.info('Creating App Insights temp dir');
            fs.mkdirSync(tempDir);
        }
    }
}

exports.trackTrace = function trackTrace(message,properties){
    if(client){
        client.trackTrace({message: message,properties: properties});
    }
}
