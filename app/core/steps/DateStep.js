import ValidationStep from './ValidationStep.js';
import moment from 'moment';
import config from 'config';
import utils from '../../components/step-utils.js';

class DateStep extends ValidationStep {

    dateName() {
        return null;
    }

    getContextData(req) {
        let ctx = super.getContextData(req);
        ctx = this.parseDate(ctx, this.dateName(), req.session.language);
        return ctx;
    }

    parseDate(ctx, dateNames, language = 'en') {
        dateNames.forEach((dateName) => {
            const [day, month, year] = [`${dateName}-day`, `${dateName}-month`, `${dateName}-year`];

            const setDate = (d) => (ctx[d] ? Number.parseInt(ctx[d]) || ctx[d] : ctx[d]);
            ctx[day] = setDate(day);
            ctx[month] = setDate(month);
            ctx[year] = setDate(year);

            const date = moment(`${ctx[day]}/${ctx[month]}/${ctx[year]}`, config.dateFormat).parseZone();

            ctx[`${dateName}`] = '';

            if (date.isValid()) {
                ctx[`${dateName}`] = date.toISOString();
                ctx[`${dateName}-formattedDate`] = utils.formattedDate(date, language);
            }
        });

        return ctx;
    }
}

export default DateStep;
export {DateStep as 'module.exports'};
