import pageUnderTest from 'app/steps/ui/language/index.js';

export default function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'cy') {
        I.click('Saesneg');
        I.click('Parhau');
    } else {
        I.click('English');
        I.click('Continue');
    }
};
