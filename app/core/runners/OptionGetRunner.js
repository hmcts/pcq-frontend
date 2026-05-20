'use strict';

const UIStepRunner = require('app/core/runners/UIStepRunner');
const translationLoader = require('app/components/translationLoader');

class OptionGetRunner extends UIStepRunner {

    handleGet(step, req, res) {
        if (req.params[0] === 'redirect') {
            const ctx = step.getContextData(req);
            res.redirect(step.nextStepUrl(req, ctx));
        } else {
            return super.handleGet(step, req, res);
        }
    }

    handlePost(step, req, res) {
        const commonContent = translationLoader.getCommonTranslation(req.session.language);

        req.log.error('Post operation not defined for OptionGetRunner');
        res.status(404);
        res.render('errors/error', {common: commonContent, error: '404'});
    }
}

module.exports = OptionGetRunner;
