'use strict';

const expect = require('chai').expect;
const prefixHttps = require('app/components/string-utils').prefixHttps;


describe('prefixHttps', () => {
    it('should add https:// to a URL without a protocol', () => {
        const url = 'probate_applicant.test.gov.uk';
        const result = prefixHttps(url);
        expect(result).to.equal('https://probate_applicant.test.gov.uk');
    });

    it('should not modify a URL that already has https://', () => {
        const url = 'https://probate_applicant.test.gov.uk';
        const result = prefixHttps(url);
        expect(result).to.equal('https://probate_applicant.test.gov.uk');
    });

    it('should return an empty string for a non-whitelisted URL', () => {
        const url = 'non-whitelisted.com';
        const result = prefixHttps(url);
        expect(result).to.equal('');
    });

    it('should prefix the URL that includes platform.hmcts.net', () => {
        const url = 'platform.hmcts.net';
        const result = prefixHttps(url);
        expect(result).to.equal('https://platform.hmcts.net');
    });

    it('should not modify a URL that starts with https://localhost', () => {
        const url = 'https://localhost:3000';
        const result = prefixHttps(url);
        expect(result).to.equal('https://localhost:3000');
    });

    it('should not modify a URL that starts with http://localhost', () => {
        const url = 'http://localhost:3000';
        const result = prefixHttps(url);
        expect(result).to.equal('http://localhost:3000');
    });

    it('should trim and remove spaces from the URL', () => {
        const url = '  probate_applicant.test.gov.uk  ';
        const result = prefixHttps(url);
        expect(result).to.equal('https://probate_applicant.test.gov.uk');
    });

    it('should add prefix to string for a whitelist URL for probate', () => {
        const url = 'www.apply-for-probate.service.gov.uk/task-list';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.apply-for-probate.service.gov.uk/task-list');
    });

    it('should add prefix to string for a whitelist URL for probate caveat', () => {
        const url = 'www.apply-for-probate.service.gov.uk/caveats/summary';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.apply-for-probate.service.gov.uk/caveats/summary');
    });

    it('should return url to string for aat url for probate', () => {
        const url = 'https://probate.aat.platform.hmcts.net/task-list';
        const result = prefixHttps(url);
        expect(result).to.equal('https://probate.aat.platform.hmcts.net/task-list');
    });

    it('should return url to string for aat URL for probate caveat', () => {
        const url = 'https://probate.aat.platform.hmcts.net/caveats/summary';
        const result = prefixHttps(url);
        expect(result).to.equal('https://probate.aat.platform.hmcts.net/caveats/summary');
    });

    it('should return url to string for preview URL for probate', () => {
        const url = 'https://probate-frontend-pr-2227.preview.platform.hmcts.net/task-list';
        const result = prefixHttps(url);
        expect(result).to.equal('https://probate-frontend-pr-2227.preview.platform.hmcts.net/task-list');
    });

    it('should return url to string for preview URL for probate caveat', () => {
        const url = 'https://probate-caveats-fe-pr-626.preview.platform.hmcts.net/caveats/summary';
        const result = prefixHttps(url);
        expect(result).to.equal('https://probate-caveats-fe-pr-626.preview.platform.hmcts.net/caveats/summary');
    });

    it('should add prefix to string for a claim whitelist URL for moneyClaimService', () => {
        const url = 'www.moneyclaims.service.gov.uk/claim/check-and-send';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.moneyclaims.service.gov.uk/claim/check-and-send');
    });

    it('should add prefix to string for a response whitelist URL for moneyClaimService', () => {
        const url = ' https://www.moneyclaims.service.gov.uk/case/<caseref>/response/check-and-send';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.moneyclaims.service.gov.uk/case/<caseref>/response/check-and-send');
    });

    it('should add prefix to string for a whitelist URL for moneyClaimService 2', () => {
        const url = 'www1.moneyclaims.service.gov.uk/case/6f1b84a3-7d4c-4b5e-9318-c2ad6fae367d/response/check-and-send';
        const result = prefixHttps(url);
        expect(result).to.equal(
            'https://www1.moneyclaims.service.gov.uk/case/6f1b84a3-7d4c-4b5e-9318-c2ad6fae367d/response/check-and-send');
    });

    it('should returnURL string for a claim whitelist URL for moneyClaimService2', () => {
        const url = 'https://www.moneyclaims.service.gov.uk/case/check-and-send';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.moneyclaims.service.gov.uk/case/check-and-send');
    });

    it('should returnURL string for a whitelist URL for moneyClaimService', () => {
        const url = 'https://www.ocmc.service.gov.uk/case/1234567/response/check-and-send';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.ocmc.service.gov.uk/case/1234567/response/check-and-send');
    });

    it('should return same string for a aat URL for moneyClaimService', () => {
        const url = 'https://moneyclaims.aat.platform.hmcts.net/case/1234567/response/check-and-send';
        const result = prefixHttps(url);
        expect(result).to.equal('https://moneyclaims.aat.platform.hmcts.net/case/1234567/response/check-and-send');
    });

    it('should return same string for a aat URL for moneyClaimService 2', () => {
        const url = 'https://ocmc.aat.platform.hmcts.net/case/<caseref>/response/check-and-send';
        const result = prefixHttps(url);
        expect(result).to.equal('https://ocmc.aat.platform.hmcts.net/case/<caseref>/response/check-and-send');
    });

    it('should return same string for a claim aat URL for moneyClaimService', () => {
        const url = 'https://moneyclaims.aat.platform.hmcts.net/claim/check-and-send';
        const result = prefixHttps(url);
        expect(result).to.equal('https://moneyclaims.aat.platform.hmcts.net/claim/check-and-send');
    });

    it('should return same string for a claim aat URL for moneyClaimService 2', () => {
        const url = 'https://ocmc.aat.platform.hmcts.net/claim/check-and-send';
        const result = prefixHttps(url);
        expect(result).to.equal('https://ocmc.aat.platform.hmcts.net/claim/check-and-send');
    });

    it('should add prefix to string for a whitelist URL for apply divorce service', () => {
        const url = 'www.apply-divorce.service.gov.uk/check-your-answers';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.apply-divorce.service.gov.uk/check-your-answers');
    });

    it('should add prefix to string for a aat 1 URL for apply divorce service', () => {
        const url = 'www.nfdiv-apply-for-divorce.aat.platform.hmcts.net/check-your-answers';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.nfdiv-apply-for-divorce.aat.platform.hmcts.net/check-your-answers');
    });

    it('should add prefix to string for a aat 2 URL for apply divorce service', () => {
        const url = 'www.nfdiv.aat.platform.hmcts.net';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.nfdiv.aat.platform.hmcts.net');
    });

    it('should add prefix to string for a staging URL for apply divorce service', () => {
        const url = 'www.nfdiv-frontend-staging.aat.platform.hmcts.net/check-your-answers';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.nfdiv-frontend-staging.aat.platform.hmcts.net/check-your-answers');
    });

    it('should add prefix to string for a whitelist URL for end civil partnership', () => {
        const url = 'www.end-civil-partnership.service.gov.uk/check-your-answers';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.end-civil-partnership.service.gov.uk/check-your-answers');
    });

    it('should add prefix to string for a aat URL for end civil partnership', () => {
        const url = 'www.nfdiv-end-civil-partnership.aat.platform.hmcts.net/check-your-answers';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.nfdiv-end-civil-partnership.aat.platform.hmcts.net/check-your-answers');
    });

    it('should add prefix to string for a whitelist URL for SSCS', () => {
        const url = 'www.appeal-benefit-decision.service.gov.uk/check-your-appeal';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.appeal-benefit-decision.service.gov.uk/check-your-appeal');
    });

    it('should add prefix to string for a whitelist URL for SSCS 2', () => {
        const url = 'www.appeal-benefit-decision.service.gov.uk/benefit-type';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.appeal-benefit-decision.service.gov.uk/benefit-type');
    });

    it('should add prefix to string for a aat URL for SSCS', () => {
        const url = 'https://benefit-appeal.aat.platform.hmcts.net/benefit-type';
        const result = prefixHttps(url);
        expect(result).to.equal('https://benefit-appeal.aat.platform.hmcts.net/benefit-type');
    });

    it('should add prefix to string for a whitelist URL for IAC', () => {
        const url = 'www.appeal-immigration-asylum-decision.service.gov.uk/about-appeal';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.appeal-immigration-asylum-decision.service.gov.uk/about-appeal');
    });

    it('should add prefix to string for a aat URL for IAC', () => {
        const url = 'immigration-appeal.aat.platform.hmcts.net/about-appeal';
        const result = prefixHttps(url);
        expect(result).to.equal('https://immigration-appeal.aat.platform.hmcts.net/about-appeal');
    });

    it('should add prefix to string for a whitelist URL for ADOPTION', () => {
        const url = 'apply-to-adopt-a-child-placed-in-your-care.service.gov.uk/review-pay-submit/check-your-answers';
        const result = prefixHttps(url);
        expect(result).to.equal('https://apply-to-adopt-a-child-placed-in-your-care.service.gov.uk/review-pay-submit/check-your-answers');
    });

    it('should add prefix to string for a aat URL for ADOPTION', () => {
        const url = 'adoption-web.aat.platform.hmcts.net/review-pay-submit/check-your-answers';
        const result = prefixHttps(url);
        expect(result).to.equal('https://adoption-web.aat.platform.hmcts.net/review-pay-submit/check-your-answers');
    });

    it('should add prefix to string for a whitelist URL for ET', () => {
        const url = 'www.claim-employment-tribunals.service.gov.uk/check-your-answers';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.claim-employment-tribunals.service.gov.uk/check-your-answers');
    });

    it('should add prefix to string for a aat URL for ET', () => {
        const url = 'et-sya.aat.platform.hmcts.net/check-your-answers';
        const result = prefixHttps(url);
        expect(result).to.equal('https://et-sya.aat.platform.hmcts.net/check-your-answers');
    });


    it('should add prefix to string for a whitelist URL for ONLINE_PLEA', () => {
        const url = 'onlineplea.cjscp.org.uk/onlineplea/check-your-answers.xhtml';
        const result = prefixHttps(url);
        expect(result).to.equal('https://onlineplea.cjscp.org.uk/onlineplea/check-your-answers.xhtml');
    });

    it('should return same url for pre production URL for ONLINE_PLEA', () => {
        const url = 'https://onlineplea.prp.cjscp.org.uk/onlineplea/start.xhtml';
        const result = prefixHttps(url);
        expect(result).to.equal('https://onlineplea.prp.cjscp.org.uk/onlineplea/start.xhtml');
    });

    it('should return same url for dev URL for ONLINE_PLEA', () => {
        const url = 'https://onlineplea.sit.cjscp.org.uk/onlineplea/start.xhtml?locale=en';
        const result = prefixHttps(url);
        expect(result).to.equal('https://onlineplea.sit.cjscp.org.uk/onlineplea/start.xhtml?locale=en');
    });

    it('should add prefix to string for a whitelist URL for SpecialTribunals_CIC', () => {
        const url = 'special-tribunals.service.gov.uk/check-your-answers';
        const result = prefixHttps(url);
        expect(result).to.equal('https://special-tribunals.service.gov.uk/check-your-answers');
    });

    it('should add prefix to string for a aat URL for SpecialTribunals_CIC', () => {
        const url = 'sptribs-frontend.aat.platform.hmcts.net/check-your-answers';
        const result = prefixHttps(url);
        expect(result).to.equal('https://sptribs-frontend.aat.platform.hmcts.net/check-your-answers');
    });

    it('should add prefix to string for a whitelist URL for JurorDigital', () => {
        const url = 'reply-jury-summons.service.gov.uk/steps/confirm-information';
        const result = prefixHttps(url);
        expect(result).to.equal('https://reply-jury-summons.service.gov.uk/steps/confirm-information');
    });

    it('should add prefix to string for a staging URL for JurorDigital', () => {
        const url = 'juror-public.staging.apps.hmcts.net/steps/confirm-information';
        const result = prefixHttps(url);
        expect(result).to.equal('https://juror-public.staging.apps.hmcts.net/steps/confirm-information');
    });

    it('should add prefix to string for a localhost URL for prl_ca', () => {
        const url = 'http://localhost:3001/applicant/pcq/equality/c100-rebuild';
        const result = prefixHttps(url);
        expect(result).to.equal('http://localhost:3001/applicant/pcq/equality/c100-rebuild');
    });

    it('should add prefix to string for a localhost URL 2 for prl_ca', () => {
        const url = 'http://localhost:3001/respondent/pcq/equality/c7-response';
        const result = prefixHttps(url);
        expect(result).to.equal('http://localhost:3001/respondent/pcq/equality/c7-response');
    });

    it('should add prefix to string for a aat URL 1 for prl_ca', () => {
        const url = 'https://privatelaw.aat.platform.hmcts.net/applicant/pcq/equality/c100-rebuild';
        const result = prefixHttps(url);
        expect(result).to.equal('https://privatelaw.aat.platform.hmcts.net/applicant/pcq/equality/c100-rebuild');
    });

    it('should add prefix to string for a aat URL 2 for prl_ca', () => {
        const url = 'https://privatelaw.aat.platform.hmcts.net/respondent/pcq/equality/c7-response';
        const result = prefixHttps(url);
        expect(result).to.equal('https://privatelaw.aat.platform.hmcts.net/respondent/pcq/equality/c7-response');
    });

    it('should add prefix to string for a whitelist URL 1 for prl_ca', () => {
        const url = 'https://www.apply-to-court-about-child-arrangements-c100.service.gov.uk/applicant/pcq/equality/c100-rebuild';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.apply-to-court-about-child-arrangements-c100.service.gov.uk/applicant/pcq/equality/c100-rebuild');
    });

    it('should add prefix to string for a whitelist URL 2 for prl_ca', () => {
        const url = 'https://www.apply-to-court-about-child-arrangements-c100.service.gov.uk/respondent/pcq/equality/c7-response';
        const result = prefixHttps(url);
        expect(result).to.equal('https://www.apply-to-court-about-child-arrangements-c100.service.gov.uk/respondent/pcq/equality/c7-response');
    });
    
});