import pageUnderTest from 'app/steps/ui/gender/index.js';

export default function () {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('No');
    I.fillField('gender_other', 'othergender');
    I.click('Continue');
};
