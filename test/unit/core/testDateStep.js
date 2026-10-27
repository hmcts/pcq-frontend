import chai from 'chai';
import DateStep from 'app/core/steps/DateStep.js';
import sinon from 'sinon';
import i18next from 'i18next';
import schema from 'app/steps/ui/dateofbirth/schema.json' with { type: 'json' };

const { expect } = chai;

describe('DateStep', () => {
    const steps = {};
    const section = 'deceased';
    const resourcePath = 'dateofbirth';
    const language = 'en';
    const dateStep = new DateStep(steps, section, resourcePath, i18next, schema, language);

    describe('dateName()', () => {
        it('should return null', (done) => {
            const dateName = dateStep.dateName();

            expect(dateName).to.equal(null);
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the correct ctx with a parsed date', (done) => {
            const req = {
                session: {
                    language: 'en',
                    ctx: {
                        deceased: {
                            'firstName': 'Dee',
                            'lastName': 'Ceased',
                            'dob-day': '15',
                            'dob-month': '12',
                            'dob-year': '1956',
                            'dod-day': '4',
                            'dod-month': '6',
                            'dod-year': '2018'
                        }
                    }
                }
            };
            const parseDateStub = sinon.stub(dateStep, 'parseDate').returns({
                'firstName': 'Dee',
                'lastName': 'Ceased',
                'dob-day': 15,
                'dob-month': 12,
                'dob-year': 1956,
                'dob-date': '1956-12-15T00:00:00.000Z',
                'dob-formattedDate': '15 December 1956',
                'dod-day': 4,
                'dod-month': 6,
                'dod-year': 2018,
                'dod-date': '2018-06-04T23:00:00.000Z',
                'dod-formattedDate': '4 June 2018'
            });
            const dateNameStub = sinon.stub(dateStep, 'dateName').returns(['dob', 'dod']);
            const ctx = dateStep.getContextData(req);

            expect(ctx).to.deep.equal({
                'firstName': 'Dee',
                'lastName': 'Ceased',
                'dob-day': 15,
                'dob-month': 12,
                'dob-year': 1956,
                'dob-date': '1956-12-15T00:00:00.000Z',
                'dob-formattedDate': '15 December 1956',
                'dod-day': 4,
                'dod-month': 6,
                'dod-year': 2018,
                'dod-date': '2018-06-04T23:00:00.000Z',
                'dod-formattedDate': '4 June 2018'
            });
            parseDateStub.restore();
            dateNameStub.restore();
            done();
        });
    });

    describe('parseDate()', () => {
        it('should parse an invalid date and store it in the context as null', (done) => {
            const dateNames = ['dob', 'dod'];
            const testCtx = {
                'dob-day': '15',
                'dob-month': '13',
                'dob-year': '1956',
                'dod-day': '4',
                'dod-month': '6',
                'dod-year': '2018'
            };
            const ctx = dateStep.parseDate(testCtx, dateNames, 'en');
            expect(ctx).to.deep.equal({
                'dob-day': 15,
                'dob-month': 13,
                'dob-year': 1956,
                'dob': '',
                'dod-day': 4,
                'dod-month': 6,
                'dod-year': 2018,
                'dod': '2018-06-04T00:00:00.000Z',
                'dod-formattedDate': '4 June 2018'
            });
            done();
        });

        it('should parse a valid date and store it in the context', (done) => {
            const dateNames = ['dob', 'dod'];
            const testCtx = {
                'dob-day': '15',
                'dob-month': '12',
                'dob-year': '1956',
                'dod-day': '4',
                'dod-month': '6',
                'dod-year': '2018'
            };
            const ctx = dateStep.parseDate(testCtx, dateNames, 'en');
            expect(ctx).to.deep.equal({
                'dob-day': 15,
                'dob-month': 12,
                'dob-year': 1956,
                'dob': '1956-12-15T00:00:00.000Z',
                'dob-formattedDate': '15 December 1956',
                'dod-day': 4,
                'dod-month': 6,
                'dod-year': 2018,
                'dod': '2018-06-04T00:00:00.000Z',
                'dod-formattedDate': '4 June 2018'
            });
            done();
        });
    });
});
