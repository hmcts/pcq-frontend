import TermsConditions from 'app/steps/ui/static/terms/index.js';
import chai from 'chai';

const { expect } = chai;

describe('TermsConditions', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = TermsConditions.getUrl();
            expect(url).to.equal('/terms-conditions');
            done();
        });
    });
});
