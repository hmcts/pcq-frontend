'use strict';

const pageUnderTest = require('app/steps/ui/ethnicgroup/index');

module.exports = function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'en') {
        I.click('White');
        I.click('Continue');
    } else {
        I.click('Gwyn');
        I.click('Parhau');
    }
};
