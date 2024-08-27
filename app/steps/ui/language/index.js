'use strict';

const MultiPartValidationStep = require('app/core/steps/MultiPartValidationStep');
const ApplicantEnglishLevel = require('app/steps/ui/englishlevel/index');
const appInsights = require('app/components/app-insights');

class ApplicantLanguage extends MultiPartValidationStep {

    static getUrl() {
        return '/language';
    }

    childSteps() {
        return [ApplicantEnglishLevel];
    }

    deleteChildFields(ctx) {
        return ctx.language_main !== 2;
    }

    get requiredFields() {
        return ['language_main'];
    }

    action(ctx, formdata) {
        if (ctx.language_main !== 2 && ctx.language_other) {
            delete ctx.language_other;
        }
        return super.action(ctx, formdata);
    }

    nonIntegerFields() {
        return ['language_other'];
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'language_main', value: 2, choice: 'otherLanguage'}
            ]
        };
    }

    handleGet(ctx,session) {
        appInsights.trackTrace({message: 'User on language page', properties: {['ServiceId']:session.serviceId}});      
        return super.handleGet(ctx);
    }
}

module.exports = ApplicantLanguage;
