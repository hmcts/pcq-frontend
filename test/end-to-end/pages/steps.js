'use strict';

const requireDirectory = require('require-directory');
const steps = requireDirectory(module);

module.exports = () => {
    return actor({
        startapply: steps.startpage.startpage,
        dateofbirth: steps.dateofbirth.dateofbirth,
        dobprefernottosay: steps.dateofbirth.prefernottosay,
        dobvalidations: steps.dateofbirth.dateofbirthvalidations,
        selectlanguageprefernottosay: steps.language.prefernottosay,
        selectenglishorwelsh: steps.language.englishorwelsh,
        selectotherlanguage: steps.language.otherlanguage,
        selectverywellenglishlevel: steps.englishlevel.verywell,
        sexprefernottosay: steps.sex.prefernottosay,
        selectsexmale: steps.sex.male,
        selectsexfemale: steps.sex.female,
        gendersameassexprefernottosay: steps.gendersameassex.prefernottosay,
        selectyesgendersameassex: steps.gendersameassex.yesgendersameassex,
        selectnogendersameassex: steps.gendersameassex.nogendersameassex,
        sexualorientationprefernottosay: steps.sexualorientation.prefernottosay,
        selectothersexualorientation: steps.sexualorientation.othersexualorientation,
        selecthetersexualorientation: steps.sexualorientation.heterosexualorstraight,
        selectyesmaritalstatus: steps.maritalstatus.yes,
        selectnomaritalstatus: steps.maritalstatus.no,
        maritalstatusprefernottosay: steps.maritalstatus.prefernottosay,
        selectethnicMixedormultipleethnicgroups: steps.ethnicgroup.Mixedormultipleethnicgroups,
        selectmixedwhiteandblackcaribbeanethnicgroup: steps.mixedethnicgroup.whiteandblackcaribbean,
        selectethnicgroup: steps.ethnicgroup.whiteethnicgroup,
        selectprefernottosayethnicgroup: steps.ethnicgroup.prefernottosay,
        selectenglishethnicgroup: steps.whiteethnicgroup.englishwelshscottishirishbritish,
        selectanotherwhiteethnicgroup: steps.whiteethnicgroup.anotherwhiteethnicgroup,
        selectwhiteethnicgroupprefernottosay: steps.whiteethnicgroup.prefernottosay,
        asianethnicgroupprefernottosay: steps.asianethnicgroup.prefernottosay,
        selectasianethnicgroup: steps.asianethnicgroup.asianethnicgroup,
        selectreligionprefernottosay: steps.religion.prefernottosay,
        selectchristianreligion: steps.religion.christian,
        selectotherreligion: steps.religion.otherreligion,
        disabilityprefernottosay: steps.disability.prefernottosay,
        selectyesdisability: steps.disability.yes,
        selectnodisability: steps.disability.no,
        selectyeslimitedalot: steps.disabilityimplications.yeslimitedalot,
        selectdisabilityimplicationsareas: steps.disabilityimplicationsareas.disabilityimplicationsareas,
        selectpregnantprefernottosay: steps.pregnant.prefernottosay,
        selectyespregnant: steps.pregnant.yes,
        selectnopregnant: steps.pregnant.no,
        endpage: steps.endpage.endpage
    });
};
