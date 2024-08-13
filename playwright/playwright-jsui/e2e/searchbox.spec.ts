import {test} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {isUaSearchEvent} from '../utils/requests';
import {SearchboxSelectors} from '../utils/selectors';

test.describe('Searchbox search', () => {
    const query = 'test';
    test.beforeEach(async ({page}) => {
        await page.goto(pageURL('DynamicFacets'));
        await SearchboxSelectors(page).searchboxInput.first().fill(query);
    });

    test('Search using Click icon', async ({page}) => {
        const uaRequestSearchQuery = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'searchboxSubmit' &&
                request.postDataJSON()[0]?.actionType === 'search box' &&
                request.postDataJSON()[0]?.queryText === query,
            {timeout: 5_000},
        );
        await SearchboxSelectors(page).searchboxIcon.click();
        await uaRequestSearchQuery;
    });

    test('Search using ENTER', async ({page}) => {
        const uaRequestSearchQuery = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'searchboxSubmit' &&
                request.postDataJSON()[0]?.actionType === 'search box' &&
                request.postDataJSON()[0]?.queryText === query,
            {timeout: 5_000},
        );
        await page.keyboard.press('Enter');
        await uaRequestSearchQuery;
    });
});

test.describe('Clear searchbox icon', () => {
    const query = 'test';
    test.beforeEach(async ({page}) => {
        await page.goto(pageURL('00_standardSP4automated_1'));
        await SearchboxSelectors(page).searchboxInput.first().fill(query);
        await page.keyboard.press('Enter');
        await SearchboxSelectors(page).searchboxInput.click();
    });
    test('Clear query using Click icon', async ({page}) => {
        await page.keyboard.press('Space');
        const uaRequestSearchQuery = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'searchboxClear' &&
                request.postDataJSON()[0]?.actionType === 'search box',
            {timeout: 5_000},
        );
        await SearchboxSelectors(page).searchboxClearIcon.click();
        await uaRequestSearchQuery;
    });

    test('Clear query using Backspace button', async ({page}) => {
        const uaRequestSearchQuery = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'searchboxClear' &&
                request.postDataJSON()[0]?.actionType === 'search box',
            {timeout: 5_000},
        );
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await page.keyboard.press('Backspace');
        await uaRequestSearchQuery;
    });
});

test.describe('Search as you type', () => {
    test('Search as you type', async ({page}) => {
        const query = 'test';
        let uaRequestSearchAsYouType;
        await page.goto(pageURL('00_standardSP4automated_2'));
        await page.waitForLoadState('networkidle');

        await SearchboxSelectors(page).searchboxInput.first().click();
        for (let i = 0; i < query.length; i++) {
            uaRequestSearchAsYouType = page.waitForRequest(
                (request) =>
                    isUaSearchEvent(request) &&
                    request.postDataJSON()[0]?.actionCause === 'searchboxAsYouType' &&
                    request.postDataJSON()[0]?.actionType === 'search box' &&
                    request.postDataJSON()[0]?.customData.partialQuery === `${query.substring(0, i + 1)}`,
                {timeout: 50_000},
            );
            await page.keyboard.press(`${query.charAt(i)}`);
            await uaRequestSearchAsYouType;
            await page.waitForLoadState('networkidle');
        }
    });
});
