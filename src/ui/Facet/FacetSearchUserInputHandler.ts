import { IFacetSearch } from './IFacetSearch';
import { KEYBOARD } from '../../utils/KeyboardUtils';
export class FacetSearchUserInputHandler {
  constructor(private facetSearch: IFacetSearch) {}

  public handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.which) {
      case KEYBOARD.ENTER:
        this.facetSearch.keyboardNavigationEnterPressed(event);
        break;
      case KEYBOARD.DELETE:
        this.facetSearch.keyboardNavigationDeletePressed && this.facetSearch.keyboardNavigationDeletePressed(event);
        break;
      case KEYBOARD.ESCAPE:
        this.facetSearch.dismissSearchResults();
        break;
      case KEYBOARD.DOWN_ARROW:
        this.facetSearch.facetSearchElement.moveCurrentResultDown();
        break;
      case KEYBOARD.UP_ARROW:
        this.facetSearch.facetSearchElement.moveCurrentResultUp();
        break;
      default:
        this.facetSearch.keyboardEventDefaultHandler();
    }
  }

  public handleFacetSearchResultsScroll() {
    if (
      this.facetSearch.facetSearchPromise ||
      this.facetSearch.facetSearchElement.getValueInInputForFacetSearch() != '' ||
      !this.facetSearch.moreValuesToFetch
    ) {
      return;
    }

    let elementHeight = this.facetSearch.facetSearchElement.searchResults.clientHeight;
    let scrollHeight = this.facetSearch.facetSearchElement.searchResults.scrollHeight;
    let bottomPosition = this.facetSearch.facetSearchElement.searchResults.scrollTop + elementHeight;
    if (scrollHeight - bottomPosition < elementHeight / 2) {
      this.facetSearch.fetchMoreValues();
    }
  }
}
