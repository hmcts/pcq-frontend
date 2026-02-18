'use strict';

const expect = require('chai').expect;
const FieldError = require('app/components/error');

describe('error', () => {
    describe('generateErrors() extractErrorParam', () => {
        before(() => {
            // Ensure i18next is initialized before generateErrors() calls changeLanguage().
            FieldError('crossField', 'oneOf', 'startpage', {}, 'en');
        });

        it('should prefer params.missingProperty when present', () => {
            const errors = FieldError.generateErrors([
                {keyword: 'type', params: {missingProperty: 'dob-day'}, instancePath: '/ignored'}
            ], {}, {}, 'startpage', 'en');

            expect(errors[0].field).to.equal('dob-day');
        });

        it('should use first segment from instancePath when missingProperty is absent', () => {
            const errors = FieldError.generateErrors([
                {keyword: 'type', params: {}, instancePath: '/dob-year'}
            ], {}, {}, 'startpage', 'en');

            expect(errors[0].field).to.equal('dob-year');
        });

        it('should return undefined field when neither missingProperty nor instancePath is available', () => {
            const errors = FieldError.generateErrors([
                {keyword: 'type', params: {}}
            ], {}, {}, 'startpage', 'en');

            expect(errors[0].field).to.equal(undefined);
        });
    });

    describe('mapErrorsToFields() populateErrors', () => {
        it('should flatten nested error arrays before mapping to fields', () => {
            const fields = {};
            const errors = [
                [
                    false,
                    [{
                        field: 'dob-day',
                        href: '#dob-day',
                        msg: {summary: 'Day missing', message: 'Enter a day'}
                    }]
                ],
                [
                    false,
                    [{
                        field: 'dob-month',
                        href: '#dob-month',
                        msg: {summary: 'Month missing', message: 'Enter a month'}
                    }]
                ]
            ];

            const result = FieldError.mapErrorsToFields(fields, errors);

            expect(result['dob-day'].error).to.equal(true);
            expect(result['dob-day'].href).to.equal('#dob-day');
            expect(result['dob-month'].error).to.equal(true);
            expect(result['dob-month'].href).to.equal('#dob-month');
        });

        it('should map flat error arrays directly to fields', () => {
            const fields = {};
            const errors = [{
                field: 'dob-year',
                href: '#dob-year',
                msg: {summary: 'Year invalid', message: 'Enter a valid year'}
            }];

            const result = FieldError.mapErrorsToFields(fields, errors);

            expect(result['dob-year'].error).to.equal(true);
            expect(result['dob-year'].errorMessage).to.deep.equal({
                summary: 'Year invalid',
                message: 'Enter a valid year'
            });
            expect(result['dob-year'].href).to.equal('#dob-year');
        });
    });
});
