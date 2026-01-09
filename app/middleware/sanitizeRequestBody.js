const sanitizeHtml = require('sanitize-html');
const traverse = require('traverse');
const emoji = require('node-emoji');
const {flow} = require('lodash');

const sanitizeRequestBody = (req, res, next) => {
    const santizeValue = flow([
        emoji.strip,
        (value) => sanitizeHtml(value, {allowedTags: [], allowedAttributes: {}})
    ]);

    traverse(req.body).forEach(function sanitizeValue(value) {
        if (this.isLeaf && typeof (value) === 'string') {
            const sanitizedValue = santizeValue(value);
            this.update(sanitizedValue);
        }
    });
    next();
};

module.exports = sanitizeRequestBody;
