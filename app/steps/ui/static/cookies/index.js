'use strict';

const Step = require('app/core/steps/Step');

class Cookies extends Step {

    static getUrl() {
        return '/cookies';
    }

    get template() {
        if (!this.templatePath) {
            throw new TypeError(`Step ${this.name} has no template file in its resource folder`);
        }
        return `${this.templatePath}/${this.templateName}`;
    }

    getContextData(req, res, featureToggle, fieldsToClearOnPost = []) {
        this.templateName = req.session.featureToggles.ft_new_cookie_banner ? 'new-template' : 'old-template';
        return super.getContextData(req, res, featureToggle, fieldsToClearOnPost);
    }
}

module.exports = Cookies;
