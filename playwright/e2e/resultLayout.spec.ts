import {expect, test} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {isUaCustomEvent} from '../utils/requests';
import {ResultLayoutSelectors} from '../utils/selectors';

test.describe('Result Layout', () => {
    test('Test change result Layout', async ({page}) => {
        await page.goto(pageURL('00_standardSP4automated_1'));
        await page.waitForLoadState('networkidle');
        // Change to Card layout
        const uaRequest_changeToCard = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'changeResultsLayout' &&
                request.postDataJSON()?.actionType === 'resultsLayout' &&
                request.postDataJSON()?.customData.resultsLayoutChangeTo === 'card',
            {timeout: 5_000},
        );
        await ResultLayoutSelectors(page).cardButton.click();
        await uaRequest_changeToCard;
        await expect(page.locator('.CoveoResultList .coveo-card-layout-container')).toBeVisible();

        // Change to Table layout
        const uaRequest_changeToTable = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'changeResultsLayout' &&
                request.postDataJSON()?.actionType === 'resultsLayout' &&
                request.postDataJSON()?.customData.resultsLayoutChangeTo === 'table',
            {timeout: 5_000},
        );
        await ResultLayoutSelectors(page).tableButton.click();
        await uaRequest_changeToTable;
        await expect(page.locator('.CoveoResultList table')).toBeVisible();

        // Change to List layout
        const uaRequest_changeToList = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'changeResultsLayout' &&
                request.postDataJSON()?.actionType === 'resultsLayout' &&
                request.postDataJSON()?.customData.resultsLayoutChangeTo === 'list',
            {timeout: 5_000},
        );
        await ResultLayoutSelectors(page).listButton.click();
        await uaRequest_changeToList;
    });
});
