'use strict';

const jwt = require('jsonwebtoken');
const config = require('config');

const createToken = (req, partyId, payload = {}) => {
    const conf = config.auth.jwt;

    payload.authorities = [];
    const token = jwt.sign(payload, conf.secret, {
        subject: partyId,
        expiresIn: conf.ttl,
        issuer: conf.issuer,
        audience: conf.audience
    });

    req.session.token = token;
    return token;
};

module.exports = {
    createToken: createToken
};
