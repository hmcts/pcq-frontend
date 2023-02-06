const path = require('path');

module.exports = {
    entry: './app/assets/javascripts/cookie.js',
    output: {
        path: path.resolve(__dirname, 'public/javascripts'),
        filename: 'cookie_bundle.js',
    },
};
