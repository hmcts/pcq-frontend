'use strict';

const pageUnderTest = require('app/steps/ui/ethnicmixed/index');

module.exports = function () {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('White and Black Caribbean');
    I.click('Continue');
};
