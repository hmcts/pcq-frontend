import pageUnderTest from 'app/steps/ui/sex/index.js';

export default function () {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('Female');
    I.click('Continue');
};
