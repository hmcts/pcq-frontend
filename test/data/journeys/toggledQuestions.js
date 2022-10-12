'use strict';

const stepList = {
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

const toggledQuestions = [
    {stepName: 'ApplicantDateOfBirth', ftKey: 'ft_enabled'},
    {stepName: 'ApplicantLanguage', ftKey: 'ft_disabled'},
    {stepName: 'ApplicantSex', ftKey: 'ft_enabled', nextStepName: 'ApplicantMaritalStatus'},
    {stepName: 'ApplicantSexualOrientation', ftKey: 'ft_disabled', nextStepName: 'ApplicantEthnicGroup'}
];

module.exports = () => {
    return {
        stepList,
        toggledQuestions
    };
};
