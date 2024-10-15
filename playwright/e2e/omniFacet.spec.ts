import {test, expect} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {isUaSearchEvent} from '../utils/requests';
import {BreadcrumbSelectors, OmniAnalyticsSelectors, SearchboxSelectors} from '../utils/selectors';

test.describe('Omnibox Facet', () => {
    const query = 'm';
    test.beforeEach(async ({page}) => {
        await page.goto(pageURL('00_standardSP4automated_1'));
        await SearchboxSelectors(page).searchboxInput.click();
        await page.keyboard.press(query);
        await page.waitForLoadState('networkidle');
    });
    test('Test omniboxFacetSelect, omniboxFacetDeselect', async ({page}) => {
        const firstSuggestion = await OmniAnalyticsSelectors(page).facetSuggestionItem.first().textContent();
        const suggestionsList = await OmniAnalyticsSelectors(page).facetSuggestionItem.allTextContents();

        // Test omniboxFacetSelect
        const uaRequestSearch_omniboxFacetSelect = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'omniboxFacetSelect' &&
                request.postDataJSON()[0]?.actionType === 'omnibox' &&
                request.postDataJSON()[0]?.customData.query === query &&
                request.postDataJSON()[0]?.customData.suggestionRanking === 0 &&
                request.postDataJSON()[0]?.customData.suggestions === suggestionsList.join(';'),
            {timeout: 5_000},
        );
        await OmniAnalyticsSelectors(page).facetSuggestionItem.first().click();
        await uaRequestSearch_omniboxFacetSelect;
        await expect(BreadcrumbSelectors(page).breadcrumbItemRow).toContainText(firstSuggestion!.toString());

        // Test omniboxFacetDeselect
        await SearchboxSelectors(page).searchboxInput.click();
        await page.keyboard.press(query);
        await page.waitForLoadState('networkidle');

        const uaRequest_omniboxFacetDeselect = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'omniboxFacetDeselect' &&
                request.postDataJSON()[0]?.actionType === 'omnibox' &&
                request.postDataJSON()[0]?.customData.query === query &&
                request.postDataJSON()[0]?.customData.suggestionRanking === 0 &&
                request.postDataJSON()[0]?.customData.suggestions === suggestionsList.join(';'),
            {timeout: 5_000},
        );
        await OmniAnalyticsSelectors(page).facetSuggestionItem.first().click();
        await uaRequest_omniboxFacetDeselect;
        await expect(BreadcrumbSelectors(page).breadcrumbItemRow).not.toBeVisible();
    });

    test('Test omniboxFacetExclude, omniboxFacetUnexclude', async ({page}) => {
        const firstSuggestion = await OmniAnalyticsSelectors(page).facetSuggestionItem.first().textContent();
        const suggestionsList = await OmniAnalyticsSelectors(page).facetSuggestionItem.allTextContents();

        // Test omniboxFacetExclude
        const uaRequestSearch_omniboxFacetExclude = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'omniboxFacetExclude' &&
                request.postDataJSON()[0]?.actionType === 'omnibox' &&
                request.postDataJSON()[0]?.advancedQuery === `(NOT @objecttype==${firstSuggestion})` &&
                request.postDataJSON()[0]?.customData.query === query &&
                request.postDataJSON()[0]?.customData.suggestionRanking === 0 &&
                request.postDataJSON()[0]?.customData.suggestions === suggestionsList.join(';'),
            {timeout: 5_000},
        );
        await OmniAnalyticsSelectors(page).excludeButton.first().hover();
        await OmniAnalyticsSelectors(page).excludeButton.first().click();
        await uaRequestSearch_omniboxFacetExclude;
        await expect(BreadcrumbSelectors(page).breadcrumbFacetValue.first()).toHaveAttribute('class', /coveo-excluded/);

        // Test omniboxFacetUnexclude
        await SearchboxSelectors(page).searchboxInput.click();
        await page.keyboard.press(query);
        await page.waitForLoadState('networkidle');

        const uaRequest_omniboxFacetUnexclude = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'omniboxFacetUnexclude' &&
                request.postDataJSON()[0]?.actionType === 'omnibox' &&
                request.postDataJSON()[0]?.customData.query === query &&
                request.postDataJSON()[0]?.customData.suggestionRanking === 0 &&
                request.postDataJSON()[0]?.customData.suggestions === suggestionsList.join(';'),
            {timeout: 5_000},
        );
        await OmniAnalyticsSelectors(page).checkboxOmnifacet.first().click();
        await uaRequest_omniboxFacetUnexclude;
        await expect(BreadcrumbSelectors(page).breadcrumbItemRow).not.toBeVisible();
    });
});
