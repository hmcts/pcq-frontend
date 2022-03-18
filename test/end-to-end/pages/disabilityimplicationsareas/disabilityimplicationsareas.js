'use strict';

const pageUnderTest = require('app/steps/ui/disabilityimplicationsareas/index');

module.exports = function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'cy') {
        I.click('Gweledigaeth');
        I.click('Parhau');
    } else {
        I.click('Vision');
        I.click('Continue');
    }
};
