import {test, expect} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {isUaSearchEvent} from '../utils/requests';
import {BreadcrumbSelectors, FacetRangSelectors} from '../utils/selectors';

const defaultFacetNumberOfValues = 9;
let facetTitle, facetField, facetValue, facetValueList;

test.beforeEach(async ({page}) => {
    await page.goto(pageURL('00_standardsp4automated_1'));
    facetTitle = await FacetRangSelectors(page).facetRange.getAttribute('data-title');
    facetField = await FacetRangSelectors(page).facetRange.getAttribute('data-field');
    facetValue = await FacetRangSelectors(page).facetRangeValue.first().textContent();
    facetValueList = await FacetRangSelectors(page).facetRangeValue.allTextContents();
});

test.describe('Facet Range Tests', () => {
    test('Should select facet range', async ({page}) => {
        /** Validate default render   */
        expect(facetValueList.length).toEqual(defaultFacetNumberOfValues);

        /** Validate default Select facet   */
        const uaRequest = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'facetSelect' &&
                request.postDataJSON()[0]?.actionType === 'facet' &&
                request.postDataJSON()[0]?.customData.facetTitle === facetTitle &&
                request.postDataJSON()[0]?.customData.facetField === facetField,
            {timeout: 5_000},
        );
        await FacetRangSelectors(page).facetRangeCheckbox.first().click();
        await uaRequest;

        /* Validate breadcrumb */
        const breadcrumbList = await BreadcrumbSelectors(page).breadcrumbItemRow.first().textContent();
        expect(breadcrumbList).toEqual(`${facetTitle}:${facetValue}Clear`);
    });
});
