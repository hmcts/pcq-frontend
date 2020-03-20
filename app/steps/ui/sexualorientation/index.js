'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class ApplicantSexualOrientation extends ValidationStep {

    static getUrl() {
        return '/sexual-orientation';
    }

    handlePost(ctx, errors) {
        if (ctx.sexuality !== 4 && ctx.sexuality_other) {
            delete ctx.sexuality_other;
        }
        return [ctx, errors];
    }

    nonIntegerFields() {
        return ['sexuality_other'];
    }

}

module.exports = ApplicantSexualOrientation;
