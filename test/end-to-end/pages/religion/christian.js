'use strict';

const pageUnderTest = require('app/steps/ui/religion/index');

module.exports = function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'cy') {
        I.click('Cristnogaeth');
        I.click('Parhau');
    } else {
        I.click('Christian');
        I.click('Continue');
    }
};
