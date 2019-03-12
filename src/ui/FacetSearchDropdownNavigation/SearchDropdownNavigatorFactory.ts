import { ISearchDropdownNavigator, ISearchDropdownConfig, DefaultSearchDropdownNavigator } from './DefaultSearchDropdownNavigator';
import { FacetSearchDropdownNavigator } from './FacetSearchDropdownNavigator';
import { IFacetSearch } from '../Facet/IFacetSearch';
import { CategoryFacet } from '../CategoryFacet/CategoryFacet';
import { Facet } from '../Facet/Facet';

export function SearchDropdownNavigatorFactory(facetSearch: IFacetSearch, config: ISearchDropdownConfig): ISearchDropdownNavigator {
  switch (facetSearch.facetType) {
    case CategoryFacet.ID:
      return new DefaultSearchDropdownNavigator(config);

    case Facet.ID:
    default:
      return new FacetSearchDropdownNavigator({ ...config, facetSearch });
  }
}
