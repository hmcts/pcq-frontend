import {createRequire} from 'node:module';
import UIStepRunner from './UIStepRunner.js';

const require = createRequire(import.meta.url);

class OptionGetRunner extends UIStepRunner {

    handleGet(step, req, res) {
        if (req.params[0] === 'redirect') {
            const ctx = step.getContextData(req);
            res.redirect(step.nextStepUrl(req, ctx));
        } else {
            return super.handleGet(step, req, res);
        }
    }

    handlePost(step, req, res) {
        const commonContent = require(`app/resources/${req.session.language}/translation/common`);

        req.log.error('Post operation not defined for OptionGetRunner');
        res.status(404);
        res.render('errors/error', {common: commonContent, error: '404'});
    }
}

export default OptionGetRunner;
export {OptionGetRunner as 'module.exports'};
