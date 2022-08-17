'use strict';

const {get} = require('lodash');
const steps = require('app/core/initSteps').steps;

class JourneyMap {
    constructor(journey) {
        this.journey = journey;
        if (journey.skipList) {
            this.skipList = journey.skipList;
        }
    }

    nextOptionStep(currentStep, ctx) {
        const match = currentStep
            .nextStepOptions(ctx).options
            .find((option) => get(ctx, option.key) === option.value);
        return match ? match.choice : 'otherwise';
    }

    nextStep(currentStep, ctx) {
        let nextStepName = this.journey.stepList[currentStep.name];
        if (nextStepName !== null && typeof nextStepName === 'object') {
            nextStepName = nextStepName[this.nextOptionStep(currentStep, ctx)];
        }

        return this.skipList ? this.skipListNextStep(nextStepName, ctx) : steps[nextStepName];
    }

    skipListNextStep(nextStepName, ctx) {
        const skipStep = this.skipList.find(skipItem => skipItem.stepName === nextStepName);
        if (skipStep) {
            if (skipStep.nextStepName) {

                /*
                 * If the skip step specifies the next step we rerun the function on that 'next step' to process any
                 * linked skip steps.
                 *
                 * For example:
                 * {stepName: 'ApplicantDateOfBirth', nextStepName: 'ApplicantSex'},
                 * {stepName: 'ApplicantSex', nextStepName: 'ApplicantSexualOrientation'}
                 */
                return this.skipListNextStep(skipStep.nextStepName, ctx);
            }
            return this.nextStep(steps[nextStepName], ctx);
        }
        return steps[nextStepName];
    }

    stepList() {
        return this.journey.stepList;
    }
}

module.exports = JourneyMap;
