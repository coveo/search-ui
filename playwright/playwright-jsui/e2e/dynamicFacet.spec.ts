import { test, expect } from '@playwright/test';
import { compareAlphanumericalValues, pageURL } from '../utils/utils'
import { isFacetSearchRequest, isSearchRequest, isUaCustomEvent, isUaSearchEvent } from '../utils/requests';
import { DynamicFacetSelectors } from '../utils/selectors'

const defaultFacetNumberOfValues = 8
let facetTitle, facetField, facetValue;
test.beforeEach(async ({ page }) => {
  await page.goto(pageURL('DynamicFacets'))
  facetTitle = await DynamicFacetSelectors(page).facet.getAttribute('data-title');
  facetField = await DynamicFacetSelectors(page).facet.getAttribute('data-field');
  facetValue = await DynamicFacetSelectors(page).facetValue.first().textContent();
})

test.describe('Dynamic Facet', async () => {
  test('Dynamic facet select', async ({ page }) => {
    const uaRequest = page.waitForRequest(
      (request) => isUaSearchEvent(request)
        && request.postDataJSON()[0]?.actionCause == 'facetSelect'
        && request.postDataJSON()[0]?.actionType == 'dynamicFacet'
        && request.postDataJSON()[0]?.customData.facetTitle == facetTitle
        && request.postDataJSON()[0]?.customData.facetField == facetField
        && request.postDataJSON()[0]?.customData.facetValue == facetValue
    );
    await DynamicFacetSelectors(page).facetCheckbox.first().click();
    await uaRequest;
  });

  test('Dynamic facet deselect', async ({ page }) => {
    await DynamicFacetSelectors(page).facetCheckbox.first().click();

    const uaRequest = page.waitForRequest(
      (request) => isUaSearchEvent(request)
        && request.postDataJSON()[0]?.actionCause == 'facetDeselect'
        && request.postDataJSON()[0]?.actionType == 'dynamicFacet'
        && request.postDataJSON()[0]?.customData.facetTitle == facetTitle
        && request.postDataJSON()[0]?.customData.facetField == facetField
        && request.postDataJSON()[0]?.customData.facetValue == facetValue
    );
    await DynamicFacetSelectors(page).facetCheckbox.first().click();
    await uaRequest;
  })

  test('Dynamic facet clear', async ({ page }) => {
    await DynamicFacetSelectors(page).facetCheckbox.first().click();

    const uaRequest = page.waitForRequest(
      (request) => isUaSearchEvent(request)
        && request.postDataJSON()[0]?.actionCause == 'facetClearAll'
        && request.postDataJSON()[0]?.actionType == 'dynamicFacet'
        && request.postDataJSON()[0]?.customData.facetTitle == facetTitle
        && request.postDataJSON()[0]?.customData.facetField == facetField
    );
    await page.getByLabel(`Clear ${facetTitle}`).click();
    await uaRequest;

  })

  test('Dynamic facet search', async ({ page }) => {
    const searchQuery = 'ni'
    const facetResponse = page.waitForResponse(
      (response) => isFacetSearchRequest(response.request())
        && response.status() === 200
        && response.request().postDataJSON().query == `*${searchQuery}*`)
    await DynamicFacetSelectors(page).facetSearchbox.click()
    await page.keyboard.type('ni');
    await facetResponse;
    await DynamicFacetSelectors(page).facetSearchValue.first().isVisible()

    const returnedFacetList = await DynamicFacetSelectors(page).facetSearchValue.allTextContents()
    expect(!returnedFacetList.filter(value => value.toLowerCase().indexOf(searchQuery) === -1).length).toBeTruthy();
  })

  test('Dynamic facet search click', async ({ page }) => {
    const searchQuery = 'ni'
    const facetResponse = page.waitForResponse(
      (response) => isFacetSearchRequest(response.request())
        && response.status() === 200
        && response.request().postDataJSON().query == `*${searchQuery}*`)
    await DynamicFacetSelectors(page).facetSearchbox.click()
    await page.keyboard.type('ni');
    await facetResponse;

    facetValue = await DynamicFacetSelectors(page).facetSearchValue.first().textContent()
    const uaRequest = page.waitForRequest(
      (request) => isUaSearchEvent(request)
        && request.postDataJSON()[0]?.actionCause == 'facetSelect'
        && request.postDataJSON()[0]?.actionType == 'dynamicFacet'
        && request.postDataJSON()[0]?.customData.facetTitle == facetTitle
        && request.postDataJSON()[0]?.customData.facetField == facetField
        && request.postDataJSON()[0]?.customData.facetValue == facetValue
    );
    await DynamicFacetSelectors(page).facetSearchValue.first().click()
    await uaRequest;
  })

  test('Dynamic facet show more', async ({ page }) => {
    //Validate default number of facet  & value not sort
    const facetValueList = await DynamicFacetSelectors(page).facetValue.allTextContents()
    expect(facetValueList.length).toEqual(defaultFacetNumberOfValues);

    const sortedValues = facetValueList.concat().sort(compareAlphanumericalValues);
    expect(facetValueList).not.toEqual(sortedValues)

    const uaRequest = page.waitForRequest(
      (request) => isUaCustomEvent(request)
        && request.postDataJSON()?.actionCause == 'showMoreFacetResults'
        && request.postDataJSON()?.actionType == 'dynamicFacet'
        && request.postDataJSON()?.customData.facetTitle == facetTitle
        && request.postDataJSON()?.customData.facetField == facetField
    );
    await DynamicFacetSelectors(page).facetShowMore.first().click();
    await uaRequest;
    await DynamicFacetSelectors(page).facetShowLess.first().isVisible();

    // Validate number of facets & values are sorted
    await page.waitForTimeout(1000); // make sure facet list is fully loaded
    const newFacetValueList = await DynamicFacetSelectors(page).facetValue.allTextContents()
    expect(newFacetValueList.length).toEqual(defaultFacetNumberOfValues * 2);

    const newSortedValue = newFacetValueList.concat().sort(compareAlphanumericalValues);
    expect(newFacetValueList).toEqual(newSortedValue)
  })

  test('Dynamic facet show less', async ({ page }) => {
    await DynamicFacetSelectors(page).facetShowMore.first().click();
    await page.waitForTimeout(1000);
    //Validate default number of facet Value
    const facetValueList = await DynamicFacetSelectors(page).facetValue.allTextContents()
    expect(facetValueList.length).toEqual(defaultFacetNumberOfValues * 2);

    const uaRequest = page.waitForRequest(
      (request) => isUaCustomEvent(request)
        && request.postDataJSON()?.actionCause == 'showLessFacetResults'
        && request.postDataJSON()?.actionType == 'dynamicFacet'
        && request.postDataJSON()?.customData.facetTitle == facetTitle
        && request.postDataJSON()?.customData.facetField == facetField
    );
    await DynamicFacetSelectors(page).facetShowLess.first().click();
    await uaRequest;

    // Validate number of facet & values are not sorted
    await page.waitForTimeout(1000); // make sure facet list is fully loaded
    const newFacetValueList = await DynamicFacetSelectors(page).facetValue.allTextContents()
    expect(newFacetValueList.length).toEqual(defaultFacetNumberOfValues);

    const sortedValues = newFacetValueList.concat().sort(compareAlphanumericalValues);
    expect(newFacetValueList).not.toEqual(sortedValues)
  })
})

