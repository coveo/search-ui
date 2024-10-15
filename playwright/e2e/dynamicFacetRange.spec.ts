import {test, expect} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {isUaSearchEvent} from '../utils/requests';
import {BreadcrumbSelectors, DynamicFacetRangeSelects} from '../utils/selectors';

const defaultValueSeparator = 'to';
const defaultRange = [
    {
        start: 0,
        end: 100,
    },
    {
        start: 100,
        end: 1000,
    },
    {
        start: 1000,
        end: 2000,
    },
    {
        start: 2000,
        end: 10000,
    },
];
let facetTitle, allFacetValues, facetValue_Level1, breadcrumbList;

const formatNumberOfRange = (number: number) => {
    return new Intl.NumberFormat('en').format(number);
};
const convertRange = (array, seperator = defaultValueSeparator, symbol = '') => {
    let value: string[] = [];
    array.forEach(({start, end}) => {
        const val = `${symbol}${formatNumberOfRange(start)} ${seperator} ${symbol}${formatNumberOfRange(end)}`;
        value.push(val);
    });
    return value;
};
test.describe('Dynamic Facet Range default format', () => {
    test.beforeEach(async ({page}) => {
        await page.goto(pageURL('DynamicFacets'));
        await page.waitForLoadState('networkidle');
        facetTitle = await DynamicFacetRangeSelects(page).facetRange.getAttribute('data-title');
        allFacetValues = await DynamicFacetRangeSelects(page).value.allTextContents();
        facetValue_Level1 = await DynamicFacetRangeSelects(page).value.first().textContent();
    });
    test('Should select dynamic facet range', async ({page}) => {
        /* Validate default render */
        const convRange = convertRange(defaultRange);
        expect(allFacetValues).toEqual(convRange);

        /* Select DNE facet range */
        const uaRequestDNE_first = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'facetSelect' &&
                request.postDataJSON()[0]?.actionType === 'dynamicFacet' &&
                request.postDataJSON()[0]?.customData.facetValue ===
                    `${defaultRange[0].start}..${defaultRange[0].end}` &&
                request.postDataJSON()[0]?.facetState[0].facetType === 'numericalRange' &&
                request.postDataJSON()[0]?.facetState[0].valuePosition === 1,
            {timeout: 5_000},
        );

        await DynamicFacetRangeSelects(page).value.first().click();
        await uaRequestDNE_first;

        /* Validate breadcrumb */
        breadcrumbList = await BreadcrumbSelectors(page).breadcrumbItemRow.first().textContent();
        expect(breadcrumbList).toEqual(`${facetTitle}:${facetValue_Level1}Clear`);
    });

    test('Should deselect dynamic facet range', async ({page}) => {
        await DynamicFacetRangeSelects(page).value.first().click();
        await page.waitForLoadState('networkidle');
        const uaRequest = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'facetDeselect' &&
                request.postDataJSON()[0]?.actionType === 'dynamicFacet' &&
                request.postDataJSON()[0]?.customData.facetValue === `${defaultRange[0].start}..${defaultRange[0].end}`,
        );
        await DynamicFacetRangeSelects(page).value.first().click();
        await uaRequest;
    });

    test('Should clear dynamic facet range', async ({page}) => {
        await DynamicFacetRangeSelects(page).value.first().click();
        await page.waitForLoadState('networkidle');
        const uaRequest = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'facetClearAll' &&
                request.postDataJSON()[0]?.actionType === 'dynamicFacet' &&
                request.postDataJSON()[0]?.customData.facetTitle === facetTitle,
        );
        await page.getByLabel(`Clear ${facetTitle}`, {exact: true}).click();
        await uaRequest;
    });
});

test.describe('Dynamic Facet Range renderCurrency custom format', () => {
    const customRange = [
        {
            start: 0,
            end: 300,
        },
        {
            start: 301,
            end: 600,
        },
    ];
    const customSymbol = 'CAD$';
    const customSeparator = '-';
    test.beforeEach(async ({page}) => {
        await page.goto(pageURL('DynamicFacets'));
        await page.waitForLoadState('networkidle');
        facetTitle = await DynamicFacetRangeSelects(page, '@ytvideoduration').facetRange.getAttribute('data-title');
        allFacetValues = await DynamicFacetRangeSelects(page, '@ytvideoduration').value.allTextContents();
        facetValue_Level1 = await DynamicFacetRangeSelects(page, '@ytvideoduration').value.first().textContent();
    });

    test('Should select custom dynamic facet range', async ({page}) => {
        /* Validate default render */
        const convRange = convertRange(customRange, customSeparator, customSymbol);
        expect(allFacetValues).toEqual(convRange);

        /* Select DNE facet range */
        const uaRequestDNE_first = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'facetSelect' &&
                request.postDataJSON()[0]?.actionType === 'dynamicFacet' &&
                request.postDataJSON()[0]?.customData.facetValue === `${customRange[0].start}..${customRange[0].end}` &&
                request.postDataJSON()[0]?.facetState[0].facetType === 'numericalRange' &&
                request.postDataJSON()[0]?.facetState[0].valuePosition === 1,
            {timeout: 5_000},
        );

        await DynamicFacetRangeSelects(page, '@ytvideoduration').value.first().click();
        await uaRequestDNE_first;

        /* Validate breadcrumb */
        breadcrumbList = await BreadcrumbSelectors(page).breadcrumbItemRow.first().textContent();
        expect(breadcrumbList).toEqual(`${facetTitle}:${facetValue_Level1}Clear`);
    });
});
