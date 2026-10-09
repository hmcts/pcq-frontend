import chai from 'chai';
import defaultJourney from 'app/journeys/default.js';
import JourneyMap from 'app/core/JourneyMap.js';
import toggledQuestions from '../../data/journeys/toggledQuestions.js';

const { expect } = chai;

describe('JourneyMap.js', () => {
    let currentStep;

    beforeEach(() => {
        currentStep = {
            nextStepOptions: () => {
                return {
                    options: [
                        {key: 'language', value: 'optionOther', choice: 'otherLanguage'}
                    ]
                };
            }
        };
    });

    describe('nextOptionStep()', () => {
        it('should return the next option step', (done) => {
            const ctx = {
                language: 'optionOther'
            };
            const journeyMap = new JourneyMap({});
            const nextOptionStep = journeyMap.nextOptionStep(currentStep, ctx);
            expect(nextOptionStep).to.equal('otherLanguage');
            done();
        });

        it('should return otherwise', (done) => {
            const ctx = {};
            const journeyMap = new JourneyMap({});
            const nextOptionStep = journeyMap.nextOptionStep(currentStep, ctx);
            expect(nextOptionStep).to.equal('otherwise');
            done();
        });
    });

    describe('nextStep()', () => {
        let journey;
        let stepMap;

        beforeEach(() => {
            stepMap = {
                ApplicantEnglishLevel: {
                    name: 'ApplicantEnglishLevel'
                },
                ApplicantGenderSameAsSex: {
                    name: 'ApplicantGenderSameAsSex'
                }
            };
            journey = defaultJourney();
        });

        it('should return the next option step if the next step is a string', (done) => {
            currentStep.name = 'ApplicantSex';
            const ctx = {};
            const journeyMap = new JourneyMap(journey, stepMap);
            const nextStep = journeyMap.nextStep(currentStep, ctx);
            expect(nextStep).to.deep.equal({name: 'ApplicantGenderSameAsSex'});
            done();
        });

        it('should return the next option step if the next step is an object', (done) => {
            currentStep.name = 'ApplicantLanguage';
            const ctx = {
                language: 'optionOther'
            };
            const journeyMap = new JourneyMap(journey, stepMap);
            const nextStep = journeyMap.nextStep(currentStep, ctx);
            expect(nextStep).to.deep.equal({name: 'ApplicantEnglishLevel'});
            done();
        });
    });

    describe('nextStep() - With skip list', () => {
        let stepMap;

        beforeEach(() => {
            stepMap = {
                ApplicantDateOfBirth: {
                    name: 'ApplicantDateOfBirth'
                },
                ApplicantLanguage: {
                    name: 'ApplicantLanguage'
                },
                ApplicantSex: {
                    name: 'ApplicantSex'
                },
                ApplicantGenderSameAsSex: {
                    name: 'ApplicantGenderSameAsSex'
                },
                ApplicantSexualOrientation: {
                    name: 'ApplicantSexualOrientation'
                },
                ApplicantMaritalStatus: {
                    name: 'ApplicantMaritalStatus'
                }
            };
        });

        it('should skip a step if it is in the skip list', (done) => {
            currentStep.name = 'StartPage';

            const journey = toggledQuestions();
            journey.skipList = [
                {stepName: 'ApplicantDateOfBirth'}
            ];

            const ctx = {};
            const journeyMap = new JourneyMap(journey, stepMap);
            const nextStep = journeyMap.nextStep(currentStep, ctx);
            expect(nextStep).to.deep.equal({name: 'ApplicantLanguage'});
            done();
        });

        it('should skip a step in the skip list and navigate to the specified next step', (done) => {
            currentStep.name = 'StartPage';

            const journey = toggledQuestions();
            journey.skipList = [
                {stepName: 'ApplicantDateOfBirth', nextStepName: 'ApplicantSex'}
            ];

            const ctx = {};
            const journeyMap = new JourneyMap(journey, stepMap);
            const nextStep = journeyMap.nextStep(currentStep, ctx);
            expect(nextStep).to.deep.equal({name: 'ApplicantSex'});
            done();
        });

        it('should skip a step in the skip list with linked skip steps', (done) => {
            currentStep.name = 'StartPage';

            const journey = toggledQuestions();
            journey.skipList = [
                {stepName: 'ApplicantDateOfBirth', nextStepName: 'ApplicantSex'},
                {stepName: 'ApplicantSex'}
            ];

            const ctx = {};
            const journeyMap = new JourneyMap(journey, stepMap);
            const nextStep = journeyMap.nextStep(currentStep, ctx);
            expect(nextStep).to.deep.equal({name: 'ApplicantGenderSameAsSex'});
            done();
        });

        it('should skip a step in the skip list with multiple linked skip steps - 1', (done) => {
            currentStep.name = 'StartPage';

            const journey = toggledQuestions();
            journey.skipList = [
                {stepName: 'ApplicantDateOfBirth', nextStepName: 'ApplicantSex'},
                {stepName: 'ApplicantSex', nextStepName: 'ApplicantSexualOrientation'}
            ];

            const ctx = {};
            const journeyMap = new JourneyMap(journey, stepMap);
            const nextStep = journeyMap.nextStep(currentStep, ctx);
            expect(nextStep).to.deep.equal({name: 'ApplicantSexualOrientation'});
            done();
        });

        it('should skip a step in the skip list with multiple linked skip steps - 2', (done) => {
            currentStep.name = 'StartPage';

            const journey = toggledQuestions();
            journey.skipList = [
                {stepName: 'ApplicantDateOfBirth', nextStepName: 'ApplicantSex'},
                {stepName: 'ApplicantSex', nextStepName: 'ApplicantSexualOrientation'},
                {stepName: 'ApplicantSexualOrientation'}
            ];

            const ctx = {};
            const journeyMap = new JourneyMap(journey, stepMap);
            const nextStep = journeyMap.nextStep(currentStep, ctx);
            expect(nextStep).to.deep.equal({name: 'ApplicantMaritalStatus'});
            done();
        });
    });

    describe('stepList()', () => {
        it('should return the journey step list', (done) => {
            const journeyMap = new JourneyMap(defaultJourney);
            const stepList = journeyMap.stepList();
            expect(stepList).to.deep.equal(defaultJourney.stepList);
            done();
        });
    });
});
