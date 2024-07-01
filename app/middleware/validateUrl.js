'use strict';

const validateUrl = (req) => {
    const redirect = req.session.returnUrl || '/offline';
    let givenUrl ;
    try {
        givenUrl = new URL (redirect);
    } catch (error) {
        req.log.error(error);
        givenUrl = '/offline';
    }
    return givenUrl;
};

module.exports = validateUrl;