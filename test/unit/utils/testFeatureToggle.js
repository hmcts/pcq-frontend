'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const Proxyquire = require('proxyquire/lib/proxyquire');
const proxyquire = new Proxyquire(module).noCallThru();
const FeatureToggle = require('app/utils/FeatureToggle');

describe('FeatureToggle', () => {
    describe('callCheckToggle()', () => {
        it('should call the callback function when the api returns successfully', async () => {
            const params = {
                req: {
                    session: {
                        form: {}
                    }
                },
                res: {
                    locals: {
                        launchDarkly: {
                            ftValue: {'ft_test': true}
                        }
                    }
                },
                next: () => true,
                featureToggleKey: 'ft_test',
                callback: sinon.spy(),
                redirectPage: '/dummy-page'
            };
            const featureToggle = new FeatureToggle();

            await featureToggle.callCheckToggle(...Object.values(params));
            // Checking ld doesn't hang with a second call
            await featureToggle.callCheckToggle(...Object.values(params));

            expect(params.callback.calledTwice).to.equal(true);
            expect(params.callback.args[1]).to.deep.equal([{
                req: params.req,
                res: params.res,
                next: params.next,
                redirectPage: params.redirectPage,
                isEnabled: true,
                featureToggleKey: params.featureToggleKey
            }]);
        });

        it('should call next() when the api returns an error', async () => {
            class FeatureToggleStub {
                getInstance() {
                    return true;
                }

                variation() {
                    throw new Error('Test error');
                }
            }

            const params = {
                req: {
                    session: {
                        form: {}
                    }
                },
                res: {},
                next: sinon.spy(),
                featureToggleKey: 'ft_fees_api',
                callback: () => true,
                redirectPage: '/dummy-page'
            };
            const FeatureToggleWithStub = proxyquire('app/utils/FeatureToggle', {
                'app/components/launch-darkly': FeatureToggleStub
            });
            const featureToggle = new FeatureToggleWithStub();

            await featureToggle.callCheckToggle(...Object.values(params));

            expect(params.next.calledOnce).to.equal(true);
        });
    });

    describe('togglePage()', () => {
        it('should call next() when isEnabled is set to true', (done) => {
            const params = {
                isEnabled: true,
                res: {},
                next: sinon.spy()
            };
            const featureToggle = new FeatureToggle();

            featureToggle.togglePage(params);

            expect(params.next.calledOnce).to.equal(true);
            expect(params.next.calledWith()).to.equal(true);
            done();
        });

        it('should redirect to the specified page when isEnabled is set to false', (done) => {
            const params = {
                isEnabled: false,
                res: {redirect: sinon.spy()},
                next: {},
                redirectPage: '/applicant-phone'
            };
            const featureToggle = new FeatureToggle();

            featureToggle.togglePage(params);

            expect(params.res.redirect.calledOnce).to.equal(true);
            expect(params.res.redirect.calledWith('/applicant-phone')).to.equal(true);
            done();
        });
    });

    describe('toggleExistingPage()', () => {
        it('should call next() when isEnabled is set to false', (done) => {
            const params = {
                isEnabled: false,
                res: {},
                next: sinon.spy()
            };
            const featureToggle = new FeatureToggle();

            featureToggle.toggleExistingPage(params);

            expect(params.next.calledOnce).to.equal(true);
            expect(params.next.calledWith()).to.equal(true);
            done();
        });

        it('should redirect to the specified page when isEnabled is set to true', (done) => {
            const params = {
                isEnabled: true,
                res: {redirect: sinon.spy()},
                next: {},
                redirectPage: '/applicant-phone'
            };
            const featureToggle = new FeatureToggle();

            featureToggle.toggleExistingPage(params);

            expect(params.res.redirect.calledOnce).to.equal(true);
            expect(params.res.redirect.calledWith('/applicant-phone')).to.equal(true);
            done();
        });
    });

    describe('toggleFeature()', () => {
        describe('should set the feature toggle', () => {
            it('when the session contains a featureToggles object and call next()', (done) => {
                const params = {
                    req: {session: {featureToggles: {}}},
                    featureToggleKey: 'document_upload',
                    isEnabled: true,
                    next: sinon.spy()
                };
                const featureToggle = new FeatureToggle();

                featureToggle.toggleFeature(params);

                expect(params.req.session.featureToggles).to.deep.equal({document_upload: true});
                expect(params.next.calledOnce).to.equal(true);
                expect(params.next.calledWith()).to.equal(true);
                done();
            });

            it('when the session does not contain a featureToggles object and call next()', (done) => {
                const params = {
                    req: {session: {}},
                    featureToggleKey: 'document_upload',
                    isEnabled: true,
                    next: sinon.spy()
                };
                const featureToggle = new FeatureToggle();

                featureToggle.toggleFeature(params);

                expect(params.req.session.featureToggles).to.deep.equal({document_upload: true});
                expect(params.next.calledOnce).to.equal(true);
                expect(params.next.calledWith()).to.equal(true);
                done();
            });
        });
    });

    describe('appwideToggles()', () => {
        it('should return ctx when no appwide toggles are present', (done) => {
            const appwideToggles = [];
            const req = {
                session: {
                    featureToggles: {}
                }
            };
            let ctx = {};

            ctx = FeatureToggle.appwideToggles(req, ctx, appwideToggles);

            expect(ctx).to.deep.equal({});
            done();
        });

        it('should add all appwide toggles to ctx when present', (done) => {
            const appwideToggles = ['testToggle'];
            const req = {
                session: {
                    featureToggles: {
                        testToggle: false
                    }
                }
            };
            let ctx = {};

            ctx = FeatureToggle.appwideToggles(req, ctx, appwideToggles);

            expect(ctx).to.deep.equal({
                featureToggles: {
                    testToggle: 'false'
                }
            });
            done();
        });
    });

    describe('isEnabled()', () => {
        describe('should return true', () => {
            it('if the feature toggle exists and is true', (done) => {
                const featureToggles = {document_upload: true};
                const key = 'document_upload';
                const isEnabled = FeatureToggle.isEnabled(featureToggles, key);
                expect(isEnabled).to.equal(true);
                done();
            });
        });

        describe('should return false', () => {
            it('if the feature toggle exists and is false', (done) => {
                const featureToggles = {document_upload: false};
                const key = 'document_upload';
                const isEnabled = FeatureToggle.isEnabled(featureToggles, key);
                expect(isEnabled).to.equal(false);
                done();
            });

            it('if the feature toggle does not exist', (done) => {
                const featureToggles = {};
                const key = 'document_upload';
                const isEnabled = FeatureToggle.isEnabled(featureToggles, key);
                expect(isEnabled).to.equal(false);
                done();
            });

            it('if there are no feature toggles', (done) => {
                const featureToggles = '';
                const key = 'document_upload';
                const isEnabled = FeatureToggle.isEnabled(featureToggles, key);
                expect(isEnabled).to.equal(false);
                done();
            });

            it('if the key is not specified', (done) => {
                const featureToggles = {document_upload: false};
                const key = '';
                const isEnabled = FeatureToggle.isEnabled(featureToggles, key);
                expect(isEnabled).to.equal(false);
                done();
            });
        });
    });
});
