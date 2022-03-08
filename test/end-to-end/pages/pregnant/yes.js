'use strict';

const pageUnderTest = require('app/steps/ui/pregnant/index');

module.exports = function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'cy') {
        I.click('Ydw');
        I.click('Parhau');
    } else {
        I.click('Yes');
        I.click('Continue');
    }
};
