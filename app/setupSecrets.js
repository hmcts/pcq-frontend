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
        setSecret('secrets.pcq.app-insights-connection-string', 'appInsights.connectionString');
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
        setSecret('secrets.pcq.online-plea-token-key', 'tokenKeys.online_plea'); // online_plea
        setSecret('secrets.pcq.specialtribunals-cic-token-key', 'tokenKeys.specialtribunals_cic'); // Special Tribunals
        setSecret('secrets.pcq.jurordigital-token-key', 'tokenKeys.jurordigital'); // Juror Digital
        setSecret('secrets.pcq.prl-token-key', 'tokenKeys.prl_ca'); // prl_ca
        setSecret('secrets.pcq.civil-citizen-ui-token-key', 'tokenKeys.civil-citizen-ui'); // civil-citizen-ui
    }
};

module.exports = setupSecrets;
