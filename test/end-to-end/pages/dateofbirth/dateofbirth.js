'use strict';

const pageUnderTest = require('app/steps/ui/dateofbirth/index');

module.exports = function (lang) {
    const I = this;
    console.log(pageUnderTest.getUrl());
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'cy') {
        I.click('Rhowch eich dyddiad geni');
        fillField(I);
        I.click('Parhau');
    } else {
        I.click('Enter your date of birth');
        fillField(I);
        I.click('Continue');
    }

};

function fillField(I) {
    I.fillField('#dob-day', '10');
    I.fillField('#dob-month', '2');
    I.fillField('#dob-year', '2019');
}
