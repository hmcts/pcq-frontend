'use strict';

const pageUnderTest = require('app/steps/ui/endpage/index');

module.exports = function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'en') {
        I.see('You have answered the equality questions');
    } else {
        I.see('Rydych wedi ateb y cwestiynau am gydraddoldeb');
    }
};
