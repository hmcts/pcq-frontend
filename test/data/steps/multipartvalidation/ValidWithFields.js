import MultiPartValidationStep from 'app/core/steps/MultiPartValidationStep.js';

class ValidWithFields extends MultiPartValidationStep {

    static getUrl() {
        return '/test';
    }

    static fields() {
        return ['test1', 'test2', 'test3'];
    }
}

export default ValidWithFields;
