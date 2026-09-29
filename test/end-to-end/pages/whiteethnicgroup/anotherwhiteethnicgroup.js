import pageUnderTest from 'app/steps/ui/ethnicwhite/index.js';

export default function () {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('Another White background');
    I.fillField('#otherDetails', 'otherDetails');
    I.click('Continue');
};
