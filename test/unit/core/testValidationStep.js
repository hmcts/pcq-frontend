'use strict';

const expect = require('chai').expect;
const ValidationStep = require('app/core/steps/ValidationStep');
const i18next = require('i18next');

describe('ValidationStep', () => {
    describe('schema()', () => {
        it('should throw if schemaFile is missing', (done) => {
            const validationStep = Object.create(ValidationStep.prototype);

            expect(() => validationStep.schema).to.throw(
                TypeError,
                'Step ValidationStep has no schema file in it\'s resource folder'
            );

            done();
        });
    });

    describe('uniqueProperties()', () => {
        it('should map oneOf properties to a flattened type object', (done) => {
            const validationStep = Object.create(ValidationStep.prototype);
            const schema = {
                oneOf: [
                    {
                        properties: {
                            'field-one': {type: 'string'}
                        }
                    },
                    {
                        properties: {
                            'field-two': {type: 'integer'}
                        }
                    }
                ]
            };

            expect(validationStep.uniqueProperties(schema)).to.deep.equal({
                'field-one': {type: 'string'},
                'field-two': {type: 'integer'}
            });
            done();
        });

        it('should throw if schema has no properties and no oneOf', (done) => {
            const validationStep = Object.create(ValidationStep.prototype);

            expect(() => validationStep.uniqueProperties({}))
                .to.throw(
                    Error,
                    'Step ValidationStep has an invalid schema: schema has no properties or oneOf keywords'
                );
            done();
        });
    });

    describe('constructor()', () => {
        it('should set schemaFile, compile schema, and set properties', (done) => {
            const schema = {
                type: 'object',
                properties: {
                    name: {type: 'string'}
                }
            };

            const validationStep = new ValidationStep({}, 'test', 'startpage', i18next, schema, 'en');

            expect(validationStep.schemaFile).to.equal(schema);
            expect(validationStep.validateSchema).to.be.a('function');
            expect(validationStep.properties).to.deep.equal(schema.properties);
            expect(validationStep.validateSchema({name: 'Priyanka'})).to.equal(true);
            done();
        });
    });

    describe('validate()', () => {
        it('should validate ctx when present and return true for valid data', (done) => {
            const schema = {
                type: 'object',
                properties: {
                    name: {type: 'string'}
                },
                required: ['name']
            };

            const validationStep = new ValidationStep({}, 'test', 'startpage', i18next, schema, 'en');
            const [isValid, errors] = validationStep.validate({name: 'Priyanka'}, {}, 'en');

            expect(isValid).to.equal(true);
            expect(errors).to.deep.equal([]);
            done();
        });
    });

    describe('isComplete()', () => {
        it('should return validate result with inProgress status', (done) => {
            const schema = {
                type: 'object',
                properties: {
                    name: {type: 'string'}
                },
                required: ['name']
            };

            const validationStep = new ValidationStep({}, 'test', 'startpage', i18next, schema, 'en');
            const result = validationStep.isComplete({name: 'Priyanka'}, {});

            expect(result).to.deep.equal([true, 'inProgress']);
            done();
        });
    });
});
