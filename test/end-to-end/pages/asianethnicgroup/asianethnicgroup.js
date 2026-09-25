import pageUnderTest from 'app/steps/ui/ethnicgroup/index.js';

export default function () {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('Indian');
    I.click('Continue');
};
