'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');
const JourneyMap = rewire('app/core/JourneyMap');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../../app/steps/ui`]);
const serviceData = require('test/unit/core/testServiceData.json');
const StartPage = steps.StartPage;
const EndPage = steps.EndPage;
const ShutterPage = steps.ShutterPage;
//requiring path and fs modules
const path = require('path');
const fs = require('fs');
//joining path of directory
const directoryPath = path.join(`${__dirname}/../../../app`, 'journeys');

//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        // your tests logic
        console.log(file);
        const filePathFragments = file.split('.');
        const serviceName = filePathFragments[0];
        if (filePathFragments[1] === 'js') {
            describe('ServiceJourney : ' + serviceName, () => {
                const currentStep = {};
                const serviceJourney = require(`app/journeys/${serviceName}`)();
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
                    let revert;
                    const nextStep = serviceData.services[serviceName].nextStep;
                    const nextStepName = serviceData.services[serviceName].nextStepName;
                    beforeEach(() => {
                        revert = JourneyMap.__set__('steps', nextStep);
                        journey = serviceJourney;
                    });
                    afterEach(() => {
                        revert();
                    });
                    it('should skip a step and go to next step as mentioned in service', (done) => {
                        currentStep.name = serviceData.services[serviceName].currentStep;
                        const ctx = {};
                        const journeyMap = new JourneyMap(journey);
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
    });
});
