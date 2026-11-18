import config from 'config';
import express from 'express';
const app = express();
const router = express.Router();
const BACKEND_PORT = config.services.pcqBackend.port;
const SUBMIT_ANSWERS_URL = config.services.pcqBackend.paths.forms;

app.use(express.json());

router.get('/health/readiness', (req, res) => {
    res.contentType('application/json');
    res.status(200);
    res.send({status: 'UP'});
});

router.post(SUBMIT_ANSWERS_URL, (req, res) => {
    res.contentType('application/json');
    res.status(200);
    res.send(req.body);
});

app.use(router);

console.log(`Listening on: ${BACKEND_PORT}`);
const server = app.listen(BACKEND_PORT);

export default server;
