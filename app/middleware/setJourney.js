'use strict';
const featureToggle = new (require('app/utils/FeatureToggle'))();
const logger = require('app/components/logger');

// Static allowlist of journeys 
const journeyMap = {
    probate: () => import('../journeys/probate.js'),
    cmc: () => import('../journeys/cmc.js'),
    divorce: () => import('../journeys/divorce.js'),
    new_divorce_law: () => import('../journeys/new_divorce_law.js'),
    sscs: () => import('../journeys/sscs.js'),
    iac: () => import('../journeys/iac.js'),
    adoption: () => import('../journeys/adoption.js'),
    et: () => import('../journeys/et.js'),
    online_plea: () => import('../journeys/online_plea.js'),
    specialtribunals_cic: () => import('../journeys/specialtribunals_cic.js'),
    jurordigital: () => import('../journeys/jurordigital.js'),
    prl_ca: () => import('../journeys/prl_ca.js'),
    'civil-citizen-ui': () => import('../journeys/civil-citizen-ui.js'),
    pcs: () => import('../journeys/pcs.js'),
    default: () => import('../journeys/default.js')
};

const getBaseJourney = async name => {
    const journey = journeyMap[name.toLowerCase()];
    if (!journey) {
        throw new Error(`Unknown journey requested: ${name}`);
    }
    const journeyModule = await journey();
    return journeyModule.default;
};

const setJourney = async (req, res) => {
    const journeyName = req.session.form ? req.session.form.serviceId || 'DEFAULT' : 'DEFAULT';
    const actor = req.session.form ? req.session.form.actor || '' : '';
    const ageCheck = req.session.ageCheck;

    try {
        const baseJourney = await getBaseJourney(journeyName);
        const journey = baseJourney(actor.toLowerCase());

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
        const defaultJourney = await import('../journeys/default.js');
        req.session.journey = defaultJourney.default();
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
