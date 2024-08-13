import {test, expect} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {isUaCustomEvent} from '../utils/requests';
import {SearchboxSelectors} from '../utils/selectors';

test.describe('Search query error', () => {
    const query = '$qre()';
    test.beforeEach(async ({page}) => {
        await page.goto(pageURL('00_standardSP4automated_1'));
        await SearchboxSelectors(page).searchboxInput.first().fill(query);
    });

    test('Test error query', async ({page}) => {
        const uaRequestQueryError = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'query' &&
                request.postDataJSON()?.actionType === 'errors',
            {
                timeout: 5_000,
            },
        );
        await SearchboxSelectors(page).searchboxIcon.click();
        await uaRequestQueryError;
        await expect(page.getByRole('heading', {name: 'Something went wrong.'})).toBeVisible();
    });

    test('Test error back', async ({page}) => {
        await page.waitForTimeout(500); // a pause is needed in order to make sure it can go back to previous page
        await SearchboxSelectors(page).searchboxIcon.click();
        const uaRequestQueryErrorBack = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'errorBack' &&
                request.postDataJSON()?.actionType === 'errors',
            {timeout: 5_000},
        );
        await page.getByLabel('Go Back').click();
        await uaRequestQueryErrorBack;
    });

    test('Test error reset', async ({page}) => {
        await SearchboxSelectors(page).searchboxIcon.click();
        const uaRequestQueryErrorReset = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'errorClearQuery' &&
                request.postDataJSON()?.actionType === 'errors',
            {timeout: 5_000},
        );
        await page.getByLabel('Reset').click();
        await uaRequestQueryErrorReset;
    });

    test('Test error retry', async ({page}) => {
        await SearchboxSelectors(page).searchboxIcon.click();
        const uaRequestQueryErrorRetry = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'query' &&
                request.postDataJSON()?.actionType === 'errors',
            {timeout: 5_000},
        );
        await page.getByLabel('Retry').click();
        await uaRequestQueryErrorRetry;
        await expect(page.getByRole('heading', {name: 'Something went wrong.'})).toBeVisible();
    });
});
