'use strict';

const co = require('co');
const {curry, isEmpty, forEach, omit, set} = require('lodash');
const FormatUrl = require('app/utils/FormatUrl');

class UIStepRunner {

    constructor() {
        this.GET = curry(this.handleGet);
        this.POST = curry(this.handlePost);
    }

    handleGet(step, req, res) {
        let errors = req.session.ctx.errors || null;
        const session = req.session;
        const formdata = session.form;
        const commonContent = require(`app/resources/${session.language}/translation/common`);

        return co(function* () {
            let ctx = step.getContextData(req, res);
            const featureToggles = session.featureToggles;
            [ctx, errors] = yield step.handleGet(ctx, formdata, featureToggles, session.language);
            forEach(errors, (error) =>
                req.log.info({type: 'Validation Message', url: step.constructor.getUrl()}, JSON.stringify(error))
            );
            errors = errors ? errors.concat(req.session.ctx.errors) : req.session.ctx.errors;
            delete req.session.ctx.errors;

            const content = step.generateContent(ctx, formdata, session.language);
            const fields = step.generateFields(session.language, ctx, errors, formdata);
            if (req.query.source === 'back') {
                session.back.pop();
            } else if (session.back[session.back.length - 1] !== step.constructor.getUrl()) {
                session.back.push(step.constructor.getUrl());
            }
            const common = step.commonContent(session.language);
            const app = {cookieManagerV1: false};
            if (ctx.featureToggles) {
                if (ctx.featureToggles.ft_dtrum_session_properties === 'true') {
                    app.serviceId = session.form.serviceId;
                    app.version = res.locals.releaseVersion;
                }
                if (ctx.featureToggles.ft_cookie_manager_v1 === 'true') {
                    app.cookieManagerV1 = true;
                }
            }
            res.render(step.template, {content, fields, errors, common, app}, (err, html) => {
                if (err) {
                    req.log.error(err);
                    return res.status(500).render('errors/error', {common: commonContent, error: '500'});
                }
                step.renderPage(res, html);
            });
        }).catch((error) => {
            req.log.error(error);
            res.status(500).render('errors/error', {common: commonContent, error: '500'});
        });
    }

    handlePost(step, req, res) {
        const session = req.session;
        let formdata = session.form;
        formdata.pcqAnswers = formdata.pcqAnswers || {};
        const commonContent = require(`app/resources/${session.language}/translation/common`);

        return co(function* () {
            let ctx = step.getContextData(req, res);
            let [isValid, errors] = [];
            [isValid, errors] = step.validate(ctx, formdata, session.language);
            const featureToggles = session.featureToggles;
            if (isValid) {
                [ctx, errors] = yield step.handlePost(ctx, errors, formdata, req.session, FormatUrl.createHostname(req), featureToggles);
            }

            if (isEmpty(errors)) {
                const nextStepUrl = step.nextStepUrl(req, ctx);
                [ctx, formdata] = step.action(ctx, formdata);

                // Gets the difference between the session ctx fields for the session and the current context.
                const removedFields = Object.keys(session.ctx[step.section] || {})
                    .filter(key => !Object.keys(ctx).includes(key));
                // Remove these fields from the form data
                removedFields.forEach(field => delete formdata.pcqAnswers[field]);

                // Add the current section context to the session context.
                set(session.ctx, step.section, ctx);

                // Assign the field data to the form (omitting any fields specified to ignore)
                Object.assign(formdata.pcqAnswers, omit(ctx, step.ignoreFieldsOnPost()));

                const result = yield step.persistFormData(formdata, session.id, req);

                if (result.name === 'Error') {
                    req.log.error('Could not persist user data', result.message);
                } else if (result) {
                    session.form = Object.assign(session.form, result);
                    req.log.info('Successfully persisted user data');
                }

                if (session.back[session.back.length - 1] !== step.constructor.getUrl()) {
                    session.back.push(step.constructor.getUrl());
                }

                res.redirect(nextStepUrl);
            } else {
                session.ctx.errors = errors;
                set(session.ctx, step.section, ctx);

                res.redirect(303, step.constructor.getUrl());
            }
        }).catch((error) => {
            req.log.error(error);
            const ctx = step.getContextData(req, res);
            const fields = step.generateFields(req.session.language, ctx, [], {});
            res.status(500).render('errors/error', {fields, common: commonContent, error: '500'});
        });
    }
}

module.exports = UIStepRunner;
