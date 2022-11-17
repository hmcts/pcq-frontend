const appInsights = require('applicationinsights');
const Sender = require('applicationinsights/out/Library/Sender');
const logger = require('app/components/logger')('Init');
const config = require('config');
const path = require('path');
const fs = require('fs');
const os = require('os');

function enable() {
    const instrumentationKey = config.get('appInsights.instrumentationKey');

    if (instrumentationKey) {
        createTempDir();

        logger.info('Starting App Insights');

        appInsights.setup(instrumentationKey)
            .setSendLiveMetrics(true)
            .setAutoCollectConsole(true, true)
            .start();

        appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'pcq-frontend';
        appInsights.defaultClient.trackTrace({message: 'App insights activated'});
    }

    function createTempDir() {
        const tempDir = path.join(os.tmpdir(), Sender.TEMPDIR_PREFIX + config.get('appInsights.instrumentationKey'));

        if (!fs.existsSync(tempDir)) {
            logger.info('Creating App Insights temp dir');
            fs.mkdirSync(tempDir);
        }
    }
}

module.exports = enable;
