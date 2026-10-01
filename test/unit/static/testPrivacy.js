import Privacy from 'app/steps/ui/static/privacy/index.js';
import chai from 'chai';

const { expect } = chai;

describe('PrivacyPolicy', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Privacy.getUrl();
            expect(url).to.equal('/privacy-policy');
            done();
        });
    });
});
