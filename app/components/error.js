'use strict';

const {filter, isEqual, map, uniqWith} = require('lodash');
const i18next = require('i18next');
const init18next = require('app/core/initSteps').initI18Next;

const FieldError = (param, keyword, resourcePath, contentCtx = {}, language = 'en') => {
    if (!i18next.isInitialized) {
        init18next();
        i18next.changeLanguage(language);
    }

    const key = `errors.${param}.${keyword}`;
    const errorPath = `${resourcePath.replace('/', '.')}.${key}`;

    return {
        field: param,
        href: `#${param}`,
        msg: {
            summary: i18next.t(`${errorPath}.summary`, contentCtx),
            message: i18next.t(`${errorPath}.message`, contentCtx)
        }
    };
};

const generateErrors = (errs, ctx, formdata, errorPath, language = 'en') => {
    i18next.changeLanguage(language);
    const contentCtx = {...formdata, ...ctx};
    if (errs.find((e) => e.keyword === 'oneOf')) {
        return [FieldError('crossField', 'oneOf', errorPath, contentCtx, language)];
    }
    errs = filter(errs, ((e) => e.keyword !== 'oneOf'));
    const errors = map(errs, (e) => {
        let param;
        try {
            if (e.keyword === 'required' || e.keyword === 'switch' || e.keyword === 'dependencies') {
                param = e.params.missingProperty;
                return FieldError(param, 'required', errorPath, ctx, language);
            }
            param = extractErrorParam(e);

            param = stripBrackets(param, e);

            return FieldError(param, 'invalid', errorPath, ctx, language);

        } catch {
            throw new ReferenceError(`Error messages have not been defined for Step in content.json for errors.${param}`);
        }
    });
    return uniqWith(errors, isEqual);
};

const stripBrackets = (param, e) => {
    const path = e.instancePath || '';
    if (!param && path.includes('[\'') && path.includes('\']')) {
        return path.replace(/\['|']/g, '');
    }
    return param;
};

const extractErrorParam = (e) => {
    if (e.params && e.params.missingProperty) {
        return e.params.missingProperty;
    }

    if (e.instancePath) {
        const [, firstSegment] = e.instancePath.split('/');
        return firstSegment;
    }

    return undefined;
};

const populateErrors = (errors) => {
    let err = [];

    if (Array.isArray(errors[0])) {
        errors.forEach((error) => {
            error[1].forEach((e) => {
                err.push(e);
            });
        });
    } else {
        err = errors;
    }

    return err;
};

const mapErrorsToFields = (fields, errors = []) => {
    const err = populateErrors(errors);

    err.forEach((e) => {
        if (!fields[e.field]) {
            fields[e.field] = {};
        }
        fields[e.field].error = true;
        fields[e.field].errorMessage = e.msg;
        fields[e.field].href = e.href;
    });

    return fields;
};

module.exports = FieldError;
module.exports.generateErrors = generateErrors;
module.exports.mapErrorsToFields = mapErrorsToFields;
