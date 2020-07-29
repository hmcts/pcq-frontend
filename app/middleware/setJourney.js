'use strict';
const featureToggle = new (require('app/utils/FeatureToggle'))();
const logger = require('app/components/logger');

const getBaseJourney = name => {
    return require(`app/journeys/${name.toLowerCase()}`);
};

const setJourney = async (req, res) => {
    const journeyName = req.session.form ? req.session.form.serviceId || 'DEFAULT' : 'DEFAULT';

    try {
        const journey = getBaseJourney(journeyName);

        if (journey.toggledQuestions) {
            journey.skipList = await processToggledQuestions(journey.toggledQuestions, req, res);
        }

        req.session.journey = journey;
    } catch (err) {
        req.session.journey = require('app/journeys/default');
    }

    return req.session.journey;
};

const processToggledQuestions = (toggledQuestions, req, res) => {
    const promises = toggledQuestions.map(sl => featureToggle.checkToggle(sl.ftKey, req, res));
    return Promise.all(promises)
        .then(values => {
            const skipList = [];
            toggledQuestions.forEach((sl, i) => {
                if (values[i] === false) {
                    skipList.push(sl.step);
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
            return toggledQuestions.map(sl => sl.step);
        });
};

module.exports = setJourney;
