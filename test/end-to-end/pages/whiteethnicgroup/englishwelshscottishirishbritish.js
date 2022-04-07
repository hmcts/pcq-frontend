'use strict';

const pageUnderTest = require('app/steps/ui/ethnicwhite/index');

module.exports = function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'cy') {
        I.click('Cymraeg/Saesneg/Albanaidd/Gwyddelig Gogledd Iwerddon/Prydeinig');
        I.click('Parhau');
    } else {
        I.click('English, Welsh, Scottish, Northern Irish or British');
        I.click('Continue');
    }
};
