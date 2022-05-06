'use strict';

const Step = require('app/core/steps/Step');

class StartPage extends Step {

    static getUrl () {
        return '/start-page';
    }

    generateContent(ctx, formdata, language = 'en') {
        const content = super.generateContent(ctx, formdata, language);
        content.dtrumOptOut = Boolean(ctx.featureToggles && ctx.featureToggles.ft_dtrum_opt_out === 'true');
        return content;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        if (req.session.returnUrl) {
            ctx.returnUrl = `${req.session.returnUrl}`;
        }

        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.returnUrl;
        return [ctx, formdata];
    }
}

module.exports = StartPage;
