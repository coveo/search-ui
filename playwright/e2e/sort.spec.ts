import {test} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {isSearchRequest, isUaSearchEvent} from '../utils/requests';
import {SortSelectors} from '../utils/selectors';

test.describe('Sort', () => {
    test('Sort dateDescending, dateAscending, and relevance', async ({page}) => {
        await page.goto(pageURL('DynamicFacets'));
        // Date descending
        const uaRequestSortDescend = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause == 'resultsSort' &&
                request.postDataJSON()[0]?.actionType == 'misc' &&
                request.postDataJSON()[0]?.customData.resultsSortBy === 'datedescending',
            {timeout: 5_000},
        );
        const searchRequestSortDescend = page.waitForRequest(
            (request) => isSearchRequest(request) && request.postDataJSON()?.sortCriteria == 'date descending',
            {timeout: 5_000},
        );
        await SortSelectors(page).sortDateDescending.click();
        await uaRequestSortDescend;
        await searchRequestSortDescend;

        // Date ascending
        const uaRequestSortAscend = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause == 'resultsSort' &&
                request.postDataJSON()[0]?.actionType == 'misc' &&
                request.postDataJSON()[0]?.customData.resultsSortBy == 'dateascending',
            {timeout: 5_000},
        );
        const searchRequestSortAscend = page.waitForRequest(
            (request) => isSearchRequest(request) && request.postDataJSON()?.sortCriteria == 'date ascending',
            {timeout: 5_000},
        );
        await SortSelectors(page).sortDateAscending.click();
        await uaRequestSortAscend;
        await searchRequestSortAscend;

        // Relevance
        const uaRequestSortRelevance = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause == 'resultsSort' &&
                request.postDataJSON()[0]?.actionType == 'misc' &&
                request.postDataJSON()[0]?.customData.resultsSortBy == 'relevancy',
            {timeout: 5_000},
        );
        const searchRequestSortRelevance = page.waitForRequest(
            (request) => isSearchRequest(request) && request.postDataJSON()?.sortCriteria == 'relevancy',
            {timeout: 5_000},
        );
        await SortSelectors(page).sortRelevance.click();
        await uaRequestSortRelevance;
        await searchRequestSortRelevance;
    });
});
