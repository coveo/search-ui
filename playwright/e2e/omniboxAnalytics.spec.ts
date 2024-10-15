import {test} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {isUaSearchEvent} from '../utils/requests';
import {OmniAnalyticsSelectors, SearchboxSelectors} from '../utils/selectors';

test.describe('Omnibox Analytics', () => {
    test('Test omniboxAnalytics', async ({page}) => {
        const query = 't';
        await page.goto(pageURL('omniboxAnalytics'));
        await SearchboxSelectors(page).searchboxInput.fill(query);
        await page.waitForLoadState('networkidle');
        const firstSuggestion = await OmniAnalyticsSelectors(page).suggestionItem.first().textContent();
        const suggestionsList = await OmniAnalyticsSelectors(page).suggestionItem.allTextContents();

        const uaRequestSearch = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'omniboxAnalytics' &&
                request.postDataJSON()[0]?.actionType === 'omnibox' &&
                request.postDataJSON()[0]?.customData.suggestionRanking === 0 &&
                request.postDataJSON()[0]?.customData.suggestions === suggestionsList.join(';') &&
                request.postDataJSON()[0]?.queryText === firstSuggestion,
            {timeout: 5_000},
        );
        await OmniAnalyticsSelectors(page).suggestionItem.first().click();
        await uaRequestSearch;
    });

    test('Test omniboxField', async ({page}) => {
        const query = 'b';
        await page.goto(pageURL('00_standardsp4automated_1'));
        await SearchboxSelectors(page).searchboxInput.click();
        await page.keyboard.press(query);
        await page.waitForLoadState('networkidle');
        await SearchboxSelectors(page).searchboxInput.click();
        const firstSuggestion = await OmniAnalyticsSelectors(page).suggestionItem.first().textContent();

        const uaRequestSearch = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'omniboxField' &&
                request.postDataJSON()[0]?.actionType === 'omnibox' &&
                request.postDataJSON()[0]?.queryText === firstSuggestion,
            {timeout: 5_000},
        );
        await OmniAnalyticsSelectors(page).suggestionItem.first().click();
        await uaRequestSearch;
    });
});
