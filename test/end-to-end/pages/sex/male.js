'use strict';

const pageUnderTest = require('app/steps/ui/sex/index');

module.exports = function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'cy') {
        I.click('Gwryw');
        I.click('Parhau');
    } else {
        I.click('Male');
        I.click('Continue');
    }
};
