import MultiPartValidationStep from 'app/core/steps/MultiPartValidationStep.js';
import ValidWithFields from './ValidWithFields.js';

class TestStep extends MultiPartValidationStep {

    static getUrl() {
        return '/test';
    }

    childSteps() {
        return [ValidWithFields];
    }

    deleteChildFields(ctx) {
        return ctx.test === 1;
    }
}

export default TestStep;
