'use strict';

const pageUnderTest = require('app/steps/ui/disabilityimplications/index');

module.exports = function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'cy') {
        I.click('Ydy yn sylweddol');
        I.click('Parhau');
    } else {
        I.click('Yes, limited a lot');
        I.click('Continue');
    }
};
