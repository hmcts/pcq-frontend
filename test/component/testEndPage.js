import TestWrapper from 'test/util/TestWrapper.js';

describe('EndPage', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('EndPage');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });
    });
});
