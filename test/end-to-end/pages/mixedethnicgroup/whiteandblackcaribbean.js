import pageUnderTest from 'app/steps/ui/ethnicmixed/index.js';

export default function () {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('White and Black Caribbean');
    I.click('Continue');
};
