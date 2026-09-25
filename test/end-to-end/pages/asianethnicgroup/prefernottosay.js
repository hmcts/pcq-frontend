import pageUnderTest from 'app/steps/ui/ethnicgroup/index.js';

export default function () {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('Prefer not to say');
    I.click('Continue');
};
