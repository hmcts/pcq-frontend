'use strict';

const expect = require('chai').expect;
const nock = require('nock');
const app = require('app');
const request = require('supertest');
const config = require('config');

describe('Healthcheck', () => {
    describe('/health endpoint', () => {
        it('should return the correct params', (done) => {
            nock(config.services.pcqBackend.url)
                .get('/health/readiness')
                .reply(
                    200,
                    {'status': 'UP'}
                );
            const server = app.init();
            const agent = request.agent(server.app);
            agent.get('/health')
                .expect(200)
                .end((err, res) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    expect(res.body).to.have.property('status').and.equal('UP');
                    expect(res.body).to.have.property('pcq-backend');
                    expect(res.body).to.have.property('buildInfo');
                    done();
                });
        });

        it('should return the correct params on PCQ Backend DOWN', (done) => {
            nock(config.services.pcqBackend.url)
                .get('/health')
                .reply(
                    500,
                    {'status': 'DOWN'}
                );

            const server = app.init();
            const agent = request.agent(server.app);
            agent.get('/health')
                .expect(500)
                .end((err, res) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    expect(res.body).to.have.property('status').and.equal('DOWN');
                    expect(res.body).to.have.property('pcq-backend').and.deep.equal({
                        'status': 'DOWN'
                    });
                    expect(res.body).to.have.property('buildInfo');
                    done();
                });
        });
    });

    describe('/health/readiness endpoint', () => {
        it('should return the readiness status', (done) => {
            nock(config.services.pcqBackend.url)
                .get('/health')
                .reply(
                    200,
                    {'status': 'UP'}
                );
            const server = app.init();
            const agent = request.agent(server.app);
            agent.get('/health/readiness')
                .expect(200)
                .end((err, res) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    expect(res.body).to.have.property('status').and.equal('UP');
                    done();
                });
        });

        it('should return UP status if backend is down', (done) => {
            nock(config.services.pcqBackend.url)
                .get('/health')
                .reply(
                    500,
                    {'status': 'DOWN'}
                );

            const server = app.init();
            const agent = request.agent(server.app);
            agent.get('/health/readiness')
                .expect(200)
                .end((err, res) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    expect(res.body).to.have.property('status').and.equal('UP');
                    done();
                });
        });
    });
});
