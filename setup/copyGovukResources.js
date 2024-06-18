const {copySync} = require('fs-extra');
const path = require('path');

const govukFrontend = require.resolve('govuk-frontend');
const govukDir = path.parse(govukFrontend).dir;

try {
    copySync(govukDir, 'public/govuk', {overwrite: true});
    copySync(govukDir + "/govuk-frontend.min.css", 'public/govuk/govuk-frontend.min.css', {overwrite: true});
    copySync(govukDir + "/govuk-frontend.min.js", 'public/govuk/govuk-frontend.min.js', {overwrite: true});
} catch (err) {
    console.error(err);
}
