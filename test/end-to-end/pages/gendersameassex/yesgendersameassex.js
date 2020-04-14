'use strict';

const pageUnderTest = require('app/steps/ui/gender/index');

module.exports = function () {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('Yes');
    I.click('Continue');
};
