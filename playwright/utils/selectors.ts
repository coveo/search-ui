import { Page } from "@playwright/test";

export const DynamicFacetSelectors = (page: Page, facetField = '@author') => Object.freeze({
    facet: page.locator(`.CoveoDynamicFacet[data-field="${facetField}"]`),
    facetCheckbox: page.locator(`.CoveoDynamicFacet[data-field="${facetField}"]`).getByRole('checkbox'),
    facetValue: page.locator(`.CoveoDynamicFacet[data-field="${facetField}"] span.coveo-checkbox-span-label`),
    facetSearchbox: page.locator(`.CoveoDynamicFacet[data-field="${facetField}"]`).getByPlaceholder('Search'),
    facetSearchValue: page.locator(`.CoveoDynamicFacet[data-field="${facetField}"]`).locator('ul.coveo-combobox-values span.coveo-checkbox-span-label'),
    facetShowMore:page.locator(`.CoveoDynamicFacet[data-field="${facetField}"]`).getByLabel(/Show more/),
    facetShowLess:page.locator(`.CoveoDynamicFacet[data-field="${facetField}"]`).getByLabel(/Show fewer/)
})