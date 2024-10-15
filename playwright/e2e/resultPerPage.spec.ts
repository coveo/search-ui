import {test, expect} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {isUaCustomEvent} from '../utils/requests';

test.describe('ResultPerPage', async () => {
    test.beforeEach(async ({page}) => {
        await page.goto(pageURL('DynamicFacets'));
    });

    test('should change number of result display per page', async ({page}) => {
        const resultPerPageNumber = 25;
        const uaRequestResultPerPage = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'pagerResize' &&
                request.postDataJSON()?.actionType === 'getMoreResults' &&
                request.postDataJSON()?.customData.currentResultsPerPage === resultPerPageNumber,
            {timeout: 5_000},
        );
        await page.getByLabel(`Display ${resultPerPageNumber} results per page`).click();
        await uaRequestResultPerPage;
        await page.waitForLoadState('networkidle');
        const totalResultList = await page.locator('.coveo-result-list-container div.CoveoResult').count();
        expect(totalResultList).toEqual(resultPerPageNumber);
    });
});
