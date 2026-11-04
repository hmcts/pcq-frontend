import ValidationStep from './ValidationStep.js';
import logger from '../../components/logger.js';

class MultiPartValidationStep extends ValidationStep {
    static fields() {
        return [];
    }

    childSteps() {
        return [];
    }

    deleteChildFields() {
        return false;
    }

    /**
     * Check if all the specified child steps are valid.
     * Child steps are valid if they inherit from MultiPartValidationStep
     *
     * @returns {boolean} valid
     */
    validChildSteps() {
        let valid = true;
        for (const child of this.childSteps()) {
            if (!(child.prototype instanceof MultiPartValidationStep)) {
                logger().error(`Child step ${child.name}, specified in ${this.name}, does not inherit MultiPartValidationStep`);
                valid = false;
            }
        }
        return valid;
    }

    action(ctx, formdata) {
        [ctx, formdata] = super.action(ctx, formdata);
        if (formdata.pcqAnswers && this.validChildSteps() && this.deleteChildFields(ctx)) {
            // For each of the child steps
            for (const step of this.childSteps()) {
                // Remove the fields from the form data
                for (const field of step.fields()) {
                    delete formdata.pcqAnswers[field];
                }
            }
        }
        return [ctx, formdata];
    }
}

export default MultiPartValidationStep;
export {MultiPartValidationStep as 'module.exports'};
