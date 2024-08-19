import {test, expect} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {isUaSearchEvent} from '../utils/requests';
import {BreadcrumbSelectors, FacetSliderlectors} from '../utils/selectors';

const defaultFacetNumberOfValues = 10;
let facetTitle, facetField, facetValue, facetValueList;

test.beforeEach(async ({page}) => {
    await page.goto(pageURL('00_standardsp4automated_1'));
    facetTitle = await FacetSliderlectors(page).facetSlider.getAttribute('data-title');
    facetField = await FacetSliderlectors(page).facetSlider.getAttribute('data-field');
    facetValue = await FacetSliderlectors(page).sliderCaption.first().textContent();
});

test.describe('Facet Slider Tests', () => {
    test('Should slide facet range', async ({page}) => {
        const rec = await FacetSliderlectors(page).sliderBar.boundingBox();

        /** Slide left-button */
        const uaRequestLeft = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'facetRangeSlider' &&
                request.postDataJSON()[0]?.actionType === 'facet',
            {timeout: 5_000},
        );
        await FacetSliderlectors(page).startSlider.hover();
        await page.mouse.down();
        await page.mouse.move(rec!.x + 100, rec!.y);
        await page.mouse.up();
        await uaRequestLeft;
        await page.waitForLoadState('networkidle');
        facetValue = await FacetSliderlectors(page).sliderCaption.first().textContent();

        /* Validate breadcrumb */
        let breadcrumbList = await BreadcrumbSelectors(page).breadcrumbItemRow.first().textContent();
        expect(breadcrumbList).toEqual(`${facetTitle}: ${facetValue.replace('  ', ' ').trim()}Clear`);

        /** Slide right-button */
        const newRec = await FacetSliderlectors(page).sliderBar.boundingBox();
        const uaRequestRight = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'facetRangeSlider' &&
                request.postDataJSON()[0]?.actionType === 'facet',
            {timeout: 5_000},
        );
        await FacetSliderlectors(page).endSlider.hover();
        await page.mouse.down();
        await page.mouse.move(newRec!.x + 100, newRec!.y);
        await page.mouse.up();
        await uaRequestRight;
        facetValue = await FacetSliderlectors(page).sliderCaption.first().textContent();

        /* Validate breadcrumb */
        breadcrumbList = await BreadcrumbSelectors(page).breadcrumbItemRow.first().textContent();
        expect(breadcrumbList).toEqual(`${facetTitle}: ${facetValue.replace('  ', ' ').trim()}Clear`);
    });
});
