'use strict';

const fs = require('fs');
const path = require('path');

const cache = new Map();

const readJson = (relativePath) => {
    if (cache.has(relativePath)) {
        return cache.get(relativePath);
    }

    const absolutePath = path.join(__dirname, '..', relativePath);
    const content = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
    cache.set(relativePath, content);
    return content;
};

const getStepTranslation = (language, resourcePath) => {
    return readJson(path.join('resources', language, 'translation', `${resourcePath}.json`));
};

const getVariableTranslation = (language, serviceId) => {
    return readJson(path.join('resources', language, 'translation', 'variable', `${serviceId}.json`));
};

const getCommonTranslation = (language) => {
    return readJson(path.join('resources', language, 'translation', 'common.json'));
};

module.exports = {
    getStepTranslation,
    getVariableTranslation,
    getCommonTranslation
};
