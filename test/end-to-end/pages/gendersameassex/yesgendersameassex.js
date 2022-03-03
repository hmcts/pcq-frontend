'use strict';

const pageUnderTest = require('app/steps/ui/gender/index');

module.exports = function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'en') {
        I.click('Yes');
        I.click('Continue');
    } else {
        I.click('Ydy');
        I.click('Parhau');
    }
};
