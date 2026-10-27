import pageUnderTest from 'app/steps/ui/disabilityimplications/index.js';

export default function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'cy') {
        I.click('Ydy yn sylweddol');
        I.click('Parhau');
    } else {
        I.click('Yes, limited a lot');
        I.click('Continue');
    }
};
