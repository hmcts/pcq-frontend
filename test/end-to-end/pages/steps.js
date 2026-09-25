/* eslint-disable no-undef */
import startpage from './startpage/startpage.js';
import dateofbirth from './dateofbirth/dateofbirth.js';
import dobprefernottosay from './dateofbirth/prefernottosay.js';
import dobvalidations from './dateofbirth/dateofbirthvalidations.js';
import selectlanguageprefernottosay from './language/prefernottosay.js';
import selectenglish from './language/english.js';
import selectotherlanguage from './language/otherlanguage.js';
import selectverywellenglishlevel from './englishlevel/verywell.js';
import sexprefernottosay from './sex/prefernottosay.js';
import selectsexmale from './sex/male.js';
import selectsexfemale from './sex/female.js';
import gendersameassexprefernottosay from './gendersameassex/prefernottosay.js';
import selectyesgendersameassex from './gendersameassex/yesgendersameassex.js';
import selectnogendersameassex from './gendersameassex/nogendersameassex.js';
import sexualorientationprefernottosay from './sexualorientation/prefernottosay.js';
import selectothersexualorientation from './sexualorientation/othersexualorientation.js';
import selecthetersexualorientation from './sexualorientation/heterosexualorstraight.js';
import selectyesmaritalstatus from './maritalstatus/yes.js';
import selectnomaritalstatus from './maritalstatus/no.js';
import maritalstatusprefernottosay from './maritalstatus/prefernottosay.js';
import selectethnicMixedormultipleethnicgroups from './ethnicgroup/Mixedormultipleethnicgroups.js';
import selectmixedwhiteandblackcaribbeanethnicgroup from './mixedethnicgroup/whiteandblackcaribbean.js';
import selectethnicgroup from './ethnicgroup/whiteethnicgroup.js';
import selectprefernottosayethnicgroup from './ethnicgroup/prefernottosay.js';
import selectenglishethnicgroup from './whiteethnicgroup/englishwelshscottishirishbritish.js';
import selectanotherwhiteethnicgroup from './whiteethnicgroup/anotherwhiteethnicgroup.js';
import selectwhiteethnicgroupprefernottosay from './whiteethnicgroup/prefernottosay.js';
import asianethnicgroupprefernottosay from './asianethnicgroup/prefernottosay.js';
import selectasianethnicgroup from './asianethnicgroup/asianethnicgroup.js';
import selectreligionprefernottosay from './religion/prefernottosay.js';
import selectchristianreligion from './religion/christian.js';
import selectotherreligion from './religion/otherreligion.js';
import disabilityprefernottosay from './disability/prefernottosay.js';
import selectyesdisability from './disability/yes.js';
import selectnodisability from './disability/no.js';
import selectyeslimitedalot from './disabilityimplications/yeslimitedalot.js';
import selectdisabilityimplicationsareas from './disabilityimplicationsareas/disabilityimplicationsareas.js';
import selectpregnantprefernottosay from './pregnant/prefernottosay.js';
import selectyespregnant from './pregnant/yes.js';
import selectnopregnant from './pregnant/no.js';
import endpage from './endpage/endpage.js';

export default () => {
    return actor({
        startapply: startpage,
        dateofbirth,
        dobprefernottosay,
        dobvalidations,
        selectlanguageprefernottosay,
        selectenglish,
        selectotherlanguage,
        selectverywellenglishlevel,
        sexprefernottosay,
        selectsexmale,
        selectsexfemale,
        gendersameassexprefernottosay,
        selectyesgendersameassex,
        selectnogendersameassex,
        sexualorientationprefernottosay,
        selectothersexualorientation,
        selecthetersexualorientation,
        selectyesmaritalstatus,
        selectnomaritalstatus,
        maritalstatusprefernottosay,
        selectethnicMixedormultipleethnicgroups,
        selectmixedwhiteandblackcaribbeanethnicgroup,
        selectethnicgroup,
        selectprefernottosayethnicgroup,
        selectenglishethnicgroup,
        selectanotherwhiteethnicgroup,
        selectwhiteethnicgroupprefernottosay,
        asianethnicgroupprefernottosay,
        selectasianethnicgroup,
        selectreligionprefernottosay,
        selectchristianreligion,
        selectotherreligion,
        disabilityprefernottosay,
        selectyesdisability,
        selectnodisability,
        selectyeslimitedalot,
        selectdisabilityimplicationsareas,
        selectpregnantprefernottosay,
        selectyespregnant,
        selectnopregnant,
        endpage
    });
};
