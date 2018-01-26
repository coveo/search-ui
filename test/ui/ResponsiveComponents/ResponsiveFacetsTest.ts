import { ResponsiveDropdown } from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdown';
import { ResponsiveDropdownHeader } from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdownHeader';
import { ResponsiveDropdownContent } from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdownContent';
import { ResponsiveComponentsManager } from '../../../src/ui/ResponsiveComponents/ResponsiveComponentsManager';
import { ResponsiveComponentsUtils } from '../../../src/ui/ResponsiveComponents/ResponsiveComponentsUtils';
import { ResponsiveFacets } from '../../../src/ui/ResponsiveComponents/ResponsiveFacets';
import { $$, Dom } from '../../../src/utils/Dom';
import { Facet } from '../../../src/ui/Facet/Facet';
import { FacetSearch } from '../../../src/ui/Facet/FacetSearch';
import { FacetSearchValuesList } from '../../../src/ui/Facet/FacetSearchValuesList';
import * as Mock from '../../MockEnvironment';
import { QueryEvents } from '../../../src/events/QueryEvents';
import { FakeResults } from '../../Fake';
import { ResponsiveComponents } from '../../../src/ui/ResponsiveComponents/ResponsiveComponents';

export function ResponsiveFacetsTest() {
  describe('ResponsiveFacets', () => {
    let largeWidth = new ResponsiveComponents().getMediumScreenWidth() + 1;
    let smallWidth = new ResponsiveComponents().getMediumScreenWidth() - 1;
    let dropdownHeaderClassName = 'dropdown-header';
    let root: Dom;
    let responsiveDropdown: ResponsiveDropdown;
    let responsiveDropdownHeader: ResponsiveDropdownHeader;
    let responsiveDropdownContent: ResponsiveDropdownContent;
    let responsiveFacets: ResponsiveFacets;
    let facet: Facet;
    let envBuilder: Mock.MockEnvironmentBuilder;

    function registerFacet(preservePosition = true) {
      envBuilder = new Mock.MockEnvironmentBuilder();
      envBuilder.withRoot(root.el);
      facet = new Facet(envBuilder.getBindings().element, {}, envBuilder.getBindings());
      facet.facetSearch = new FacetSearch(facet, FacetSearchValuesList, root.el);
      facet.facetSearch.build();
      facet.facetSearch.currentlyDisplayedResults = ['result'];
      facet.options.preservePosition = preservePosition;
      responsiveFacets.registerComponent(facet);
    }

    function shouldSwitchToSmallMode() {
      let spy = jasmine.createSpy('width').and.returnValue(smallWidth);
      root.width = <any>spy;
    }

    function shouldSwitchToLargeMode() {
      let spy = jasmine.createSpy('width').and.returnValue(largeWidth);
      root.width = <any>spy;
    }

    beforeEach(() => {
      root = $$('div');
      root.append($$('div', { className: 'coveo-facet-column' }).el);
      root.append($$('div', { className: ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS }).el);
      responsiveDropdown = jasmine.createSpyObj('responsiveDropdown', [
        'registerOnOpenHandler',
        'registerOnCloseHandler',
        'cleanUp',
        'open',
        'close',
        'disablePopupBackground'
      ]);
      responsiveDropdownContent = jasmine.createSpyObj('responsiveDropdownContent', [
        'positionDropdown',
        'hideDropdown',
        'cleanUp',
        'element'
      ]);
      responsiveDropdownContent.element = $$('div');
      responsiveDropdownHeader = jasmine.createSpyObj('responsiveDropdownHeader', ['open', 'close', 'cleanUp', 'show', 'hide']);
      responsiveDropdownHeader.element = $$('div', { className: dropdownHeaderClassName });
      responsiveDropdown.dropdownContent = responsiveDropdownContent;
      responsiveDropdown.dropdownHeader = responsiveDropdownHeader;
      responsiveFacets = new ResponsiveFacets(root, '', {}, responsiveDropdown);

      registerFacet();
    });

    it('when a facet is registered then position search results is called on scroll', done => {
      spyOn(facet.facetSearch, 'positionSearchResults');

      $$(responsiveDropdownContent.element).trigger('scroll');

      setTimeout(() => {
        expect(facet.facetSearch.positionSearchResults).toHaveBeenCalled();
        done();
      }, ResponsiveFacets.DEBOUNCE_SCROLL_WAIT + 1);
    });

    it('registers dismissFacetSearches an on close handler on the responsive dropdown', () => {
      expect(responsiveDropdown.registerOnCloseHandler).toHaveBeenCalledWith(responsiveFacets.dismissFacetSearches, responsiveFacets);
    });

    it('calls position dropdown when handleResizeEvent is called if the dropdown is opened', () => {
      responsiveDropdown.isOpened = true;
      responsiveFacets.handleResizeEvent();
      expect(responsiveDropdownContent.positionDropdown).toHaveBeenCalled();
    });

    describe('when it should switch to small mode', () => {
      it('returns true when needDropdownWrapper is called', () => {
        shouldSwitchToSmallMode();
        expect(responsiveFacets.needDropdownWrapper()).toBe(true);
      });

      it('closes dropdown when handleResizeEvent is called', () => {
        shouldSwitchToSmallMode();
        responsiveFacets.handleResizeEvent();
        expect(responsiveDropdown.close).toHaveBeenCalled();
      });

      it('disables facet preserve position when handleResizeEvent is called', () => {
        shouldSwitchToSmallMode();
        responsiveFacets.handleResizeEvent();
        expect(facet.options.preservePosition).toBe(false);
      });

      it('appends the dropdown header when handleResizeEvent is called', () => {
        shouldSwitchToSmallMode();
        responsiveFacets.handleResizeEvent();
        expect(root.find(`.${dropdownHeaderClassName}`)).not.toBeNull();
      });

      it('activates the small facets when handleResizeEvent is called', () => {
        spyOn(ResponsiveComponentsUtils, 'activateSmallFacet');
        shouldSwitchToSmallMode();
        responsiveFacets.handleResizeEvent();
        expect(ResponsiveComponentsUtils.activateSmallFacet).toHaveBeenCalled();
      });

      it('should hide on query error', () => {
        facet.createDom();
        root.trigger(QueryEvents.queryError);
        expect(responsiveDropdownHeader.hide).toHaveBeenCalled();
      });

      it('should hide on query success with 0 results', () => {
        root.trigger(QueryEvents.querySuccess, { results: FakeResults.createFakeResults(0) });
        expect(responsiveDropdownHeader.hide).toHaveBeenCalled();
      });

      it('should show on query success with more than 0 results', () => {
        root.trigger(QueryEvents.querySuccess, { results: FakeResults.createFakeResults() });
        expect(responsiveDropdownHeader.show).toHaveBeenCalled();
      });

      it('should hide on no results', () => {
        root.trigger(QueryEvents.noResults, { results: FakeResults.createFakeResults() });
        expect(responsiveDropdownHeader.hide).toHaveBeenCalled();
      });
    });

    describe('when it should switch to large mode', () => {
      it('returns false when needDropdownWrapper is called', () => {
        shouldSwitchToLargeMode();
        ResponsiveComponentsUtils.activateSmallFacet(root);
        expect(responsiveFacets.needDropdownWrapper()).toBe(false);
      });

      it('restores preserve position to true if it was originally true when handleResizeEvent is called', () => {
        shouldSwitchToSmallMode();
        responsiveFacets.handleResizeEvent();
        shouldSwitchToLargeMode();
        ResponsiveComponentsUtils.activateSmallFacet(root);
        responsiveFacets.handleResizeEvent();
        expect(facet.options.preservePosition).toBe(true);
      });

      it('restores preserve position to false if it was originally false when handleResizeEvent is called', () => {
        registerFacet(false);
        shouldSwitchToSmallMode();
        responsiveFacets.handleResizeEvent();
        shouldSwitchToLargeMode();
        ResponsiveComponentsUtils.activateSmallFacet(root);

        responsiveFacets.handleResizeEvent();

        expect(facet.options.preservePosition).toBe(false);
      });

      it('cleans up the dropdown when handleResizeEvent is called', () => {
        shouldSwitchToLargeMode();
        ResponsiveComponentsUtils.activateSmallFacet(root);

        responsiveFacets.handleResizeEvent();
        expect(responsiveDropdown.cleanUp).toHaveBeenCalled();
      });

      it('deactivates the small facets when handleResizeEvent is called', () => {
        spyOn(ResponsiveComponentsUtils, 'deactivateSmallFacet');
        shouldSwitchToLargeMode();
        ResponsiveComponentsUtils.activateSmallFacet(root);

        responsiveFacets.handleResizeEvent();

        expect(ResponsiveComponentsUtils.deactivateSmallFacet).toHaveBeenCalled();
      });
    });

    it('calls completelyDismissSearch on the registered facet when dismissFacetSearches is called', () => {
      spyOn(facet.facetSearch, 'completelyDismissSearch');
      responsiveFacets.dismissFacetSearches();
      expect(facet.facetSearch.completelyDismissSearch).toHaveBeenCalled();
    });

    it('should need the dropdown wrapper when the width is under the breakpoint specified', () => {
      let customResponsiveBreakpoint = 200;
      responsiveFacets = new ResponsiveFacets(root, '', { responsiveBreakpoint: customResponsiveBreakpoint }, responsiveDropdown);
      let spy = jasmine.createSpy('width').and.returnValue(customResponsiveBreakpoint - 1);
      root.width = <any>spy;

      expect(responsiveFacets.needDropdownWrapper()).toBe(true);
    });

    it('should not need the dropdown wrapper when the width is over the breakpoint specified', () => {
      let customResponsiveBreakpoint = 200;
      responsiveFacets = new ResponsiveFacets(root, '', { responsiveBreakpoint: customResponsiveBreakpoint }, responsiveDropdown);
      let spy = jasmine.createSpy('width').and.returnValue(customResponsiveBreakpoint + 1);
      root.width = <any>spy;

      expect(responsiveFacets.needDropdownWrapper()).toBe(false);
    });
  });
}
