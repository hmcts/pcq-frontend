import pageUnderTest from 'app/steps/ui/gender/index.js';

export default function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'cy') {
        I.click('Ydy');
        I.click('Parhau');
    } else {
        I.click('Yes');
        I.click('Continue');
    }
};
