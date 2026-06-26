'use strict';

const { test, expect } = require('@playwright/test');
const { v4: uuidv4 } = require('uuid');
const { generateToken } = require('app/components/encryption-token');

function buildServiceUrl(pcqId) {
    const params = {
        serviceId: 'PROBATE',
        actor: 'APPLICANT',
        pcqId,
        ccdCaseId: '1234567890123456',
        partyId: 'test@gmail.com',
        returnUrl: 'dummy-return-url',
        language: 'en'
    };
    const { token } = generateToken(params);
    params.token = token;
    const qs = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');
    return `/service-endpoint?${qs}`;
}


async function clickLabelAndContinue(page, label) {
    // Try label first (radio/checkbox), fall back to visible text
    const byLabel = page.getByLabel(label, { exact: true });
    const byText  = page.getByText(label, { exact: true });
    if (await byLabel.count() > 0) {
        await byLabel.click();
    } else {
        await byText.click();
    }
    await page.getByRole('button', { name: 'Continue' }).click();
}

test.describe('PCQ cross-browser journey — answer Yes to all questions', () => {

    test('User answers Yes to all PCQ questions @crossbrowser', async ({ page }) => {
        const pcqId = uuidv4();
        const serviceUrl = buildServiceUrl(pcqId);

        // Start page — invoke PCQ
        await page.goto(serviceUrl);
        await expect(page.getByText('Continue to the question')).toBeVisible();
        await page.getByText('Continue to the question').click();

        // Date of birth
        await expect(page).toHaveURL(/date-of-birth/);
        await page.getByText('Enter your date of birth').click();
        await page.fill('#dob-day', '10');
        await page.fill('#dob-month', '2');
        await page.fill('#dob-year', '2019');
        await page.getByRole('button', { name: 'Continue' }).click();

        // Language
        await expect(page).toHaveURL(/language/);
        await clickLabelAndContinue(page, 'English');

        // Sex
        await expect(page).toHaveURL(/sex/);
        await clickLabelAndContinue(page, 'Male');

        // Gender same as sex
        await expect(page).toHaveURL(/gender/);
        await clickLabelAndContinue(page, 'Yes');

        // Sexual orientation
        await expect(page).toHaveURL(/sexual-orientation/);
        await clickLabelAndContinue(page, 'Heterosexual or straight');

        // Marital status
        await expect(page).toHaveURL(/marital-status/);
        await clickLabelAndContinue(page, 'Yes');

        // Ethnic group
        await expect(page).toHaveURL(/ethnic-group/);
        await clickLabelAndContinue(page, 'White');

        // White ethnic group
        await expect(page).toHaveURL(/white-ethnic-group/);
        await clickLabelAndContinue(page, 'English, Welsh, Scottish, Northern Irish or British');

        // Religion
        await expect(page).toHaveURL(/religion/);
        await clickLabelAndContinue(page, 'Christian (all denominations)');

        // Disability
        await expect(page).toHaveURL(/disability/);
        await clickLabelAndContinue(page, 'Yes');

        // Disability implications
        await expect(page).toHaveURL(/disability-implications/);
        await clickLabelAndContinue(page, 'Yes, limited a lot');

        // Disability implications areas
        await expect(page).toHaveURL(/disability-implications-areas/);
        await clickLabelAndContinue(page, 'Vision');

        // Pregnant
        await expect(page).toHaveURL(/pregnant/);
        await clickLabelAndContinue(page, 'Yes');

        // End page
        await expect(page).toHaveURL(/end-page/);
        await expect(page.getByText('You have answered the equality questions')).toBeVisible();
    });

});