'use strict';

const pageUnderTest = require('app/steps/ui/language/index');

module.exports = function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'cy') {
        I.click('Cymraeg neu Saesneg');
        I.click('Parhau');
    } else {
        I.click('English or Welsh');
        I.click('Continue');
    }
};
