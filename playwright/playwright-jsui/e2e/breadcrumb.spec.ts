import { test, expect } from '@playwright/test';
import { pageURL } from '../utils/utils'
import { isUaSearchEvent } from '../utils/requests';
import { DynamicFacetSelectors, BreadcrumbSelectors } from '../utils/selectors'

let facetTitle, facetField, facetValue;
test.describe('Breadcrumb', async () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(pageURL('DynamicFacets'))
        facetValue = await DynamicFacetSelectors(page).facetValue.first().textContent();
        facetTitle = await DynamicFacetSelectors(page).facet.getAttribute('data-title');
        facetField = await DynamicFacetSelectors(page).facet.getAttribute('data-field');
        await DynamicFacetSelectors(page).facetCheckbox.first().click();
    })

    test('with one facet value', async ({ page }) => {
        const breadcrumbList = await BreadcrumbSelectors(page).breadcrumbItemRow.first().textContent()
        expect(breadcrumbList).toEqual(`${facetTitle}:${facetValue}Clear`);

        const uaRequest = page.waitForRequest(
            (request) => isUaSearchEvent(request)
                && request.postDataJSON()[0]?.actionCause == 'breadcrumbFacet'
                && request.postDataJSON()[0]?.actionType == 'breadcrumb'
                && request.postDataJSON()[0]?.customData.facetTitle == facetTitle
                && request.postDataJSON()[0]?.customData.facetField == facetField,
            { timeout: 10_000 }
        );
        await BreadcrumbSelectors(page).breadcrumbClearFacet.first().click();
        await uaRequest;
    })

    test('with multiple facet value', async ({ page }) => {
        await page.waitForLoadState("networkidle");
        const uaRequest = page.waitForRequest(
            (request) => isUaSearchEvent(request)
                && request.postDataJSON()[0]?.actionCause == 'breadcrumbFacet'
                && request.postDataJSON()[0]?.actionType == 'breadcrumb'
                && request.postDataJSON()[0]?.customData.facetTitle == facetTitle
                && request.postDataJSON()[0]?.customData.facetField == facetField
        );

        const facetValue_2 = await DynamicFacetSelectors(page).facetValue.locator('nth=1').textContent();
        await DynamicFacetSelectors(page).facetCheckbox.locator('nth=1').click();
        await expect(BreadcrumbSelectors(page).breadcrumbDynamicFacetValue.locator('nth=1')).toBeVisible();

        // Validate Breadcrumb list
        const breadcrumbList = await BreadcrumbSelectors(page).breadcrumbItemRow.first().textContent()
        expect(breadcrumbList).toEqual(`${facetTitle}:${facetValue}Clear${facetValue_2}Clear`);

        await BreadcrumbSelectors(page).breadcrumbClearFacet.first().click();
        await uaRequest;

        await BreadcrumbSelectors(page).breadcrumbClearFacet.first().click();
        await uaRequest;
    })

    test('with facetValue of multiple facet', async ({ page }) => {
        await page.waitForLoadState("networkidle");
        await DynamicFacetSelectors(page, '@year').facetCheckbox.first().click();
        await expect(BreadcrumbSelectors(page).breadcrumbItemRow.locator('nth=1')).toBeVisible();

        // Validate breadcrumb value
        const facetTitle_2 = await DynamicFacetSelectors(page, '@year').facet.getAttribute('data-title');
        const facetValue_2 = await DynamicFacetSelectors(page, '@year').facetValue.first().textContent();

        const breadcrumbList = await BreadcrumbSelectors(page).breadcrumbItemRow.first().textContent()
        expect(breadcrumbList).toEqual(`${facetTitle}:${facetValue}Clear`);

        const breadcrumbList_2 = await BreadcrumbSelectors(page).breadcrumbItemRow.locator('nth=1').textContent()
        expect(breadcrumbList_2).toEqual(`${facetTitle_2}:${facetValue_2}Clear`);
    })

    test('breadcrumb clear all facets', async ({ page }) => {
        const uaRequest = page.waitForRequest(
            (request) => isUaSearchEvent(request)
                && request.postDataJSON()[0]?.actionCause == 'breadcrumbResetAll'
                && request.postDataJSON()[0]?.actionType == 'breadcrumb'
        );
        await BreadcrumbSelectors(page).breadcrumbClearAll.click()
        await uaRequest;
    })
})