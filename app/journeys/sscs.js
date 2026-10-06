'use strict';

const stepList = {
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

const toggledQuestions = [
    {stepName: 'ApplicantDisability', ftKey: 'ft_sscs_disability_stage_1', nextStepName: 'ApplicantDisabilityImplicationAreas'},
    {stepName: 'ApplicantDisabilityImplicationAreas', ftKey: 'ft_sscs_disability_stage_2'},
];

export default () => {
    return {
        stepList,
        toggledQuestions,
    };
};
