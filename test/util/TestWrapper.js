'use strict';

const {forEach, filter, isEmpty, set, get, cloneDeep} = require('lodash');
const {expect, assert} = require('chai');
const rewire = require('rewire');
const app = rewire('../../app');
const config = require('config');
const request = require('supertest');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/ui`], 'en');
const setJourney = require('app/middleware/setJourney');

class TestWrapper {
    constructor(stepName, ftValue) {
        this.pageToTest = steps[stepName];
        this.pageUrl = this.pageToTest.constructor.getUrl();

        this.content = require(`app/resources/en/translation/${this.pageToTest.resourcePath}`);

        // Monkey patch routes to enable session prep for tests
        this.routes = app.__get__('routes');

        this.routes.post('/prepare-session/:path', (req, res) => {
            set(req.session, req.params.path, req.body);
            res.send('OK');
        });
        this.routes.post('/prepare-session-field', (req, res) => {
            Object.assign(req.session, req.body);
            res.send('OK');
        });
        this.routes.post('/prepare-session-field/:field/:value', (req, res) => {
            set(req.session, req.params.field, req.params.value);
            res.send('OK');
        });

        // Set the journey for each test. Insert before step handlers so it runs first.
        this.routes.use('*', (req, res, next) => setJourney(req, res).then(() => next()));
        const setJourneyLayer = this.routes.stack.pop();
        this.routes.stack.splice(2, 0, setJourneyLayer);

        config.app.useCSRFProtection = 'false';
        this.server = app.init(false, {}, ftValue);
        this.agent = request.agent(this.server.app);
    }

    testContent(done, data = {}, excludeKeys = [], cookies = []) {
        this.setValidParameters(() => {
            const contentToCheck = cloneDeep(filter(this.content, (value, key) => !excludeKeys.includes(key) && key !== 'errors'));
            const substitutedContent = this.substituteContent(data, contentToCheck);
            const res = this.agent.get(this.pageUrl);

            if (cookies.length) {
                const cookiesString = this.setCookiesString(res, cookies);
                res.set('Cookie', cookiesString);
            }

            res.expect('Content-type', /html/)
                .then(response => {
                    this.assertContentIsPresent(response.text, substitutedContent);
                    done();
                })
                .catch(done);
        });
    }

    testDataPlayback(done, data = {}, excludeKeys = [], cookies = []) {
        const dataToCheck = cloneDeep(filter(data, (value, key) => !excludeKeys.includes(key) && key !== 'errors'));
        const res = this.agent.get(this.pageUrl);

        if (cookies.length) {
            const cookiesString = this.setCookiesString(res, cookies);
            res.set('Cookie', cookiesString);
        }

        res.expect('Content-type', /html/)
            .then(response => {
                this.assertContentIsPresent(response.text, dataToCheck);
                done();
            })
            .catch((err) => done(err));
    }

    testContentNotPresent(done, data) {
        this.agent.get(this.pageUrl)
            .then(response => {
                this.assertContentIsNotPresent(response.text, data);
                done();
            })
            .catch((err) => done(err));
    }

    testErrors(done, data, type, onlyKeys = [], cookies = []) {
        this.setValidParameters(() => {
            const contentErrors = get(this.content, 'errors', {});
            const expectedErrors = cloneDeep(isEmpty(onlyKeys) ? contentErrors : filter(contentErrors, (value, key) => onlyKeys.includes(key)));
            assert.isNotEmpty(expectedErrors);
            this.substituteErrorsContent(data, expectedErrors, type);
            const res = this.agent.post(`${this.pageUrl}`);

            if (cookies.length) {
                const cookiesString = this.setCookiesString(res, cookies);
                res.set('Cookie', cookiesString);
            }

            res.type('form')
                .send(data)
                .redirects(1)
                .expect(200)
                .then(res => {
                    forEach(expectedErrors, (value) => {
                        expect(res.text).to.contain(value[type].summary);
                        expect(res.text).to.contain(value[type].message);
                    });
                    done();
                })
                .catch((err) => done(err));
        });
    }

    testStatus500Page(done, postData) {
        this.agent.post(this.pageUrl)
            .type('form')
            .send(postData)
            .expect(500)
            .then(res => {
                this.assertContentIsPresent(res.text, 'Sorry, we’re having technical problems');
                done();
            })
            .catch(() => done());
    }

    testContentAfterError(data, contentToCheck, done) {
        this.agent.post(this.pageUrl)
            .send(data)
            .expect('Content-type', 'text/html; charset=utf-8')
            .then(res => {
                this.assertContentIsPresent(res.text, contentToCheck);
                done();
            })
            .catch((err) => done(err));
    }

    testRedirect(done, data, expectedNextUrl, cookies = []) {
        const res = this.agent.post(this.pageUrl);

        if (cookies.length) {
            const cookiesString = this.setCookiesString(res, cookies);
            res.set('Cookie', cookiesString);
        }

        res.type('form')
            .send(data)
            .expect('location', expectedNextUrl)
            .expect(302)
            .then(() => done())
            .catch((err) => done(err));
    }

    setValidParameters(callback) {
        this.agent.post('/prepare-session-field')
            .send({validParameters: true})
            .end(() => {
                callback();
            });
    }

    substituteContent(data, contentToSubstitute) {
        Object.entries(contentToSubstitute)
            .forEach(([key, contentValue]) => {
                contentValue = contentValue.replace(/\n/g, '<br />\n');
                const contentValueMatch = contentValue.match(/{(.*?)}/g);
                if (contentValueMatch) {
                    contentValueMatch.forEach(placeholder => {
                        const placeholderRegex = new RegExp(placeholder, 'g');
                        placeholder = placeholder.replace(/[{}]/g, '');
                        if (Array.isArray(data[placeholder])) {
                            data[placeholder].forEach(contentData => {
                                const contentValueReplace = contentValue.replace(placeholderRegex, contentData);
                                contentToSubstitute.push(contentValueReplace);
                            });
                            contentToSubstitute[key] = 'undefined';
                        } else {
                            contentValue = contentValue.replace(placeholderRegex, data[placeholder]);
                            contentToSubstitute[key] = contentValue;
                        }
                    });
                } else {
                    contentToSubstitute[key] = contentValue;
                }
            });
        return contentToSubstitute.filter(content => content !== 'undefined');
    }

    substituteErrorsContent(data, contentToSubstitute, type) {
        Object.entries(contentToSubstitute).forEach(([contentKey, contentValue]) => {
            Object.entries(contentValue[type]).forEach(([errorMessageKey, errorMessageValue]) => {
                const errorMessageValueMatch = errorMessageValue.match(/{(.*?)}/g);
                if (errorMessageValueMatch) {
                    errorMessageValueMatch.forEach(placeholder => {
                        const placeholderRegex = new RegExp(placeholder, 'g');
                        contentToSubstitute[contentKey][type][errorMessageKey] = contentToSubstitute[contentKey][type][errorMessageKey].replace(placeholderRegex, data[placeholder]);
                    });
                }
            });
        });
    }

    assertContentIsPresent(actualContent, expectedContent) {
        expectedContent.forEach(contentValue => {
            expect(actualContent.toLowerCase()).to.contain(contentValue.toString().toLowerCase());
        });
    }

    assertContentIsNotPresent(actualContent, expectedContent) {
        forEach(expectedContent, (contentValue) => {
            expect(actualContent.toLowerCase()).to.not.contain(contentValue.toString().toLowerCase());
        });
    }

    setCookiesString(res, cookies = []) {
        if (cookies.length) {
            let cookiesString;

            for (let i = 0; i < cookies.length; i++) {
                const cookieName = cookies[i].name;
                const cookieContent = JSON.stringify(cookies[i].content);
                cookiesString = `${cookieName}=${cookieContent},`;
            }

            cookiesString = cookiesString.substring(0, cookiesString.length - 1);

            return cookiesString;
        }

        return '';
    }

    destroy() {
        this.server.http.close();
    }
}

module.exports = TestWrapper;
