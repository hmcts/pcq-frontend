import pageUnderTest from 'app/steps/ui/disability/index.js';

export default function () {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('No');
    I.click('Continue');
};
