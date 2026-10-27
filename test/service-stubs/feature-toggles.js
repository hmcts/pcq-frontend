import config from 'config';
import express from 'express';
import loggerFactory from 'app/components/logger.js';

const router = express.Router();
const logger = loggerFactory('Init');
const app = express();
const featureTogglesPort = config.featureToggles.port;

const featureToggles = {
    'protected-characteristics-shutter': false
};

Object.entries(featureToggles).forEach(([key, value]) => {
    router.get(`${config.featureToggles.path}/${key}`, (req, res) => {
        res.send(value.toString());
    });
});

app.use(router);

logger.info(`Listening on: ${featureTogglesPort}`);

const server = app.listen(featureTogglesPort);

export default server;
