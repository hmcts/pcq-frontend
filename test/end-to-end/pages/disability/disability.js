'use strict';

const pageUnderTest = require('app/steps/ui/disability/index');

module.exports = function () {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('No');
    I.click('Continue');
};
