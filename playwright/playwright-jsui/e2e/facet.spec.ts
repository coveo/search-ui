import {test, expect} from '@playwright/test';
import {compareAlphanumericalValues, pageURL} from '../utils/utils';
import {isUaCustomEvent, isUaSearchEvent} from '../utils/requests';
import {BreadcrumbSelectors, FacetSelectors} from '../utils/selectors';

const defaultFacetNumberOfValues = 5;
let facetTitle, facetField, facetValue, facetValueList;

test.beforeEach(async ({page}) => {
    await page.goto(pageURL('00_standardsp4automated_1'));
    facetTitle = await FacetSelectors(page).facet.getAttribute('data-title');
    facetField = await FacetSelectors(page).facet.getAttribute('data-field');
    facetValue = await FacetSelectors(page).facetValue.first().textContent();
    facetValueList = await FacetSelectors(page).facetValue.allTextContents();
});

test.describe('Facet Tests', () => {
    test('Should select facet', async ({page}) => {
        /** Validate default render   */
        expect(facetValueList.length - 1).toEqual(defaultFacetNumberOfValues);
        await expect(FacetSelectors(page).facetSearchButton).toBeVisible();

        /** Validate default Select facet   */
        const uaRequest = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'facetSelect' &&
                request.postDataJSON()[0]?.actionType === 'facet' &&
                request.postDataJSON()[0]?.customData.facetTitle === facetTitle &&
                request.postDataJSON()[0]?.customData.facetField === facetField &&
                request.postDataJSON()[0]?.customData.facetValue === facetValue,
            {timeout: 5_000},
        );
        await FacetSelectors(page).facetCheckbox.first().click();
        await uaRequest;

        /* Validate breadcrumb */
        const breadcrumbList = await BreadcrumbSelectors(page).breadcrumbItemRow.first().textContent();
        expect(breadcrumbList).toEqual(`${facetTitle}:${facetValue}Clear`);
    });

    test('Should deselect facet', async ({page}) => {
        await FacetSelectors(page).facetCheckbox.first().click();
        await page.waitForLoadState('networkidle');
        const uaRequest = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'facetDeselect' &&
                request.postDataJSON()[0]?.actionType === 'facet' &&
                request.postDataJSON()[0]?.customData.facetTitle === facetTitle &&
                request.postDataJSON()[0]?.customData.facetField === facetField &&
                request.postDataJSON()[0]?.customData.facetValue === facetValue,
        );
        await FacetSelectors(page).facetCheckbox.first().click();
        await uaRequest;
    });

    test('Should exclude - unexclude facet', async ({page}) => {
        await FacetSelectors(page).excludeFacetButton.first().hover();
        /** Validate exclude facet   */
        const uaRequestExclude = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'facetExclude' &&
                request.postDataJSON()[0]?.actionType === 'facet' &&
                request.postDataJSON()[0]?.advancedQuery === `(NOT ${facetField}==${facetValue})` &&
                request.postDataJSON()[0]?.customData.facetTitle === facetTitle &&
                request.postDataJSON()[0]?.customData.facetField === facetField &&
                request.postDataJSON()[0]?.customData.facetValue === facetValue,
            {timeout: 5_000},
        );
        await FacetSelectors(page).excludeFacetButton.first().click();
        await uaRequestExclude;

        /** Validate facetUnexclude */
        const uaRequestUnexclude = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'facetUnexclude' &&
                request.postDataJSON()[0]?.actionType === 'facet' &&
                request.postDataJSON()[0]?.advancedQuery === '' &&
                request.postDataJSON()[0]?.customData.facetTitle === facetTitle &&
                request.postDataJSON()[0]?.customData.facetField === facetField &&
                request.postDataJSON()[0]?.customData.facetValue === facetValue,
            {timeout: 5_000},
        );
        await FacetSelectors(page).facetCheckbox.first().click();
        await uaRequestUnexclude;
    });

    test('Should clear facet', async ({page}) => {
        await FacetSelectors(page).facetCheckbox.first().click();
        await page.waitForLoadState('networkidle');
        const uaRequest = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'facetClearAll' &&
                request.postDataJSON()[0]?.actionType === 'facet' &&
                request.postDataJSON()[0]?.customData.facetTitle === facetTitle &&
                request.postDataJSON()[0]?.customData.facetField === facetField,
        );
        await page.getByLabel(`Clear ${facetTitle}`).click();
        await uaRequest;
    });

    test('Should do facet search', async ({page}) => {
        const uaRequest = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'facetSearch' &&
                request.postDataJSON()?.actionType === 'facet' &&
                request.postDataJSON()?.customData.facetTitle === facetTitle &&
                request.postDataJSON()?.customData.facetField === facetField,
        );
        await FacetSelectors(page).facetSearchButton.click();
        await page.keyboard.type('ni');
        await uaRequest;
        await page.waitForLoadState('networkidle');

        await FacetSelectors(page).facetSearchValue.first().isVisible();
        const facetSearchSelected = await FacetSelectors(page).facetSearchValue.first().textContent();
        await FacetSelectors(page).facetSearchCheckbox.first().click();

        /* Validate breadcrumb */
        const breadcrumbList = await BreadcrumbSelectors(page).breadcrumbItemRow.first().textContent();
        expect(breadcrumbList).toEqual(`${facetTitle}:${facetSearchSelected}Clear`);
    });

    test('Should ShowMore & ShowLess result', async ({page}) => {
        /* Validate default number of facet  & value not sort */
        facetValueList.pop(); // remove last value `Search`
        expect(facetValueList.length).toEqual(defaultFacetNumberOfValues);

        /** Validate ShowMore */
        const uaRequest = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'showMoreFacetResults' &&
                request.postDataJSON()?.actionType === 'facet' &&
                request.postDataJSON()?.customData.facetTitle === facetTitle &&
                request.postDataJSON()?.customData.facetField === facetField,
        );
        await FacetSelectors(page).facetShowMore.first().click();
        await uaRequest;
        await FacetSelectors(page).facetShowLess.first().isVisible();
        await page.waitForTimeout(1000); // make sure facet list is fully loaded
        const newFacetValueList = await FacetSelectors(page).facetValue.allTextContents();
        newFacetValueList.pop();
        expect(newFacetValueList.length).toEqual(defaultFacetNumberOfValues + 10);

        /** Validate ShowLess */
        const uaRequestShowLess = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'showLessFacetResults' &&
                request.postDataJSON()?.actionType === 'facet' &&
                request.postDataJSON()?.customData.facetTitle === facetTitle &&
                request.postDataJSON()?.customData.facetField === facetField,
        );
        await FacetSelectors(page).facetShowLess.first().click();
        await uaRequestShowLess;
        await FacetSelectors(page).facetShowLess.first().isHidden();
        await page.waitForTimeout(1000); // make sure facet list is fully loaded
        const showLessFacetValueList = await FacetSelectors(page).facetValue.allTextContents();
        showLessFacetValueList.pop();
        expect(showLessFacetValueList.length).toEqual(defaultFacetNumberOfValues);
    });

    test.skip('Should sort facet label', async ({page}) => {
        /* Validate default number of facet  & value not sort */
        facetValueList.pop(); // remove last value `Search`
        const sortedValues = facetValueList.concat().sort(compareAlphanumericalValues);
        expect(facetValueList).not.toEqual(sortedValues);

        await FacetSelectors(page).settingButton.click();

        const uaRequest = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'facetUpdateSort' &&
                request.postDataJSON()?.actionType === 'facet' &&
                request.postDataJSON()?.customData.criteria === 'alphaascending',
            {timeout: 5_000},
        );
        await FacetSelectors(page).sortByLabelButton.click();
        await uaRequest;
        await page.waitForLoadState('networkidle');
        const newFacetValueList = await FacetSelectors(page).facetValue.allTextContents();
        newFacetValueList.pop();
        const newSortedValues = newFacetValueList.concat().sort(compareAlphanumericalValues);
        expect(newFacetValueList).toEqual(newSortedValues);
    });

    test('Should collapse facet', async ({page}) => {
        await expect(FacetSelectors(page).facetValue.first()).toBeVisible();
        /** Validate collapsed */
        await FacetSelectors(page).settingButton.click();
        await FacetSelectors(page).colapseButton.click();
        await expect(FacetSelectors(page).facetValue.first()).not.toBeVisible();

        /** Validate expand */
        await FacetSelectors(page).settingButton.click();
        await FacetSelectors(page).expandButton.click();
        await expect(FacetSelectors(page).facetValue.first()).toBeVisible();
    });
});
