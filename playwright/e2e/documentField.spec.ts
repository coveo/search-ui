import {test, expect} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {isUaSearchEvent} from '../utils/requests';
import {DocumentFieldSelectors, SearchboxSelectors} from '../utils/selectors';

test.describe('Document FieldValue', async () => {
    test.beforeEach(async ({page}) => {
        await page.goto(pageURL('00_standardSP4automated_1'));
    });

    test('Select document field value', async ({page}) => {
        const query = '@filetype=="lithiummessage"';

        await page.locator('div.coveo-tab-section a[data-caption="Lithium"]').click();
        await SearchboxSelectors(page).searchboxInput.fill(query);
        const uaRequestSearchQuery = page.waitForRequest(
            (request) => isUaSearchEvent(request) && request.postDataJSON()[0]?.actionCause == 'searchboxSubmit',
        );
        await SearchboxSelectors(page).searchboxIcon.click();
        await uaRequestSearchQuery;

        const docFieldValue = await DocumentFieldSelectors(page).fieldValue.first().textContent();
        const uaRequestDocFieldValue = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause == 'documentField' &&
                request.postDataJSON()[0]?.customData.facetValue == docFieldValue?.toLowerCase(),
        );
        await DocumentFieldSelectors(page).fieldValue.first().click();
        await uaRequestDocFieldValue;

        await expect(page.getByTitle(`${docFieldValue}`, {exact: true})).toBeChecked();
        expect(await page.getByLabel('Remove inclusion filter on').textContent()).toEqual(`${docFieldValue}Clear`);

        await DocumentFieldSelectors(page).fieldValue.first().click();
        await expect(page.getByTitle(`${docFieldValue}`, {exact: true})).not.toBeChecked();
    });
});
