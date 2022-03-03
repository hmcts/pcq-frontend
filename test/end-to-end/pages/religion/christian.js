'use strict';

const pageUnderTest = require('app/steps/ui/religion/index');

module.exports = function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'en') {
        I.click('Christian');
        I.click('Continue');
    } else {
        I.click('Cristnogaeth');
        I.click('Parhau');
    }
};
