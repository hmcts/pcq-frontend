import pageUnderTest from 'app/steps/ui/disabilityimplicationsareas/index.js';

export default function (lang) {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());

    if (lang === 'cy') {
        I.click('Gweledigaeth');
        I.click('Parhau');
    } else {
        I.click('Vision');
        I.click('Continue');
    }
};
