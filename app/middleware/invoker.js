'use strict';

const invoker = new (require('app/utils/Invoker'))();

const render = (req, res) => {
    const content = invoker.content;
    content.timestamp = Date.now();
    res.render('invoker/template', content, (err, html) => {
        if (err) {
            req.log.error(err);
            return res.status(500);
        }
        res.send(html);
    });
};

const formFiller = (req, res) => {
    res.json(invoker.fillForm(req.query.service, req.query.actor, req.query.fields.split(',')));
};

const genToken = (req, res) => {
    res.json(invoker.generateToken(req.query));
};

const postForm = (req, res) => {
    res.redirect(invoker.serviceEndpoint(req.body));
};

const addTo = (app) => {
    app.get('/invoker', render);
    app.get('/invoker/formFiller', formFiller);
    app.get('/invoker/genToken', genToken);
    app.post('/invoker', postForm);
};

module.exports = {
    'addTo': addTo
};
