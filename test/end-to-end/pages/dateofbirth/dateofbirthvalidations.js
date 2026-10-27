import pageUnderTest from 'app/steps/ui/dateofbirth/index.js';

export default function () {
    const I = this;
    I.amOnPage(pageUnderTest.getUrl());
    I.seeCurrentUrlEquals(pageUnderTest.getUrl());
    I.click('Enter your date of birth');
    I.fillField('#dob-day', '45');
    I.fillField('#dob-month', '2');
    I.fillField('#dob-year', '2019');
    I.click('Continue');
    I.wait(2);
    I.see('You haven’t entered a valid day that you were born');
    I.fillField('#dob-day', '5');
    I.click('Continue');
};
