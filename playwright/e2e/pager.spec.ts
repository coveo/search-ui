import {test} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {isUaCustomEvent} from '../utils/requests';
import {PagerSelectors} from '../utils/selectors';

test.describe('Pager', () => {
    test.beforeEach(async ({page}) => {
        await page.goto(pageURL('DynamicFacets'));
    });

    test('should go to next & previous page', async ({page}) => {
        const uaRequestPagerNext = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'pagerNext' &&
                request.postDataJSON()?.actionType === 'getMoreResults' &&
                request.postDataJSON()?.customData.pagerNumber === 2,
            {timeout: 5_000},
        );
        await PagerSelectors(page).nextButton.click();
        await uaRequestPagerNext;

        const uaRequestPagerPrevious = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'pagerPrevious' &&
                request.postDataJSON()?.actionType === 'getMoreResults' &&
                request.postDataJSON()?.customData.pagerNumber === 1,
            {timeout: 5_000},
        );
        await PagerSelectors(page).previousButton.click();
        await uaRequestPagerPrevious;
    });

    test('should go the the pager number', async ({page}) => {
        const uaRequestPagerNumber = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'pagerNumber' &&
                request.postDataJSON()?.actionType === 'getMoreResults' &&
                request.postDataJSON()?.customData.pagerNumber === 3,
            {timeout: 5_000},
        );
        await page.locator('li').filter({hasText: /^3$/}).click();
        await uaRequestPagerNumber;
    });
});

test.describe('Pager Scrolling', () => {
    test('should scroll and load more result', async ({page}) => {
        await page.goto(pageURL('00_standardSP4automated_3'));
        await page.waitForLoadState('networkidle');
        const uaRequestPagerScrolling = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'pagerScrolling' &&
                request.postDataJSON()?.actionType === 'getMoreResults',
        );

        await page.locator('div.coveo-list-layout.CoveoResult:nth-child(10)').scrollIntoViewIfNeeded();
        await uaRequestPagerScrolling;
    });
});
