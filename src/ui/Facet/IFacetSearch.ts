import { FacetSearchElement } from './FacetSearchElement';
import { IIndexFieldValue } from '../../rest/FieldValue';

export interface IFacetSearch {
  facetType: string;
  currentlyDisplayedResults: string[];
  facetSearchElement: FacetSearchElement;
  facetSearchPromise: Promise<IIndexFieldValue[]>;
  moreValuesToFetch: boolean;

  setExpandedFacetSearchAccessibilityAttributes: (searchResultsElement: HTMLElement) => void;
  setCollapsedFacetSearchAccessibilityAttributes: () => void;
  dismissSearchResults: () => void;
  getCaptions: () => HTMLElement[];
  displayNewValues: (params?) => void;
  keyboardNavigationEnterPressed: (event: KeyboardEvent) => void;
  keyboardNavigationDeletePressed?: (event: KeyboardEvent) => void;
  keyboardEventDefaultHandler: () => void;
  fetchMoreValues: () => void;
  updateAriaLive: (text: string) => void;
}
