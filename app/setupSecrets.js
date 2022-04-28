const config = require('@hmcts/properties-volume').addTo(require('config'));
const {get, set} = require('lodash');

const setSecret = (secretPath, configPath) => {
    if (config.has(secretPath)) {
        set(config, configPath, get(config, secretPath));
    }
};

const setupSecrets = () => {
    if (config.has('secrets.pcq')) {
        setSecret('secrets.pcq.frontend-redis-access-key', 'redis.password');
        setSecret('secrets.pcq.jwt-secret', 'auth.jwt.secret');
        setSecret('secrets.pcq.AppInsightsInstrumentationKey', 'appInsights.instrumentationKey');
        setSecret('secrets.pcq.launchdarkly-key', 'featureToggles.launchDarklyKey');
        setSecret('secrets.pcq.launchdarkly-user-key', 'featureToggles.launchDarklyUser.key');
        // ------------------------------------------ Token Keys ------------------------------------------
        setSecret('secrets.pcq.probate-token-key', 'tokenKeys.probate'); // Probate
        setSecret('secrets.pcq.cmc-token-key', 'tokenKeys.cmc'); // CMC
        setSecret('secrets.pcq.divorce-token-key', 'tokenKeys.divorce'); // Divorce
        setSecret('secrets.pcq.nfd-token-key', 'tokenKeys.new_divorce_law'); // No Fault Divorce
        setSecret('secrets.pcq.sscs-token-key', 'tokenKeys.sscs'); // SSCS
        setSecret('secrets.pcq.iac-token-key', 'tokenKeys.iac'); // IAC
        setSecret('secrets.pcq.adoption-token-key', 'tokenKeys.adoption'); // ADOPTION
        setSecret('secrets.pcq.et-token-key', 'tokenKeys.et'); // ET
    }
};

module.exports = setupSecrets;
