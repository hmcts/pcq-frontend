'use strict';

const logger = require('app/components/logger')('Init');

exports.forceHttps = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        // 302 temporary - this is a feature that can be disabled
        let url;
        try{
            url = new URL(`https://${req.get('Host')}${req.url}`);
        } catch(err){
            logger.error(err);
            url = new URL(`https://${req.get('Host')}/offline`);
        }
        return res.redirect(302, url);
    }
    next();
};


exports.getStore = (redisConfig,
    session,
    deps = {}   // optional dependencies
    ) => {
        if (redisConfig.enabled === 'true') {
            const Redis = deps.Redis || require('ioredis');
            const connectRedis = deps.connectRedis || require('connect-redis');
            //const RedisStore = connectRedis.default ?? connectRedis;
            const RedisStore = connectRedis.default; 

        const redisOptions = {
            host: redisConfig.host,
            port: redisConfig.port
        };

        if (redisConfig.useTLS === 'true') {
            redisOptions.password = redisConfig.password;
            redisOptions.tls = {};
        }

        const client = new Redis(redisOptions);

        // Azure Redis idle timeout workaround
        let keepAliveInterval;
        client.on('ready', () => {
            if (redisConfig.keepAlive !== 'false') {
                keepAliveInterval = setInterval(() => {
                    client.ping().catch(() => {});
                }, 60000); // 60s
            }
        });

        // Clean up interval when client closes
        client.on('end', () => {
            if (keepAliveInterval) {
                clearInterval(keepAliveInterval);
            }
        });

        return new RedisStore({ client });
    }
    const MemoryStore = require('express-session').MemoryStore;
    return new MemoryStore();
};
