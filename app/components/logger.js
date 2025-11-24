'use strict';

const winston = require('winston');
const Transport = require('winston-transport');
const appInsights = require('applicationinsights');

class AppInsightsTransport extends Transport {
    log(info, callback) {
        setImmediate(() => this.emit('logged', info));

        const client = appInsights.defaultClient;
        if (client) {
            client.trackTrace({
                message: info.message,
                properties: {
                    level: info.level,
                    sessionId: info.sessionId,
                    ...info.meta
                }
            });
        }

        callback();
    }
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
            const meta = info.meta ? JSON.stringify(info.meta) : '';
            return `${info.timestamp} ${info.level} [sessionId: ${info.sessionId}] ${info.message} ${meta}`;
        })
    ),
    transports: [
        new winston.transports.Console({level: 'info'}),
        new AppInsightsTransport({level: 'info'})
    ]
});

module.exports = function(sessionId) {
    return logger.child({ sessionId });
};
