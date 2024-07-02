'use strict';

const TestWrapper = require('test/util/TestWrapper');

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
