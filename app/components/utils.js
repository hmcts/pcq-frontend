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

exports.getStore = (redisConfig, session) => {
    if (redisConfig.enabled === 'true') {
        const Redis = require('ioredis');
        const connectRedis = require('connect-redis');
        const RedisStore = connectRedis.default ? connectRedis.default : connectRedis;
        const tlsOptions = {
            password: redisConfig.password,
            tls: true
        };
        const redisOptions = redisConfig.useTLS === 'true' ? tlsOptions : {};
        const client = new Redis(redisConfig.port, redisConfig.host, redisOptions);

        // Azure Cache for Redis has issues with a 10 minute connection idle timeout, the recommendation is to keep the connection alive
        // https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-node-js-md
        let keepAliveInterval;
        
        client.on('ready', () => {
                if (redisConfig.keepAlive !== 'false') {
                    keepAliveInterval = setInterval(() => {
                    client.ping();
                }, 60000); // 60s
            }
        });
        client.on('end', () => {
            if (keepAliveInterval) {
                clearInterval(keepAliveInterval);
            }
        });


        return new RedisStore({client});
    }
    const MemoryStore = require('express-session').MemoryStore;
    return new MemoryStore();
};
