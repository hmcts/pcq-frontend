import chai from 'chai';
import LaunchDarkly from 'app/components/launch-darkly.js';

const { expect } = chai;

describe('LaunchDarkly', () => {
    before(() => new LaunchDarkly().close());
    afterEach(() => new LaunchDarkly().close());

    it('should create a new launchdarkly instance', (done) => {
        const ld = new LaunchDarkly({offline: true}, true).getInstance();

        expect(ld.client).to.not.be.undefined;
        done();
    });

    it('should successfully close the LD connection and clear the instance', (done) => {
        const ld = new LaunchDarkly({offline: true});
        let instance = ld.getInstance();

        expect(instance).to.not.be.undefined;

        ld.close();
        instance = ld.getInstance();

        expect(instance).to.equal(null);
        done();
    });
});
