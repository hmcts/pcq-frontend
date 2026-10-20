'use strict';

const pathWhitelist = new Set([
    '/offline',
    // Invoker
    '/invoker', '/invoker/formFiller', '/invoker/genToken',
    // Static Pages
    '/cookies', '/privacy-policy', '/accessibility-statement', '/terms-conditions'
]);

const validateParams = (req, res, next) => {
    if (req.session.validParameters || pathWhitelist.has(req.path)) {
        next();
    } else {
        res.redirect('/offline');
    }
};

module.exports = validateParams;
