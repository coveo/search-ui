import { ISearchDropdownNavigator, ISearchDropdownConfig, DefaultSearchDropdownNavigator } from './DefaultSearchDropdownNavigator';
import { FacetSearchDropdownNavigator } from './FacetSearchDropdownNavigator';
import { IFacetSearch } from '../IFacetSearch';
import { CategoryFacet } from '../../CategoryFacet/CategoryFacet';
import { Facet } from '../Facet';

export function SearchDropdownNavigatorFactory(facetSearch: IFacetSearch, config: ISearchDropdownConfig): ISearchDropdownNavigator {
  switch (facetSearch.facetType) {
    case Facet.ID:
      return new FacetSearchDropdownNavigator({ ...config, facetSearch });

    case CategoryFacet.ID:
    default:
      return new DefaultSearchDropdownNavigator(config);
  }
}
