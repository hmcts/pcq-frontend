'use strict';

const crypto = require('crypto');
const config = require('config');
const logger = require('app/components/logger')('Init');

const algorithmAesGcm256 = 'aes-256-gcm';
const algorithmAesCbc256 = 'aes-256-cbc';
const iv = Buffer.alloc(16, 0); // Initialization vector
const secureIvLength = 12;
const secureSaltLength = 16;
const secureKeyLength = 32;
const shouldLog = String(config.get('loggingEnabled')).toLowerCase() === 'true';

const generateToken = (params, algorithm) => {
    algorithm = algorithm || algorithmAesGcm256;
    const serviceId = params.serviceId;
    const tokenKey = config.tokenKeys[(serviceId || '').toLowerCase()];

    let encrypted = '';
    let authTag = '';

    if (!params.serviceId) {
        logError('serviceId is missing from the incoming parameters.');
    } else if (!tokenKey) {
        logError(`Token key is missing for service id: ${serviceId}`);
    } else {
        logger.info(`Using ${tokenKey === 'SERVICE_TOKEN_KEY' ? 'local' : 'Azure KV'} secret for service token key`);
        const key = crypto.scryptSync(tokenKey, 'salt', 32);
        const strParams = JSON.stringify(params);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        encrypted = cipher.update(strParams, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        if (algorithm === algorithmAesGcm256) {
            authTag = cipher.getAuthTag().toString('base64');
            if (shouldLog) {
                logger.info('Auth Tag : ' + authTag);
            }
        }
    }

    return {token: encrypted, authTag};

};

const generateSecureToken = (params) => {
    const serviceId = params.serviceId;
    const tokenKey = config.tokenKeys[(serviceId || '').toLowerCase()];

    let encrypted = '';
    let authTag = '';
    let randomIv = '';
    let salt = '';

    if (!params.serviceId) {
        logError('serviceId is missing from the incoming parameters.');
    } else if (tokenKey.length === 0) {
        logError(`Token key is missing for service id: ${serviceId}`);
    } else {
        logger.info(`Using ${tokenKey === 'SERVICE_TOKEN_KEY' ? 'local' : 'Azure KV'} secret for service token key`);
        const saltBuffer = crypto.randomBytes(secureSaltLength);
        const ivBuffer = crypto.randomBytes(secureIvLength);
        const key = crypto.scryptSync(tokenKey, saltBuffer, secureKeyLength);
        const strParams = JSON.stringify(params);
        const cipher = crypto.createCipheriv(algorithmAesGcm256, key, ivBuffer);

        encrypted = cipher.update(strParams, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        authTag = cipher.getAuthTag().toString('base64');
        randomIv = ivBuffer.toString('base64');
        salt = saltBuffer.toString('base64');

        if (shouldLog) {
            logger.info(`Auth Tag : ${authTag}, IV : ${randomIv}, Salt : ${salt}`);
        }
    }

    return {
        token: encrypted,
        authTag,
        iv: randomIv,
        salt
    };
};

const sameParams = (left, right) => {
    const leftKeys = Object.keys(left).sort((a, b) => a.localeCompare(b));
    const rightKeys = Object.keys(right).sort((a, b) => a.localeCompare(b));

    if (leftKeys.length !== rightKeys.length) {
        return false;
    }

    return leftKeys.every((key, index) => {
        return key === rightKeys[index] && String(left[key]) === String(right[key]);
    });
};

const verifySecureToken = (params, token, authTag, tokenIv, salt) => {
    const serviceId = params.serviceId;
    const tokenKey = config.tokenKeys[(serviceId || '').toLowerCase()];

    if (!serviceId || !tokenKey) {
        return false;
    }

    try {
        const saltBuffer = Buffer.from(salt, 'base64');
        const ivBuffer = Buffer.from(tokenIv, 'base64');
        const authTagBuffer = Buffer.from(authTag, 'base64');
        const key = crypto.scryptSync(tokenKey, saltBuffer, secureKeyLength);
        const decipher = crypto.createDecipheriv(algorithmAesGcm256, key, ivBuffer);
        decipher.setAuthTag(authTagBuffer);

        let decrypted = decipher.update(token, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        const tokenParams = JSON.parse(decrypted);
        return sameParams(tokenParams, params);
    } catch (error) {
        logger.warn(`Secure token verification failed: ${error.name}`);
        return false;
    }
};

const verifyToken = (reqQuery) => {
    const {token, authTag, iv: tokenIv, salt, ...params} = reqQuery;

    let verified = false;
    if (token) {
        const hasSecureTokenParams = Boolean(authTag && tokenIv && salt);
        if (hasSecureTokenParams) {
            verified = verifySecureToken(params, token, authTag, tokenIv, salt);
        }

        if (!verified) {
            const myToken = generateToken(params).token;
            verified = myToken === token;
        }

        if (verified) {
            logger.info('Token successfully verified.');
        } else {
            const myTokenLegacy = generateToken(params, algorithmAesCbc256).token;
            verified = myTokenLegacy === token;

            if (verified) {
                logger.info('Legacy token successfully verified.');
            } else {
                logError('Tokens mismatched.');
            }
        }
    } else {
        logError('Token is missing from the query string.');
    }

    return verified;
};

const logError = (error) => {
    logger.error('Error validating token: ' + error);
};

module.exports = {
    verifyToken: verifyToken,
    generateToken: generateToken,
    generateSecureToken: generateSecureToken
};
