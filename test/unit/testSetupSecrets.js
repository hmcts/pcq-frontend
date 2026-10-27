import chai from 'chai';
import lodash from 'lodash';
import config from 'config';
import rewire from 'rewire';

const { expect } = chai;
const { cloneDeep } = lodash;

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
            const setupSecrets = rewire(modulePath);
            setupSecrets.__set__('config', mockConfig);
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
            const setupSecrets = rewire(modulePath);
            setupSecrets.__set__('config', mockConfig);
            setupSecrets();

            expect(mockConfig.redis.password)
                .to.equal('dummy_password');
        });

        it('should only set one config value when single secret path is set', () => {
            mockConfig.secrets = {pcq: {
                'jwt-secret': 'jwtValue',
            }};

            // Update config with secret setup
            const setupSecrets = rewire(modulePath);
            setupSecrets.__set__('config', mockConfig);
            setupSecrets();

            expect(mockConfig.redis.password)
                .to.equal('dummy_password');
            expect(mockConfig.auth.jwt.secret)
                .to.equal(mockConfig.secrets.pcq['jwt-secret']);
        });
    });
});
