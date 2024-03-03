'use strict';

exports.forceHttps = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        // 302 temporary - this is a feature that can be disabled
        return res.redirect(302, `https://${req.get('Host')}${req.url}`);
    }
    next();
};

exports.getStore = (redisConfig) => {
    if (redisConfig.enabled === 'true') {
        const Redis = require('ioredis');
        const RedisStore = require('connect-redis').default;
        const tlsOptions = {
            password: redisConfig.password,
            tls: true,
            rejectUnauthorized: false
        };
        const redisOptions = redisConfig.useTLS === 'true' ? tlsOptions : {};
        const client = new Redis(redisConfig.port, redisConfig.host, redisOptions);

        // Azure Cache for Redis has issues with a 10 minute connection idle timeout, the recommendation is to keep the connection alive
        // https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-node-js-md
        client.on('ready', () => {
            setInterval(() => {
                client.ping();
            }, 60000); // 60s
        });

        return new RedisStore({client});
    }
    const MemoryStore = require('express-session').MemoryStore;
    return new MemoryStore();
};
