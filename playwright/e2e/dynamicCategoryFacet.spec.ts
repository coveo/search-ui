import {test, expect} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {isUaCustomEvent, isUaSearchEvent} from '../utils/requests';
import {DynamicCategoryFacetSelects, BreadcrumbSelectors} from '../utils/selectors';

const defaultFacetNumberOfValues = 5;
let facetValue_Level1, breadcrumbList;

test.describe('Dynamic Category Facet', () => {
    test.beforeEach(async ({page}) => {
        await page.goto(pageURL('DynamicFacets'));
        await page.waitForLoadState('networkidle');
    });
    test('Should select the parent-child level, and clear selection', async ({page}) => {
        // Select parent level
        facetValue_Level1 = await DynamicCategoryFacetSelects(page).valueL1.first().textContent();
        const uaRequestDNE_first = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'facetSelect' &&
                request.postDataJSON()[0]?.actionType === 'dynamicFacet' &&
                request.postDataJSON()[0]?.customData.facetValue === facetValue_Level1 &&
                request.postDataJSON()[0]?.facetState[0].facetType === 'hierarchical' &&
                request.postDataJSON()[0]?.facetState[0].valuePosition === 1,
            {timeout: 5_000},
        );

        await DynamicCategoryFacetSelects(page).valueL1.first().click();
        await uaRequestDNE_first;

        // Validate breadcrumb
        breadcrumbList = await BreadcrumbSelectors(page).breadcrumbItemRow.first().textContent();
        expect(breadcrumbList).toEqual(`Categories:${facetValue_Level1}Clear`);

        // Select 1st child level
        const facetValue_Level2 = await DynamicCategoryFacetSelects(page).valueL2.first().textContent();
        const uaRequestDNE_second = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'facetSelect' &&
                request.postDataJSON()[0]?.actionType === 'dynamicFacet' &&
                request.postDataJSON()[0]?.customData.facetValue ===
                    `${facetValue_Level1};${facetValue_Level2}` &&
                request.postDataJSON()[0]?.facetState[0].facetType === 'hierarchical' &&
                request.postDataJSON()[0]?.facetState[0].valuePosition === 1,
            {timeout: 5_000},
        );
        await DynamicCategoryFacetSelects(page).valueL2.first().click();
        await uaRequestDNE_second;
        // Validate breadcrumb
        breadcrumbList = await BreadcrumbSelectors(page).breadcrumbItemRow.first().textContent();
        expect(breadcrumbList).toEqual(`Categories:${facetValue_Level1} / ${facetValue_Level2}Clear`);

        // Validate ClearAll
        const uaRequestClearAll = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'facetClearAll' &&
                request.postDataJSON()[0]?.actionType === 'dynamicFacet',
            {timeout: 5_000},
        );
        await DynamicCategoryFacetSelects(page).clearAllCategory.click();
        await uaRequestClearAll;
        // Validate breadcrumb
        await expect(BreadcrumbSelectors(page).breadcrumbItemRow.first()).not.toBeVisible();
    });

    test('Show more Show less First level', async ({page}) => {
        // Default state
        const allValue_Level1 = await DynamicCategoryFacetSelects(page).valueL1.count();
        expect(allValue_Level1).toEqual(defaultFacetNumberOfValues);

        // Click Show More
        const uaRequestShowMore = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'showMoreFacetResults' &&
                request.postDataJSON()?.actionType === 'dynamicFacet',
        );
        await DynamicCategoryFacetSelects(page).showMore.click();
        await uaRequestShowMore;
        await expect(DynamicCategoryFacetSelects(page).showLess).toBeVisible();
        expect(await DynamicCategoryFacetSelects(page).valueL1.count()).toEqual(7);

        // Click Show Less
        const uaRequestShowLess = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'showLessFacetResults' &&
                request.postDataJSON()?.actionType === 'dynamicFacet',
        );
        await DynamicCategoryFacetSelects(page).showLess.click();
        await uaRequestShowLess;
        await expect(DynamicCategoryFacetSelects(page).showMore).toBeVisible();
        await expect(DynamicCategoryFacetSelects(page).showLess).not.toBeVisible();
        expect(await DynamicCategoryFacetSelects(page).valueL1.count()).toEqual(defaultFacetNumberOfValues);
    });

    test('Show more Show less 2nd level', async ({page}) => {
        const uaRequestSelect = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'facetSelect' &&
                request.postDataJSON()[0]?.actionType === 'dynamicFacet',
            {timeout: 5_000},
        );
        await DynamicCategoryFacetSelects(page).valueL1.first().click();
        await uaRequestSelect;
        expect(await DynamicCategoryFacetSelects(page).valueL2.count()).toEqual(defaultFacetNumberOfValues);

        // Show more test
        await DynamicCategoryFacetSelects(page).showMore.click();
        await expect(DynamicCategoryFacetSelects(page).showLess).toBeVisible();
        expect(await DynamicCategoryFacetSelects(page).valueL2.count()).toEqual(defaultFacetNumberOfValues * 2);

        // Show less test
        await DynamicCategoryFacetSelects(page).showLess.click();
        await expect(DynamicCategoryFacetSelects(page).showLess).not.toBeVisible();
        expect(await DynamicCategoryFacetSelects(page).valueL2.count()).toEqual(defaultFacetNumberOfValues);
    });
});
