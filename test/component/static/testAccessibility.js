'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('config');
const commonContent = require('app/resources/en/translation/common');
const accessibility = require('app/resources/en/translation/static/accessibility');

describe('accessibility', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('Accessibility');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page', (done) => {
            const contentData = {
                myAbilityLink: config.links.myAbilityLink,
                helpLineNumber: commonContent.helplineNumber,
                helpLineHours: commonContent.helplineHours,
                callChargesLink: config.links.callCharges,
                equalityAdvisorLink: config.links.equalityAdvisorLink,
                wcag21Link: config.links.wcag21Link,
                applicationFormPA15: config.links.applicationFormPA15,
                deathReportedToCoroner: config.links.deathReportedToCoroner,
                pcqStartApplyLink: config.links.pcqStartApplyLink,
                paragraph8: accessibility.paragraph8,
                list2cmc: accessibility['list2-cmc'],
                list2divorce: accessibility['list2-divorce'],
                list2probate: accessibility['list2-probate'],
                list2sscs: accessibility['list2-sscs'],
                list2iac: accessibility['list2-iac'],
                list2et: accessibility['list2-et'],
                list2online_plea: accessibility['list2-online_plea'],
                list2specialtribunals_cic: accessibility['list2-specialtribunals_cic'],
                list2jurordigital: accessibility['list2-jurordigital'],
                list2prl_ca: accessibility['list2-prl_ca']
            };
            testWrapper.testContent(done, contentData);
        });
    });
});
