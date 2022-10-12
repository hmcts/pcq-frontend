/*
 * Decryption script
 */
'use strict';

const getParam = (param) => {
    const paramIndex = process.argv.indexOf(param);
    return paramIndex !== -1 ? process.argv[paramIndex + 1] : null;
};

const crypto = require('crypto');

const authTag = getParam('-at');
const algorithm = authTag ? 'aes-256-gcm' : 'aes-256-cbc';
const password = getParam('-p') || 'SERVICE_TOKEN_KEY';
const key = crypto.scryptSync(password, 'salt', 32);
const iv = Buffer.alloc(16, 0); // Initialization vector.

const token = getParam('-t');

// Check for token
if (!token) {
    throw Error('Token has not been passed! Set using \'-t\' flag.');
}

try {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    if (authTag) {
        decipher.setAuthTag(Buffer.from(authTag, 'base64'));
    }
    let decrypted = decipher.update(token, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    console.log('------------------------ PARAMETERS ------------------------');
    console.log(JSON.parse(decrypted));
    console.log('-----------------------------------------------------------');
} catch (error) {
    console.log('Error decrypting the ciphertext:');
    console.error(error.code, error.message);
}
