import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import requireDir from 'require-directory';
import loggerFactory from '../components/logger.js';

const require = createRequire(import.meta.url);
const i18next = require('i18next');
const logger = loggerFactory('Init');
const requireContext = {filename: fileURLToPath(import.meta.url), require};
const steps = {};

const initStep = (filePath, language) => {
    const stepObject = requireContext.require(filePath);
    const filePathFragments = filePath.search('ui') >= 0 ? filePath.split(`${path.sep}ui${path.sep}`) : filePath.split(`${path.sep}action${path.sep}`);
    let resourcePath = filePathFragments[1];
    resourcePath = resourcePath.replace(`${path.sep}index.js`, '');
    const section = resourcePath.split(path.sep);

    if (section.length > 1) {
        section.pop();
    }

    const schemaPath = filePath.replace('index.js', 'schema');
    let schema;

    try {
        schema = requireContext.require(schemaPath);
    } catch {
        schema = {};
    }

    resourcePath = resourcePath.replace(path.sep, '/');
    return new stepObject(steps, section.toString(), resourcePath, i18next, schema, language);
};

const initSteps = (stepLocations, language = 'en') => {
    initI18Next();
    const calculatePath = sPath => {
        if ((/index.js$/).test(sPath)) {
            const step = initStep(sPath, language);
            steps[step.name] = step;
            return true;
        }
        return false;
    };
    for (const location of stepLocations) {
        requireDir(requireContext, location, {include: calculatePath});
    }

    return steps;
};

const initI18Next = () => {
    const content = requireDir(requireContext, '../', {include: /resources/});
    i18next.createInstance();
    i18next.init(content, (err) => {
        if (err) {
            logger.error(err);
        }
    });
};

initSteps.initI18Next = initI18Next;
initSteps.steps = steps;

export default initSteps;
export {initI18Next, steps};
export {initSteps as 'module.exports'};
