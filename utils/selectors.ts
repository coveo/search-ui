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

export const DynamicCategoryFacetSelects = (page: Page, facetField = '@geographicalhierarchy') =>
    Object.freeze({
        categoryFacet: page.locator(`.CoveoDynamicHierarchicalFacet[data-field="${facetField}"]`),
        clearAllCategory: page.getByRole('button', {name: 'Arrow Down All Categories'}),
        valueL1: page.locator(
            'ul li .coveo-dynamic-hierarchical-facet-value:not(.coveo-with-space) .coveo-dynamic-hierarchical-facet-value-label',
        ),
        valueL2: page.locator(
            'ul li .coveo-dynamic-hierarchical-facet-value.coveo-with-space .coveo-dynamic-hierarchical-facet-value-label',
        ),
        showMore: page.locator('.coveo-dynamic-hierarchical-facet-show-more'),
        showLess: page.locator('.coveo-dynamic-hierarchical-facet-show-less'),
    });

export const DynamicFacetRangeSelects = (page: Page, facetField = '@ytviewcount') =>
    Object.freeze({
        facetRange: page.locator(`.CoveoDynamicFacetRange[data-field="${facetField}"]`),
        value: page.locator(`.CoveoDynamicFacetRange[data-field="${facetField}"] span.coveo-checkbox-span-label`),
    });

export const FacetSelectors = (page: Page, facetField = '@objecttype') =>
    Object.freeze({
        facet: page.locator(`.CoveoFacet[data-field="${facetField}"]`),
        facetCheckbox: page.locator(`.CoveoFacet[data-field="${facetField}"] ul li`).getByRole('button'),
        facetValue: page.locator(`.CoveoFacet[data-field="${facetField}"] span.coveo-facet-value-caption`),
        excludeFacetButton: page
            .locator(`.CoveoFacet[data-field="${facetField}"] ul li`)
            .getByLabel(/Exclusion filter on/),
        facetSearchButton: page.locator(`.CoveoFacet[data-field="${facetField}"]`).getByTitle('Search', {exact: true}),
        facetSearchCheckbox: page
            .locator(`.CoveoFacet[data-field="${facetField}"]`)
            .locator('ul.coveo-facet-search-results li div.coveo-facet-value-checkbox'),
        facetSearchValue: page
            .locator(`.CoveoFacet[data-field="${facetField}"]`)
            .locator('ul.coveo-facet-search-results li span.coveo-facet-value-caption'),
        facetShowMore: page.locator(`.CoveoFacet[data-field="${facetField}"]`).getByLabel(/Show more/),
        facetShowLess: page.locator(`.CoveoFacet[data-field="${facetField}"]`).getByLabel(/Show fewer/),
        settingButton: page.locator(`.CoveoFacet[data-field="${facetField}"]`).getByLabel('Settings'),
        sortByLabelButton: page.getByLabel('Label'),
        colapseButton: page
            .locator(`.CoveoFacet[data-field="${facetField}"] div`)
            .getByLabel(/Collapse/)
            .first(),
        expandButton: page
            .locator(`.CoveoFacet[data-field="${facetField}"] div`)
            .getByLabel(/Expand/)
            .first(),
    });

export const FacetRangSelectors = (page: Page, facetField = '@indexeddate') =>
    Object.freeze({
        facetRange: page.locator(`.CoveoFacetRange[data-field="${facetField}"]`),
        facetRangeCheckbox: page.locator(`.CoveoFacetRange[data-field="${facetField}"] ul li`).getByRole('button'),
        facetRangeValue: page.locator(`.CoveoFacetRange[data-field="${facetField}"] span.coveo-facet-value-caption`),
    });

export const FacetSliderlectors = (page: Page, facetField = '@ytviewcount') =>
    Object.freeze({
        facetSlider: page.locator(`.CoveoFacetSlider[data-field="${facetField}"]`),
        startSlider: page
            .locator(`.CoveoFacetSlider[data-field="${facetField}"]`)
            .locator('.coveo-slider-button')
            .first(),
        endSlider: page.locator(`.CoveoFacetSlider[data-field="${facetField}"]`).locator('.coveo-slider-button').last(),
        sliderBar: page
            .locator(`.CoveoFacetSlider[data-field="${facetField}"]`)
            .locator('.coveo-slider-line.coveo-active'),
        sliderCaption: page.locator(`.CoveoFacetSlider[data-field="${facetField}"]`).locator('.coveo-slider-caption'),
    });

export const PagerSelectors = (page: Page) =>
    Object.freeze({
        nextButton: page.getByLabel('Next', {exact: true}),
        previousButton: page.getByLabel('Previous', {exact: true}),
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
        searchboxClearIcon: page.getByRole('button', {name: 'Clear'}),
    });

export const SortSelectors = (page: Page) =>
    Object.freeze({
        sortRelevance: page.getByLabel('Sort results by Relevance'),
        sortDateDescending: page.getByLabel('Sort by Date in descending'),
        sortDateAscending: page.getByLabel('Sort by Date in ascending'),
    });

export const QuickviewSelectors = (page: Page) =>
    Object.freeze({
        quickviewIcon: page.locator('.CoveoQuickview'),
        quickviewBackdrop: page.locator('.coveo-modal-backdrop'),
        quickviewClose: page.getByRole('button', {name: 'Close'}),
        quickviewResultLink: page.locator('a.coveo-quickview-pop-up-reminder.CoveoResultLink'),
    });
