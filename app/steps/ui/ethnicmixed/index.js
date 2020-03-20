'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class ApplicantEthnicBackgroundMixed extends ValidationStep {

    static getUrl() {
        return '/mixed-ethnic-group';
    }

    handlePost(ctx, errors) {
        if (ctx.ethnicity !== 8) {
            ctx.ethnicity_other = null;
        }
        return [ctx, errors];
    }

    nonIntegerFields() {
        return ['ethnicity_other'];
    }

}

module.exports = ApplicantEthnicBackgroundMixed;
