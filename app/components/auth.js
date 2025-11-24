'use strict';

const jwt = require('jsonwebtoken');
const config = require('config');

const createToken = (req, partyId, payload = {}) => {
    const conf = config.auth.jwt;

    payload.authorities = [];
    const token = jwt.sign(payload, conf.secret, {subject: partyId, expiresIn: conf.ttl});

    req.session.token = token;
    return token;
};

module.exports = {
    createToken: createToken
};
