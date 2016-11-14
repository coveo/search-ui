import {ResponsiveDropdown} from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdown';
import {ResponsiveDropdownHeader} from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdownHeader';
import {ResponsiveDropdownContent} from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdownContent';
import {ResponsiveComponentsManager} from '../../../src/ui/ResponsiveComponents/ResponsiveComponentsManager';
import {ResponsiveFacets} from '../../../src/ui/ResponsiveComponents/ResponsiveFacets';
import {$$, Dom} from '../../../src/utils/Dom';
import {Facet} from '../../../src/ui/Facet/Facet';
import {FacetSearch} from '../../../src/ui/Facet/FacetSearch';
import {FacetSearchValuesList} from '../../../src/ui/Facet/FacetSearchValuesList';
import * as Mock from '../../MockEnvironment';

export function ResponsiveFacetsTest() {
  describe('ResponsiveFacets', () => {
    let root: Dom;
    let responsiveDropdown: ResponsiveDropdown;
    let responsiveDropdownHeader: ResponsiveDropdownHeader;
    let responsiveDropdownContent: ResponsiveDropdownContent;
    let responsiveFacets: ResponsiveFacets;
    beforeEach(() => {
      root = $$('div');
      root.append($$('div', { className: 'coveo-facet-column' }).el);
      root.append($$('div', { className: ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS }).el);
      responsiveDropdown = jasmine.createSpyObj('responsiveDropdown', ['registerOnOpenHandler', 'registerOnCloseHandler', 'cleanUp', 'open', 'close', 'disablePopupBackground']);
      responsiveDropdownContent = jasmine.createSpyObj('responsiveDropdownContent', ['positionDropdown', 'hideDropdown', 'cleanUp', 'element']);
      responsiveDropdownContent.element = $$('div');
      responsiveDropdownHeader = jasmine.createSpyObj('responsiveDropdownHeader', ['open', 'close', 'cleanUp']);
      responsiveDropdownHeader.element = $$('div');
      responsiveDropdown.dropdownContent = responsiveDropdownContent;
      responsiveDropdown.dropdownHeader = responsiveDropdownHeader;
      responsiveFacets = new ResponsiveFacets(root, '', {}, responsiveDropdown);
    });

    it('when a facet is registered then position search results is called on scroll', (done) => {
      let envBuilder = new Mock.MockEnvironmentBuilder();
      envBuilder.withRoot(root.el);
      let facet = new Facet(envBuilder.getBindings().element, {}, envBuilder.getBindings());
      facet.facetSearch = new FacetSearch(facet, FacetSearchValuesList, root.el);
      facet.facetSearch.build();
      facet.facetSearch.currentlyDisplayedResults = ['result'];
      spyOn(facet.facetSearch, 'positionSearchResults');
      responsiveFacets.registerComponent(facet);

      $$(responsiveDropdownContent.element).trigger('scroll');

      setTimeout(() => {
        expect(facet.facetSearch.positionSearchResults).toHaveBeenCalled();
        done();
      }, ResponsiveFacets.DEBOUNCE_SCROLL_WAIT + 1);
    });

    it('registers an on open handler on the responsive dropdown', () => {
      expect(responsiveDropdown.registerOnOpenHandler).toHaveBeenCalledWith(responsiveFacets.drawFacetSliderGraphs, responsiveFacets);
    });

    it('registers an on close handler on the responsive dropdown', () => {
      expect(responsiveDropdown.registerOnCloseHandler).toHaveBeenCalledWith(responsiveFacets.dismissFacetSearches, responsiveFacets);
    });

    it('calls position dropdown when handleResizeEvent is called if the dropdown is opened', () => {
      responsiveDropdown.isOpened = true;
      responsiveFacets.handleResizeEvent();
      expect(responsiveDropdownContent.positionDropdown).toHaveBeenCalled();
    });

    it('positions the dropdown when handleResizeEvent is called and it should switch to small mode', () => {
      spyOn(root, 'width').and.returnValue(ResponsiveFacets.RESPONSIVE_BREAKPOINT - 1);
      responsiveFacets.handleResizeEvent();
      expect(responsiveDropdown.dropdownContent.positionDropdown).toHaveBeenCalled();
    });





  });
}
