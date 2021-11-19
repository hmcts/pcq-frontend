'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');
const JourneyMap = rewire('app/core/JourneyMap');
const iacJourney = require('app/journeys/iac');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../../app/steps/ui`]);
const formdata = require('test/unit/core/testServiceData.json');
const StartPage = steps.StartPage;
const EndPage = steps.EndPage;
const ShutterPage = steps.ShutterPage;

describe('ServiceJourneyMap.js', () => {
    const currentStep = {};
    describe('stepList()', () => {
        it('should return the journey step list', (done) => {
            const journeyMap = new JourneyMap(iacJourney);
            const stepList = journeyMap.stepList();
            expect(stepList).to.deep.equal(iacJourney.stepList);
            done();
        });
    });

    describe('nextStep()', () => {
        let journey;
        let revert;
        const iacNextStep = formdata.services.iacNextStep;
        beforeEach(() => {
            revert = JourneyMap.__set__('steps', iacNextStep);
            journey = iacJourney();
        });

        afterEach(() => {
            revert();
        });

        it('should skip a step and go to next step as mentioned in service', (done) => {
            currentStep.name = formdata.services.iacCurrentStep;
            const ctx = {};
            const journeyMap = new JourneyMap(journey);
            const nextStep = journeyMap.nextStep(currentStep, ctx);
            expect(nextStep).to.deep.equal({name: 'ApplicantLanguage'});
            done();
        });
    });
    describe('generateStartPageContent()', () => {
        const iacFormData = formdata.services.iacFormData;
        it('should return variable text for a service', () => {
            const content = StartPage.generateContent({}, iacFormData);
            expect(content.paragraph2).to.equal('Your answers will not affect your appeal.');
        });

        it('should return variable text for a service in welsh', () => {
            const content = StartPage.generateContent({}, iacFormData, 'cy');
            expect(content.paragraph2).to.equal('Ni fydd eich atebion yn effeithio ar eich apêl.');
        });
    });

    describe('generateEndPageContent()', () => {
        const iacFormData = formdata.services.iacFormData;
        it('should return variable text for a service', () => {
            const content = EndPage.generateContent({}, iacFormData);
            expect(content.paragraph1).to.equal('The next steps are to check your appeal details.');
        });

        it('should return variable text for a service in welsh', () => {
            const content = EndPage.generateContent({}, iacFormData, 'cy');
            expect(content.paragraph1).to.equal('Y cam nesaf yw gwirio manylion eich apêl.');
        });
    });

    describe('generateShutterPageContent()', () => {
        const iacFormData = formdata.services.iacFormData;
        it('should return variable text for a service', () => {
            const content = ShutterPage.generateContent({}, iacFormData);
            expect(content.paragraph1).to.equal('We have saved your answers and will direct you back to your appeal application now.');
        });

        it('should return variable text for a service in welsh', () => {
            const content = ShutterPage.generateContent({}, iacFormData, 'cy');
            expect(content.paragraph1).to.equal('Rydym wedi cadw eich atebion, ac fe’ch cyfeirir yn ôl at eich cais apêl yn awr');
        });
    });
});
