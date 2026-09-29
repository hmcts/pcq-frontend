import pageUnderTest from 'app/steps/ui/englishlevel/index.js';

export default function () {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('Very well');
    I.click('Continue');
};
