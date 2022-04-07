/* eslint-disable no-unused-vars */
'use strict';
/* eslint-disable no-undef */
const {I} = inject();
const TestConfigurator = new (require('test/end-to-end/helpers/TestConfigurator'))();
const pcqId = TestConfigurator.setPcqId();
let lang = 'en';
Before((test) => {
    // perform your code
    test.retries(10); // retry test 10 times
});
Given('I am a probate Citizen user', () => {
    //To:Do : Probate team
});
When('I invoke the PCQs task', () => {
    //To:Do : Probate team
});

Then('I am presented with the PCQ Intro page', () => {
    I.startapply(pcqId, lang);
});

Then('I am presented with the PCQ Intro Welsh page', () => {
    lang = 'cy';
    I.startapply(pcqId, lang);
});

When('I submit all pcq questions', () => {
    I.dateofbirth(lang);
    I.selectenglishorwelsh(lang);
    I.selectsexmale(lang);
    I.selectyesgendersameassex(lang);
    I.selecthetersexualorientation(lang);
    I.selectyesmaritalstatus(lang);
    I.selectethnicgroup(lang);
    I.selectenglishethnicgroup(lang);
    I.selectchristianreligion(lang);
    I.selectyesdisability(lang);
    I.selectyeslimitedalot(lang);
    I.selectdisabilityimplicationsareas(lang);
    I.selectyespregnant(lang);
    I.wait(3);
    I.endpage(lang);
    // I.see('You have answered the equality questions');
});

Then('a record successfully created in database', () => {
    //To:Do:
});

When('I submit No for all pcq questions', () => {
    I.dobvalidations();
    I.selectotherlanguage();
    I.selectverywellenglishlevel();
    I.selectsexfemale();
    I.selectnogendersameassex();
    I.selectothersexualorientation();
    I.selectnomaritalstatus();
    I.selectethnicMixedormultipleethnicgroups();
    I.selectmixedwhiteandblackcaribbeanethnicgroup();
    I.selectotherreligion();
    I.selectnodisability();
    I.selectnopregnant();
    I.wait(3);
    I.see('You have answered the equality questions');
});

When('I submit prefer not to say for all pcq questions', () => {
    I.dobprefernottosay();
    I.selectlanguageprefernottosay();
    I.sexprefernottosay();
    I.gendersameassexprefernottosay();
    I.sexualorientationprefernottosay();
    I.maritalstatusprefernottosay();
    I.selectprefernottosayethnicgroup();
    I.selectwhiteethnicgroupprefernottosay();
    I.selectreligionprefernottosay();
    I.disabilityprefernottosay();
    I.selectpregnantprefernottosay();
    I.wait(3);
    I.see('You have answered the equality questions');
});

After(() => {
    TestConfigurator.getUserData(pcqId);
});
