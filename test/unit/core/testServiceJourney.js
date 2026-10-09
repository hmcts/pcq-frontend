import chai from 'chai';
import initSteps from 'app/core/initSteps.js';
import JourneyMap from 'app/core/JourneyMap.js';
import serviceData from './testServiceData.json' with { type: 'json' };
import path from 'node:path';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const { expect } = chai;
const steps = initSteps([fileURLToPath(new URL('../../../app/steps/ui', import.meta.url))]);
const StartPage = steps.StartPage;
const EndPage = steps.EndPage;
const ShutterPage = steps.ShutterPage;
const directoryPath = path.join(fileURLToPath(new URL('../../../app', import.meta.url)), 'journeys');

const files = await readdir(directoryPath);
for (const file of files) {
    console.log(file);
    const filePathFragments = file.split('.');
    const serviceName = filePathFragments[0];
    if (filePathFragments[1] === 'js') {
        const journeyModule = await import(`../../../app/journeys/${file}`);
        const serviceJourney = journeyModule.default();
            describe('ServiceJourney : ' + serviceName, () => {
                const currentStep = {};
                const skipStepName = serviceData.services[serviceName].skipStepName;
                describe('stepList()', () => {
                    it('should return the journey step list without skip list', (done) => {
                        const journeyMap = new JourneyMap(serviceJourney);
                        const stepList = journeyMap.stepList();
                        if (stepList !== null) {
                            expect(stepList).to.not.contain(skipStepName);
                        }
                        done();
                    });
                });
                describe('nextStep()', () => {
                    let journey;
                    let stepMap;
                    const nextStep = serviceData.services[serviceName].nextStep;
                    const nextStepName = serviceData.services[serviceName].nextStepName;
                    beforeEach(() => {
                        stepMap = nextStep;
                        journey = serviceJourney;
                    });
                    it('should skip a step and go to next step as mentioned in service', (done) => {
                        currentStep.name = serviceData.services[serviceName].currentStep;
                        const ctx = {};
                        const journeyMap = new JourneyMap(journey, stepMap);
                        const nextStep = journeyMap.nextStep(currentStep, ctx);
                        expect(nextStep).to.deep.equal(nextStepName);
                        done();
                    });
                });

                const datas = serviceData.services[serviceName].datas;
                for (const data in datas) {
                    describe('Actor : '+ data, () => {
                        describe('generateStartPageContent()', () => {
                            const formData = serviceData.services[serviceName].datas[data].formData;
                            const startPageTextEn = serviceData.services[serviceName].datas[data].startPageTextEn;
                            const startPageTextCy = serviceData.services[serviceName].datas[data].startPageTextCy;
                            it('should return variable text for a service', () => {
                                const content = StartPage.generateContent({}, formData);
                                expect(content.paragraph2).to.equal(startPageTextEn);
                            });
                            it('should return variable text for a service in welsh', () => {
                                const content = StartPage.generateContent({}, formData, 'cy');
                                expect(content.paragraph2).to.equal(startPageTextCy);
                            });
                        });

                        describe('generateEndPageContent()', () => {
                            const formData = serviceData.services[serviceName].datas[data].formData;
                            const endPageTextEn = serviceData.services[serviceName].datas[data].endPageTextEn;
                            const endPageTextCy = serviceData.services[serviceName].datas[data].endPageTextCy;
                            it('should return variable text for a service', () => {
                                const content = EndPage.generateContent({}, formData);
                                expect(content.paragraph1).to.equal(endPageTextEn);
                            });
                            it('should return variable text for a service in welsh', () => {
                                const content = EndPage.generateContent({}, formData, 'cy');
                                expect(content.paragraph1).to.equal(endPageTextCy);
                            });
                        });

                        describe('generateShutterPageContent()', () => {
                            const formData = serviceData.services[serviceName].datas[data].formData;
                            const shutterPageTextEn = serviceData.services[serviceName].datas[data].shutterPageTextEn;
                            const shutterPageTextCy = serviceData.services[serviceName].datas[data].shutterPageTextCy;
                            it('should return variable text for a service', () => {
                                const content = ShutterPage.generateContent({}, formData);
                                expect(content.paragraph1).to.equal(shutterPageTextEn);
                            });
                            it('should return variable text for a service in welsh', () => {
                                const content = ShutterPage.generateContent({}, formData, 'cy');
                                expect(content.paragraph1).to.equal(shutterPageTextCy);
                            });
                        });
                    });
                }
        });
    }
}
