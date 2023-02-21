const {copySync} = require('fs-extra');
const path = require('path');

const govukFrontend = require.resolve('govuk-frontend');
const govukDir = path.parse(govukFrontend).dir;

try {
    copySync(govukDir, 'public/govuk', {overwrite: true});
} catch (err) {
    console.error(err);
}
