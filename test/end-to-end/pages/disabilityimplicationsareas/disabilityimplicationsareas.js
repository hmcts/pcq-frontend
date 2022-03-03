'use strict';

const pageUnderTest = require('app/steps/ui/disabilityimplicationsareas/index');

module.exports = function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'en') {
        I.click('Vision');
        I.click('Continue');
    } else {
        I.click('Gweledigaeth');
        I.click('Parhau');
    }
};
