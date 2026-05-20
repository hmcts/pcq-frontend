'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('config');
const translationLoader = require('app/components/translationLoader');
const commonContent = translationLoader.getCommonTranslation('en');

describe('terms-conditions', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('TermsConditions');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page', (done) => {
            const contentData = {
                privacyLink: config.links.privacy,
                cookiesLink: config.links.cookies,
                helpLineNumber: commonContent.helpTelephoneNumber,
                helpLineHours: commonContent.helpTelephoneOpeningHours,
                callChargesLink: config.links.callCharges
            };

            testWrapper.testContent(done, contentData);
        });
    });
});
