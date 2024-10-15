import {test, expect} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {isUaClickEvent} from '../utils/requests';
import {QuickviewSelectors, SearchboxSelectors} from '../utils/selectors';

test.describe('Quickview', () => {
    test.beforeEach(async ({page}) => {
        await page.addInitScript(() => {
            window.navigator.sendBeacon = undefined;
        });
        await page.goto(pageURL('00_standardSP4automated_1'));
        const query = '@filetype=="html"';
        await SearchboxSelectors(page).searchboxInput.fill(query);
        await SearchboxSelectors(page).searchboxIcon.click();
    });
    test('Quickview', async ({page}) => {
        const uaRequestQuickview = page.waitForRequest(
            (request) =>
                isUaClickEvent(request) &&
                request.postDataJSON()?.actionCause === 'documentQuickview' &&
                request.postDataJSON()?.actionType === 'document',
            {timeout: 5_000},
        );
        await QuickviewSelectors(page).quickviewIcon.first().click();
        await expect(QuickviewSelectors(page).quickviewBackdrop).toBeVisible();
        await expect(QuickviewSelectors(page).quickviewResultLink).toBeVisible();
        await expect(QuickviewSelectors(page).quickviewResultLink).toHaveAttribute('href', /http/);
        await uaRequestQuickview;

        await QuickviewSelectors(page).quickviewClose.click();
        await expect(QuickviewSelectors(page).quickviewBackdrop).not.toBeVisible();
    });
});
