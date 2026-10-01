import Accessibility from 'app/steps/ui/static/accessibility/index.js';
import chai from 'chai';

const { expect } = chai;

describe('Accessibility', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Accessibility.getUrl();
            expect(url).to.equal('/accessibility-statement');
            done();
        });
    });
});
