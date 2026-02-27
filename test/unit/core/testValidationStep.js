'use strict';

const expect = require('chai').expect;
const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
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
        it('should return schema properties when properties keyword is present', (done) => {
            const validationStep = Object.create(ValidationStep.prototype);
            const schema = {
                properties: {
                    name: {type: 'string'}
                }
            };

            expect(validationStep.uniqueProperties(schema)).to.deep.equal(schema.properties);
            done();
        });

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
        before(() => {
            // Initialize i18next before exercising invalid-path generateErrors calls.
            FieldError('crossField', 'oneOf', 'startpage', {}, 'en');
        });

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

        it('should strip empty string fields from ctx before validation', (done) => {
            const schema = {
                type: 'object',
                properties: {
                    name: {type: 'string'},
                    optionalField: {type: 'string'}
                },
                required: ['name']
            };

            const validationStep = new ValidationStep({}, 'test', 'startpage', i18next, schema, 'en');
            const ctx = {name: 'Priyanka', optionalField: '   '};

            const [isValid, errors] = validationStep.validate(ctx, {}, 'en');

            expect(isValid).to.equal(true);
            expect(errors).to.deep.equal([]);
            expect(ctx).to.deep.equal({name: 'Priyanka'});
            done();
        });

        it('should return false and generated errors for invalid data', (done) => {
            const schema = {
                type: 'object',
                properties: {
                    name: {type: 'string'}
                },
                required: ['name']
            };

            const validationStep = new ValidationStep({}, 'test', 'startpage', i18next, schema, 'en');
            const [isValid, errors] = validationStep.validate({}, {}, 'en');

            expect(isValid).to.equal(false);
            expect(errors).to.have.length(1);
            expect(errors[0].field).to.equal('name');
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
