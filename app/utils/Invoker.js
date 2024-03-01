'use strict';

const {v4: uuidv4} = require('uuid');
const {generateToken} = require('app/components/encryption-token');
const registeredServices = require('app/registeredServices');
const AgeCheck = require('./Constants');

class Invoker {

    get content() {
        const serviceList = registeredServices.map(service => {
            return {
                value: service.serviceId,
                text: service.serviceId
            };
        });

        const actorList = {};
        registeredServices.forEach(service => {
            actorList[service.serviceId] = service.actors;
        });

        const ageCheckList = [
            {value: null, text: 'NONE', selected: true},
            {value: AgeCheck.GreaterThanEighteen, text: '> 18'},
            {value: AgeCheck.SixteenToEighteen, text: '16 - 18'},
            {value: AgeCheck.LessThanSixteen, text: '< 16'},
        ];

        return {
            serviceList,
            actorList,
            ageCheckList
        };
    }

    serviceEndpoint(form) {
        const qs = Object.keys(form)
            .filter(key => form[key] !== '' && key !== '_csrf' && key !== 'authTag')
            .map(key => key + '=' + encodeURIComponent(form[key]))
            .join('&');

        return '/service-endpoint?' + qs;
    }

    fillForm(service, actor, fields) {
        const filler = {};

        fields.forEach(field => {
            filler[field] = this.fieldFiller(service, actor, field);
        });

        return filler;
    }

    fieldFiller(service, actor, field) {
        /*eslint indent: [2, 4, {"SwitchCase": 1}]*/
        switch (field) {
            case 'pcqId':
            case 'ccdCaseId':
                return uuidv4();
            case 'partyId':
                return `${service}_${actor}@test.gov.uk`;
            case 'serviceId':
                return service;
            case 'actor':
                return actor;
            case 'language':
                return 'en';
            case 'returnUrl':
                return `${service}_${actor}.test.gov.uk`;
            default:
                return '';
        }
    }

    generateToken(params) {
        return generateToken(params);
    }

}

module.exports = Invoker;
