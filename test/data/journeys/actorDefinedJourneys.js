'use strict';

const getJourney = (actor) => {
    return {stepList: actor === 'withdob' ? withDob : withoutDob};
};

const withDob = {
    StartPage: 'ApplicantDateOfBirth',
    ApplicantDateOfBirth: 'ApplicantLanguage',
    ApplicantLanguage: {
        otherLanguage: 'ApplicantEnglishLevel',
        otherwise: 'ApplicantSex'
    },
    ApplicantEnglishLevel: 'ApplicantSex',
    ApplicantSex: 'ApplicantGenderSameAsSex',
    ApplicantGenderSameAsSex: 'ApplicantSexualOrientation',
    ApplicantSexualOrientation: 'ApplicantMaritalStatus',
    ApplicantMaritalStatus: 'ApplicantEthnicGroup',
    ApplicantEthnicGroup: {
        White: 'ApplicantEthnicBackgroundWhite',
        Mixed: 'ApplicantEthnicBackgroundMixed',
        Asian: 'ApplicantEthnicBackgroundAsian',
        Black: 'ApplicantEthnicBackgroundBlack',
        Other: 'ApplicantEthnicBackgroundOther',
        otherwise: 'ApplicantReligion'
    },
    ApplicantEthnicBackgroundWhite: 'ApplicantReligion',
    ApplicantEthnicBackgroundMixed: 'ApplicantReligion',
    ApplicantEthnicBackgroundAsian: 'ApplicantReligion',
    ApplicantEthnicBackgroundBlack: 'ApplicantReligion',
    ApplicantEthnicBackgroundOther: 'ApplicantReligion',
    ApplicantReligion: 'ApplicantDisability',
    ApplicantDisability: {
        Yes: 'ApplicantDisabilityImplications',
        otherwise: 'ApplicantPregnant'
    },
    ApplicantDisabilityImplications: {
        Yes: 'ApplicantDisabilityImplicationAreas',
        otherwise: 'ApplicantPregnant'
    },
    ApplicantDisabilityImplicationAreas: 'ApplicantPregnant',
    ApplicantPregnant: 'EndPage'
};

const withoutDob = {
    StartPage: 'ApplicantLanguage',
    ApplicantLanguage: {
        otherLanguage: 'ApplicantEnglishLevel',
        otherwise: 'ApplicantSex'
    },
    ApplicantEnglishLevel: 'ApplicantSex',
    ApplicantSex: 'ApplicantGenderSameAsSex',
    ApplicantGenderSameAsSex: 'ApplicantSexualOrientation',
    ApplicantSexualOrientation: 'ApplicantMaritalStatus',
    ApplicantMaritalStatus: 'ApplicantEthnicGroup',
    ApplicantEthnicGroup: {
        White: 'ApplicantEthnicBackgroundWhite',
        Mixed: 'ApplicantEthnicBackgroundMixed',
        Asian: 'ApplicantEthnicBackgroundAsian',
        Black: 'ApplicantEthnicBackgroundBlack',
        Other: 'ApplicantEthnicBackgroundOther',
        otherwise: 'ApplicantReligion'
    },
    ApplicantEthnicBackgroundWhite: 'ApplicantReligion',
    ApplicantEthnicBackgroundMixed: 'ApplicantReligion',
    ApplicantEthnicBackgroundAsian: 'ApplicantReligion',
    ApplicantEthnicBackgroundBlack: 'ApplicantReligion',
    ApplicantEthnicBackgroundOther: 'ApplicantReligion',
    ApplicantReligion: 'ApplicantDisability',
    ApplicantDisability: {
        Yes: 'ApplicantDisabilityImplications',
        otherwise: 'ApplicantPregnant'
    },
    ApplicantDisabilityImplications: {
        Yes: 'ApplicantDisabilityImplicationAreas',
        otherwise: 'ApplicantPregnant'
    },
    ApplicantDisabilityImplicationAreas: 'ApplicantPregnant',
    ApplicantPregnant: 'EndPage'
};

module.exports = getJourney;
