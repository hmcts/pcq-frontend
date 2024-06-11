'use strict';

const {mapValues, map, reduce, escape, isObject, isEmpty, forEach, has} = require('lodash');
const UIStepRunner = require('app/core/runners/UIStepRunner');
const JourneyMap = require('app/core/JourneyMap');
const mapErrorsToFields = require('app/components/error').mapErrorsToFields;
const config = require('config');
const ServiceMapper = require('app/utils/ServiceMapper');
const FeatureToggle = require('app/utils/FeatureToggle');
const utils = require('app/components/step-utils');
const moment = require('moment');
const logger = require('app/components/logger');

class Step {

    static getUrl() {
        throw new ReferenceError('Step must override #url');
    }

    get name() {
        return this.constructor.name;
    }

    runner() {
        return new UIStepRunner();
    }

    get template() {
        if (!this.templatePath) {
            throw new TypeError(`Step ${this.name} has no template file in its resource folder`);
        }
        return `${this.templatePath}/template`;
    }

    get requiredFields() {
        return [];
    }

    constructor(steps, section, resourcePath, i18next, schema, language = 'en') {
        this.steps = steps;
        this.section = section || null;
        this.resourcePath = resourcePath;
        this.templatePath = `ui/${resourcePath}`;
        this.content = require(`app/resources/${language}/translation/${resourcePath}`);
        this.i18next = i18next;
    }

    next(req, ctx) {
        const journeyMap = new JourneyMap(req.session.journey);
        return journeyMap.nextStep(this, ctx);
    }

    nextStepUrl(req, ctx) {
        return config.app.basePath + this.next(req, ctx).constructor.getUrl();
    }

    getContextData(req, res, featureToggle, fieldsToClearOnPost = []) {
        const session = req.session;
        let ctx = {};
        Object.assign(ctx, session.ctx[this.section] || {});
        ctx.sessionID = req.sessionID;
        ctx = Object.assign(ctx, this.parseFields(req.body));

        if (req.method === 'POST') {
            forEach(fieldsToClearOnPost, (field) => {
                if (!has(req.body, field)) {
                    delete ctx[field];
                }
            });
        }

        ctx = FeatureToggle.appwideToggles(req, ctx, config.featureToggles.appwideToggles);

        return ctx;
    }

    handleGet(ctx) {
        return [ctx];
    }

    handlePost(ctx, errors) {
        // Set required fields to null if not set
        this.requiredFields.forEach(field => {
            if (!(field in ctx)) {
                ctx[field] = null;
            }
        });
        return [ctx, errors];
    }

    validate() {
        return [true, []];
    }

    isComplete() {
        return [this.validate()[0], 'noProgress'];
    }

    generateContent(ctx, formdata, language = 'en') {
        if (!this.content) {
            throw new ReferenceError(`Step ${this.name} has no content.json in its resource folder`);
        }
        const contentCtx = Object.assign({}, formdata, ctx, this.commonProps);
        this.i18next.changeLanguage(language);

        this.content = mapValues(this.content, (value, key) => this.i18next.t(`${this.resourcePath.replace(/\//g, '.')}.${key}`, contentCtx));

        if (formdata && formdata.serviceId && formdata.actor) {
            let variableContent;
            try {
                variableContent = require(`app/resources/${language}/translation/variable/${formdata.serviceId}`)[formdata.actor];
            } catch {
                logger().info(`Step ${this.name} has no variable-text.json file in its resource folder for service ${formdata.serviceId}`);
            }
            if (variableContent) {
                Object.assign(this.content, variableContent[this.section]);
            }
        }

        return this.content;
    }

    commonContent(language = 'en') {
        this.i18next.changeLanguage(language);
        const common = require(`app/resources/${language}/translation/common`);
        return mapValues(common, (value, key) => this.i18next.t(`common.${key}`));
    }

    generateFields(language, ctx, errors) {
        let fields = mapValues(ctx, (value, key) => {
            let returnValue;

            if (key.includes('formattedDate')) {
                const dateName = key.split('-')[0];
                const date = moment(ctx[`${dateName}-day`] + '/' + ctx[`${dateName}-month`] + '/' + ctx[`${dateName}-year`], config.dateFormat).parseZone();
                returnValue = date.isValid() ? utils.formattedDate(date, language) : null;
            } else {
                returnValue = isObject(value) ? value : escape(value);
            }

            return {
                value: returnValue,
                error: false
            };
        });
        if (!isEmpty(errors)) {
            fields = mapErrorsToFields(fields, errors);
        }
        return fields;
    }

    // Returns an array of fields which do not need to be parsed into integers
    nonIntegerFields() {
        return [];
    }

    parseFields(fields) {
        if (fields) {
            Object.keys(fields).forEach(field => {
                if (!this.nonIntegerFields().includes(field)) {
                    fields[field] = parseInt(fields[field]);
                }
            });
        }
        return fields;
    }

    // Returns an array of fields to be ignored by the form data
    ignoreFieldsOnPost() {
        return [];
    }

    persistFormData(formdata, sessionID, req) {
        const token = req.session.token;
        const correlationId = req.session.correlationId;
        const formData = ServiceMapper.map(
            'FormData',
            [config.services.pcqBackend.url, sessionID]
        );
        // Set the completed date
        formdata.completedDate = moment().toISOString();

        return formData.post(token, correlationId, formdata);
    }

    action(ctx, formdata) {
        delete ctx.sessionID;
        delete ctx.featureToggles;
        delete ctx._csrf;
        // We delete the optOut flag (if exists) in case the user had opted out but changed their mind.
        delete formdata.optOut;
        return [ctx, formdata];
    }

    anySoftStops(formdata, ctx) {
        const softStopsList = map(this.steps, step => step.isSoftStop(formdata, ctx));
        return reduce(softStopsList, (accumulator, nextElement) => {
            return accumulator || nextElement.isSoftStop;
        }, false);
    }

    isSoftStop() {
        return {
            'stepName': this.constructor.name,
            'isSoftStop': false
        };
    }

    setHardStop(ctx, reason) {
        ctx.stopReason = reason;
    }

    renderPage(res, html) {
        res.send(html);
    }
}

module.exports = Step;
