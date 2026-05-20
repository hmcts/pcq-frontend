const expect = require('chai').expect;
const {cloneDeep} = require('lodash');
const config = require('config');
const Proxyquire = require('proxyquire/lib/proxyquire');
const proxyquire = new Proxyquire(module).callThru();

const modulePath = 'app/setupSecrets';

let mockConfig = {};

describe(modulePath, () => {
    describe('#setup', () => {
        beforeEach(() => {
            mockConfig = cloneDeep(config);
        });

        it('should set config values when secrets path is set', () => {
            mockConfig.secrets = {
                pcq: {
                    'frontend-redis-access-key': 'redisValue',
                    'jwt-secret': 'jwtValue',
                }
            };

            // Update config with secret setup
            const setupSecrets = proxyquire(modulePath,
                {config: mockConfig});
            setupSecrets();

            expect(mockConfig.redis.password)
                .to.equal(mockConfig.secrets.pcq['frontend-redis-access-key']);
            expect(mockConfig.auth.jwt.secret)
                .to.equal(mockConfig.secrets.pcq['jwt-secret']);
        });

        it('should not set config values when secrets path is not set', () => {
            // Update config with secret setup
            mockConfig.secrets = {
                pcq: {
                }
            };
            const setupSecrets = proxyquire(modulePath,
                {config: mockConfig});
            setupSecrets();

            expect(mockConfig.redis.password)
                .to.equal('dummy_password');
        });

        it('should only set one config value when single secret path is set', () => {
            mockConfig.secrets = {pcq: {
                'jwt-secret': 'jwtValue',
            }};

            // Update config with secret setup
            const setupSecrets = proxyquire(modulePath,
                {config: mockConfig});
            setupSecrets();

            expect(mockConfig.redis.password)
                .to.equal('dummy_password');
            expect(mockConfig.auth.jwt.secret)
                .to.equal(mockConfig.secrets.pcq['jwt-secret']);
        });
    });
});
