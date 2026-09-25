import pageUnderTest from 'app/steps/ui/sexualorientation/index.js';

export default function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'cy') {
        I.click('Hetrorywiol neu syth');
        I.click('Parhau');
    } else {
        I.click('Heterosexual or straight');
        I.click('Continue');
    }
};
