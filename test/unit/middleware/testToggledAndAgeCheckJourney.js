'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');
const setJourney = rewire('app/middleware/setJourney');
const ageCheckQuestionsJourney = require('test/data/journeys/ageCheckQuestions');
const toggledAndAgeCheckQuestionsJourney = require('test/data/journeys/toggledAndAgeCheckQuestions');

describe('toggledAndAgeCheckQuestionsJourney', () => {

    describe('Age Check Questions Processing', () => {

        it('assigns correct skip list given null skip list', async () => {
            const req = {
                session: {
                    form: {
                        serviceId: 'TEST'
                    },
                    ageCheck: 2
                }
            };

            const revert = setJourney.__set__('getBaseJourney', () => {
                return require('test/data/journeys/ageCheckQuestions');
            });

            await setJourney(req, {});

            let skipList = [
                {stepName: 'ApplicantDateOfBirth'},
                {stepName: 'ApplicantLanguage'},
            ];

            const journey = Object.assign({}, ageCheckQuestionsJourney());
            journey.skipList = skipList;

            expect(req.session).to.deep.equal({
                form: {
                    serviceId: 'TEST',
                },
                ageCheck: 2,
                journey: journey
            });

            req.session.ageCheck = 1;
            await setJourney(req, {});

            skipList = [
                {stepName: 'ApplicantSex'},
                {stepName: 'ApplicantGenderSameAsSex'},
            ];
            journey.skipList = skipList;

            expect(req.session).to.deep.equal({
                form: {
                    serviceId: 'TEST',
                },
                ageCheck: 1,
                journey: journey
            });

            req.session.ageCheck = 0;
            await setJourney(req, {});

            skipList = [
                {stepName: 'ApplicantSexualOrientation'},
                {stepName: 'ApplicantMaritalStatus'},
            ];
            journey.skipList = skipList;

            expect(req.session).to.deep.equal({
                form: {
                    serviceId: 'TEST',
                },
                ageCheck: 0,
                journey: journey
            });

            revert();
        });

        it('merges the skip lists correctly', async () => {
            const req = {
                session: {
                    form: {
                        serviceId: 'TEST'
                    },
                    ageCheck: 2
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
                return require('test/data/journeys/toggledAndAgeCheckQuestions');
            });

            await setJourney(req, res);

            let skipList = [
                {stepName: 'ApplicantLanguage'},

                {
                    nextStepName: 'ApplicantEthnicGroup',
                    stepName: 'ApplicantSexualOrientation'
                },
                {stepName: 'ApplicantDateOfBirth'}
            ];

            const journey = Object.assign({}, toggledAndAgeCheckQuestionsJourney());
            journey.skipList = skipList;

            expect(req.session).to.deep.equal({
                form: {
                    serviceId: 'TEST',
                },
                ageCheck: 2,
                journey: journey
            });

            req.session.ageCheck = 1;
            await setJourney(req, res);

            skipList = [
                {stepName: 'ApplicantLanguage'},

                {
                    nextStepName: 'ApplicantEthnicGroup',
                    stepName: 'ApplicantSexualOrientation'
                },

                {stepName: 'ApplicantSex'},
                {stepName: 'ApplicantGenderSameAsSex'},
            ];
            journey.skipList = skipList;

            expect(req.session).to.deep.equal({
                form: {
                    serviceId: 'TEST',
                },
                ageCheck: 1,
                journey: journey
            });

            req.session.ageCheck = 0;
            await setJourney(req, res);

            skipList = [
                {stepName: 'ApplicantLanguage'},

                {
                    nextStepName: 'ApplicantEthnicGroup',
                    stepName: 'ApplicantSexualOrientation'
                },

                {stepName: 'ApplicantMaritalStatus'},
            ];
            journey.skipList = skipList;

            expect(req.session).to.deep.equal({
                form: {
                    serviceId: 'TEST',
                },
                ageCheck: 0,
                journey: journey
            });

            revert();
        });

    });
});
