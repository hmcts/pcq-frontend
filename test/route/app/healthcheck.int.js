const {expect} = require('chai');
const app = require('../../../app');
const request = require('supertest');
const commonContent = require('app/resources/en/translation/common');

describe('healthcheck.js', () => {
    it('/health should return the correct params', (done) => {
        const server = app.init();
        const agent = request.agent(server.app);
        agent.get('/health')
            .expect(200)
            .end((err, res) => {
                server.http.close();
                if (err) {
                    throw err;
                }
                expect(res.body).to.have.property('name').and.equal(commonContent.serviceName);
                expect(res.body).to.have.property('status').and.equal('UP');
                done();
            });
    });
});
