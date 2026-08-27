'use strict';
const featureToggle = new (require('app/utils/FeatureToggle'))();
const logger = require('app/components/logger');

// Static allowlist of journeys 
const journeyMap = {
    probate: require('app/journeys/probate'),
    cmc: require('app/journeys/cmc'),
    divorce: require('app/journeys/divorce'),
    new_divorce_law: require('app/journeys/new_divorce_law'),
    sscs: require('app/journeys/sscs'),
    iac: require('app/journeys/iac'),
    adoption: require('app/journeys/adoption'),
    et: require('app/journeys/et'),
    online_plea: require('app/journeys/online_plea'),
    specialtribunals_cic: require('app/journeys/specialtribunals_cic'),
    jurordigital: require('app/journeys/jurordigital'),
    prl_ca: require('app/journeys/prl_ca'),
    'civil-citizen-ui': require('app/journeys/civil-citizen-ui'),
    pcs: require('app/journeys/pcs'),
    default: require('app/journeys/default')
};

const getBaseJourney = name => {
    const journey = journeyMap[name.toLowerCase()];
    if (!journey) {
        throw new Error(`Unknown journey requested: ${name}`);
    }
    return journey;
};

const setJourney = async (req, res) => {
    const journeyName = req.session.form ? req.session.form.serviceId || 'DEFAULT' : 'DEFAULT';
    const actor = req.session.form ? req.session.form.actor || '' : '';
    const ageCheck = req.session.ageCheck;

    try {
        const journey = getBaseJourney(journeyName)(actor.toLowerCase());

        if (journey.toggledQuestions) {
            journey.skipList = await processToggledQuestions(journey.toggledQuestions, req, res);
        }

        if (journey.ageCheckQuestions && ageCheck !== null && journey.ageCheckQuestions[ageCheck]) {
            if (journey.skipList) {
                // Add the age check skip list questions, ensuring to merge any duplicates from the toggled questions.
                // If any merges cause confliction, then log an error and prioritise the toggle item.

                const ageCheckSkipList = journey.ageCheckQuestions[ageCheck];

                // Loop through each of the items in age check questions.
                ageCheckSkipList.forEach(item => {
                    // If the step name is already in the skip list
                    const duplicateItem = journey.skipList.find(skippedItem => skippedItem.stepName === item.stepName);
                    if (duplicateItem) {
                        // If they have a next step, ensure they are the same, otherwise, log an error and prioritise the toggle.
                        if (item.nextStepName !== duplicateItem.nextStepName) {
                            logger(req.session.sessionId).error('ERROR Duplicated skip list item has different nextStepName. Prioritising toggled skip list item.');
                        }
                    } else {
                        journey.skipList.push(item);
                    }
                });
            } else {
                journey.skipList = journey.ageCheckQuestions[ageCheck];
            }
        }

        req.session.journey = journey;
    } catch (err) {
        logger(req.session.sessionId).error(err);
        req.session.journey = require('app/journeys/default')();
    }

    return req.session.journey;
};

const processToggledQuestions = (toggledQuestions, req, res) => {
    const promises = toggledQuestions.map(tq => featureToggle.checkToggle(tq.ftKey, req, res));
    return Promise.all(promises)
        .then(values => {
            const skipList = [];
            toggledQuestions.forEach((tq, i) => {
                if (values[i] === false) {
                    skipList.push({
                        stepName: tq.stepName,
                        ...(tq.nextStepName && {nextStepName: tq.nextStepName})
                    });
                }
            });
            return skipList;
        })
        .catch(() => {
            logger(req.session.sessionId).error('ERROR retrieving skip list toggles; defaulting all to skip');

            /*
             * If there was an error retrieving the toggles, we skip all questions that have toggles in order to prevent
             * a question from being erroneously shown to a user.
             */
            return toggledQuestions.map(tq => {
                return {stepName: tq.stepName};
            });
        });
};

module.exports = setJourney;
