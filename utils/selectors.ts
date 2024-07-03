import {Page} from '@playwright/test';

export const BreadcrumbSelectors = (page: Page) =>
    Object.freeze({
        breadcrumbItemRow: page.locator('.coveo-breadcrumb-item'),
        breadcrumbDynamicFacetValue: page.locator('.coveo-dynamic-facet-breadcrumb-value'),
        breadcrumbFacetValue: page.locator('.coveo-facet-breadcrumb-value'),
        breadcrumbClearFacet: page.locator('.CoveoBreadcrumb').getByLabel(/Remove inclusion filter/),
        breadcrumbClearAll: page.getByRole('button', {name: 'Clear All Filters'}),
    });

export const DocumentFieldSelectors = (page: Page) =>
    Object.freeze({
        fieldValue: page.locator('.CoveoFieldValue span.coveo-clickable'),
    });

export const DynamicFacetSelectors = (page: Page, facetField = '@author') =>
    Object.freeze({
        facet: page.locator(`.CoveoDynamicFacet[data-field="${facetField}"]`),
        facetCheckbox: page.locator(`.CoveoDynamicFacet[data-field="${facetField}"]`).getByRole('checkbox'),
        facetValue: page.locator(`.CoveoDynamicFacet[data-field="${facetField}"] span.coveo-checkbox-span-label`),
        facetSearchbox: page.locator(`.CoveoDynamicFacet[data-field="${facetField}"]`).getByPlaceholder('Search'),
        facetSearchValue: page
            .locator(`.CoveoDynamicFacet[data-field="${facetField}"]`)
            .locator('ul.coveo-combobox-values span.coveo-checkbox-span-label'),
        facetShowMore: page.locator(`.CoveoDynamicFacet[data-field="${facetField}"]`).getByLabel(/Show more/),
        facetShowLess: page.locator(`.CoveoDynamicFacet[data-field="${facetField}"]`).getByLabel(/Show fewer/),
    });

export const PagerSelectors = (page: Page) =>
    Object.freeze({
        nextButton: page.getByLabel('Next'),
        previousButton: page.getByLabel('Previous'),
        currentPagerItem: page.locator('.coveo-pager-list-item.coveo-active'),
    });

export const ResultLayoutSelectors = (page: Page) =>
    Object.freeze({
        listButton: page.getByLabel('Display results as List'),
        cardButton: page.getByLabel('Display results as Card'),
        tableButton: page.getByLabel('Display results as Table'),
    });

export const SearchboxSelectors = (page: Page) =>
    Object.freeze({
        searchboxInput: page.getByRole('combobox', {name: 'Search'}),
        searchboxIcon: page.getByRole('button', {name: 'Search', exact: true}),
    });
