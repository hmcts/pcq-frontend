'use strict';

const co = require('co');
const request = require('supertest');
const a11y = require('test/util/a11y');
const expect = require('chai').expect;
const app = require('../../app');
const initSteps = require('app/core/initSteps');
const {endsWith} = require('lodash');
const commonContent = require('app/resources/en/translation/common');
const stepsToExclude = [];
const steps = initSteps([`${__dirname}/../../app/steps/ui`], 'en');
const nock = require('nock');
const config = require('config');
const commonSessionData = {
    form: {},
    back: [],
    validParameters: true
};

Object.keys(steps)
    .filter(stepName => stepsToExclude.includes(stepName))
    .forEach(stepName => delete steps[stepName]);

for (const step in steps) {
    ((step) => {
        const stepUrl = step.constructor.getUrl();
        let results;
        const sessionData = commonSessionData;

        describe(`Verify accessibility for the page ${step.name}`, () => {
            let server = null;
            let agent = null;
            let title;

            if (step.name === 'StartPage') {
                title = `${commonContent.serviceName} - ${commonContent.govuk}`
                    .replace(/&lsquo;/g, '‘')
                    .replace(/’/g, '’');
            } else {
                title = `${step.content.question || step.content.title} - ${commonContent.serviceName} - ${commonContent.govuk}`
                    .replace(/&lsquo;/g, '‘')
                    .replace(/’/g, '’');
            }

            before((done) => {
                server = app.init(true, sessionData);

                agent = request.agent(server.app);
                co(function* () {
                    let urlSuffix = '';
                    if (endsWith(agent.get(config.app.basePath + step.constructor.getUrl()), '*')) {
                        urlSuffix = '/0';
                    }
                    results = yield a11y(agent.get(config.app.basePath + stepUrl).url + urlSuffix);
                })
                    .then(done, done)
                    .catch((error) => {
                        done(error);
                    });
            });

            after((done) => {
                nock.cleanAll();
                server.http.close();
                done();
            });

            it('should not generate any errors', () => {
                const errors = results.issues.filter((res) => res.type === 'error');

                expect(results.documentTitle).to.equal(title);
                expect(errors.length).to.equal(0, JSON.stringify(errors, null, 2));
            });

            it('should not generate any warnings', () => {
                const warnings = results.issues.filter((res) => res.type === 'warning');

                expect(warnings.length).to.equal(0, JSON.stringify(warnings, null, 2));
            });
        });
    })(steps[step]);
}
