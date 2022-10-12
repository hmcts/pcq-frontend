'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');
const setJourney = rewire('app/middleware/setJourney');
const defaultJourney = require('app/journeys/default');
const probateJourney = require('app/journeys/probate');
const toggledQuestionsJourney = require('test/data/journeys/toggledQuestions');
const actorDefinedJourneys = rewire('test/data/journeys/actorDefinedJourneys');

describe('setJourney', () => {
    it('should set req.journey with the default journey when no form session', async () => {
        const req = {
            session: {}
        };
        const res = {};

        await setJourney(req, res);

        expect(req.session).to.deep.equal({
            journey: defaultJourney()
        });
    });

    it('should set req.journey with the default journey when no service id', async () => {
        const req = {
            session: {form: {}}
        };
        const res = {};

        await setJourney(req, res);

        expect(req.session).to.deep.equal({
            journey: defaultJourney(),
            form: {}
        });
    });

    it('should set req.journey with the probate journey when serviceId is PROBATE', async () => {
        const req = {
            session: {
                form: {
                    serviceId: 'PROBATE'
                }
            }
        };
        const res = {};

        await setJourney(req, res);

        expect(req.session).to.deep.equal({
            form: {
                serviceId: 'PROBATE',
            },
            journey: probateJourney()
        });
    });

    it('should set req.journey with default journey when journey file not found', async () => {
        const req = {
            session: {
                form: {
                    serviceId: 'NO_JOURNEY_FILE_FOR_ME'
                }
            }
        };
        const res = {};

        await setJourney(req, res);

        expect(req.session).to.deep.equal({
            form: {
                serviceId: 'NO_JOURNEY_FILE_FOR_ME',
            },
            journey: defaultJourney()
        });
    });

    it('should set req.journey with processed skip list', async () => {
        const req = {
            session: {
                form: {
                    serviceId: 'TEST'
                }
            }
        };
        const res = {
            locals: {
                launchDarkly: {
                    ftValue: {
                        ft_enabled: true,
                        ft_disabled: false
                    }
                }
            },
        };

        const revert = setJourney.__set__('getBaseJourney', () => {
            return require('test/data/journeys/toggledQuestions');
        });

        await setJourney(req, res);

        const skipList = [
            {
                'stepName': 'ApplicantLanguage'
            },
            {
                'stepName': 'ApplicantSexualOrientation',
                'nextStepName': 'ApplicantEthnicGroup'
            }
        ];

        const journey = Object.assign({}, toggledQuestionsJourney());
        journey.skipList = skipList;

        expect(req.session).to.deep.equal({
            form: {
                serviceId: 'TEST',
            },
            journey: journey
        });

        revert();
    });

    describe('by actor', () => {
        it('sets journey by actor - 1', async () => {
            const req = {
                session: {
                    form: {
                        serviceId: 'TEST',
                        actor: 'WITHDOB'
                    }
                }
            };
            const res = {};

            const withDobJourney = actorDefinedJourneys.__get__('withDob');

            const revert = setJourney.__set__('getBaseJourney', () => {
                return require('test/data/journeys/actorDefinedJourneys');
            });

            await setJourney(req, res);

            expect(req.session).to.deep.equal({
                form: {
                    serviceId: 'TEST',
                    actor: 'WITHDOB'
                },
                journey: {stepList: withDobJourney}
            });

            revert();
        });

        it('sets journey by actor - 2', async () => {
            const req = {
                session: {
                    form: {
                        serviceId: 'TEST',
                        actor: 'WITHOUTDOB'
                    }
                }
            };
            const res = {};

            const withoutDobJourney = actorDefinedJourneys.__get__('withoutDob');

            const revert = setJourney.__set__('getBaseJourney', () => {
                return require('test/data/journeys/actorDefinedJourneys');
            });

            await setJourney(req, res);

            expect(req.session).to.deep.equal({
                form: {
                    serviceId: 'TEST',
                    actor: 'WITHOUTDOB'
                },
                journey: {stepList: withoutDobJourney}
            });

            revert();
        });
    });
});
