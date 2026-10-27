import MultiPartValidationStep from 'app/core/steps/MultiPartValidationStep.js';
import StartPage from 'app/steps/ui/startpage/index.js';
import ValidWithFields from './ValidWithFields.js';

/**
 * We are using StartPage for this test as it does not inherit from MultiPartValidationStep.
 */
class InvalidChildSteps extends MultiPartValidationStep {

    static getUrl() {
        return '/test';
    }

    childSteps() {
        return [StartPage, ValidWithFields];
    }

    deleteChildFields() {
        return true;
    }
}

export default InvalidChildSteps;
