import pageUnderTest from 'app/steps/ui/sexualorientation/index.js';

export default function () {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('Other');
    I.fillField('#sexuality_other', 'otherDetails');
    I.click('Continue');
};
