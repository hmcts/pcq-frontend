import Cookies from 'app/steps/ui/static/cookies/index.js';
import chai from 'chai';

const { expect } = chai;

describe('Cookies', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Cookies.getUrl();
            expect(url).to.equal('/cookies');
            done();
        });
    });
});
