import pageUnderTest from 'app/steps/ui/ethnicgroup/index.js';

export default function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'cy') {
        I.click('Gwyn');
        I.click('Parhau');
    } else {
        I.click('White');
        I.click('Continue');
    }
};
