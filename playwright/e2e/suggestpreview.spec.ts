import {test, expect} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {SearchboxSelectors} from '../utils/selectors';

test.describe('Suggest Preview', () => {
    test.beforeEach(async ({page}) => {
        await page.goto(pageURL('suggestionsmanagerquerysuggestpreview'));
    });

    test('Move to first suggestion using mouse', async ({page}) => {
        await SearchboxSelectors(page).searchboxInput.first().click();
        await page.waitForLoadState('networkidle');
        const firstSuggestionBound = await page.locator('div.coveo-magicbox-suggestions div').first().boundingBox();
        await page.mouse.move(firstSuggestionBound!.x, firstSuggestionBound!.y);
        await expect(page.locator('.coveo-preview-results div.coveo-preview-layout').first()).toBeVisible();
    });
    test('Move to first Preview using keyboard', async ({page}) => {
        await SearchboxSelectors(page).searchboxInput.first().click();
        await page.waitForLoadState('networkidle');
        await page.keyboard.press('ArrowDown');
        await expect(page.locator('.coveo-preview-results div.coveo-preview-layout').first()).toBeVisible();

        /** Validate mouse focus */
        await page.keyboard.press('ArrowRight');
        await expect(page.locator('div.coveo-preview-results .coveo-omnibox-selected')).toBeVisible(); // mouse focus on Preview Results

        const selectedPreview = await page.locator('div.coveo-preview-results .coveo-omnibox-selected').boundingBox();
        const firstPreview = await page.locator('#coveo-result-preview-0').boundingBox();
        expect(selectedPreview).toEqual(firstPreview);
    });
});
