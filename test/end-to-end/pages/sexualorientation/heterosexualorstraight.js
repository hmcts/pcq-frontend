'use strict';

const pageUnderTest = require('app/steps/ui/sexualorientation/index');

module.exports = function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'cy') {
        I.click('Hetrorywiol neu syth');
        I.click('Parhau');
    } else {
        I.click('Heterosexual or straight');
        I.click('Continue');
    }
};
