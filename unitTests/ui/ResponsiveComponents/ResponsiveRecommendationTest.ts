import { ResponsiveRecommendation } from '../../../src/ui/ResponsiveComponents/ResponsiveRecommendation';
import { Component } from '../../../src/ui/Base/Component';
import { Recommendation } from '../../../src/ui/Recommendation/Recommendation';
import { ResponsiveComponentsUtils } from '../../../src/ui/ResponsiveComponents/ResponsiveComponentsUtils';
import { ResponsiveDropdown } from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdown';
import { ResponsiveDropdownHeader } from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdownHeader';
import { ResponsiveDropdownContent } from '../../../src/ui/ResponsiveComponents/ResponsiveDropdown/ResponsiveDropdownContent';
import { ResponsiveComponentsManager } from '../../../src/ui/ResponsiveComponents/ResponsiveComponentsManager';
import { $$, Dom } from '../../../src/utils/Dom';
import { QueryEvents } from '../../../src/events/QueryEvents';
import { mockComponent } from '../../MockEnvironment';
import { FakeResults } from '../../Fake';

export function ResponsiveRecommendationTest() {
  describe('ResponsiveRecommendation', () => {
    let dropdownHeaderClassName = 'dropdown-header';
    let smallWidth: number;
    let largeWidth: number;
    let root: Dom;
    let responsiveRecommendation: ResponsiveRecommendation;
    let responsiveDropdown: ResponsiveDropdown;
    let responsiveDropdownHeader: ResponsiveDropdownHeader;
    let responsiveDropdownContent: ResponsiveDropdownContent;
    let recommendation: Recommendation;

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
      root.append($$('div', { className: Component.computeCssClassName(Recommendation) }).el);
      root.append($$('div', { className: ResponsiveComponentsManager.DROPDOWN_HEADER_WRAPPER_CSS_CLASS }).el);
      recommendation = mockComponent<Recommendation>(Recommendation);
      recommendation.options = { hideIfNoResults: true };
      root.find(`.${Component.computeCssClassName(Recommendation)}`)['CoveoSearchInterface'] = recommendation;
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
      smallWidth = ResponsiveRecommendation.RESPONSIVE_BREAKPOINT - 1;
      largeWidth = ResponsiveRecommendation.RESPONSIVE_BREAKPOINT + 1;
      responsiveRecommendation = new ResponsiveRecommendation(root, '', { dropdownHeaderLabel: 'label' }, responsiveDropdown);
    });

    it('calls position dropdown when handleResizeEvent is called if the dropdown is opened', () => {
      responsiveDropdown.isOpened = true;
      responsiveRecommendation.handleResizeEvent();
      expect(responsiveDropdownContent.positionDropdown).toHaveBeenCalled();
    });

    describe('when it should switch to small mode', () => {
      it('returns true when needDropdownWrapper is called', () => {
        shouldSwitchToSmallMode();
        expect(responsiveRecommendation.needDropdownWrapper()).toBe(true);
      });

      it('closes dropdown when handleResizeEvent is called', () => {
        shouldSwitchToSmallMode();
        responsiveRecommendation.handleResizeEvent();
        expect(responsiveDropdown.close).toHaveBeenCalled();
      });

      it('appends the dropdown header when handleResizeEvent is called', () => {
        shouldSwitchToSmallMode();
        responsiveRecommendation.handleResizeEvent();
        expect(root.find(`.${dropdownHeaderClassName}`)).not.toBeNull();
      });

      it('activates small recommendation when handleResizeEvent is called', () => {
        spyOn(ResponsiveComponentsUtils, 'activateSmallRecommendation');

        responsiveRecommendation.coveoRoot.removeClass('coveo-small-recommendation');
        shouldSwitchToSmallMode();
        responsiveRecommendation.handleResizeEvent();
        expect(ResponsiveComponentsUtils.activateSmallRecommendation).toHaveBeenCalledTimes(2);
      });

      it('should hide on query error', () => {
        root.trigger(QueryEvents.queryError);
        expect(responsiveDropdownHeader.hide).toHaveBeenCalled();
      });

      it('should show on query success with 1 or more results', () => {
        root.trigger(QueryEvents.querySuccess, { results: FakeResults.createFakeResults() });
        expect(responsiveDropdownHeader.show).toHaveBeenCalled();
      });

      it('should hide on query success with 0 results', () => {
        root.trigger(QueryEvents.querySuccess, { results: FakeResults.createFakeResults(0) });
        expect(responsiveDropdownHeader.hide).toHaveBeenCalled();
      });

      it('should hide on no results', () => {
        root.trigger(QueryEvents.noResults);
        expect(responsiveDropdownHeader.hide).toHaveBeenCalled();
      });
    });

    describe('when it should switch to large mode', () => {
      it('return false when neeDropdownWrapper is called', () => {
        shouldSwitchToLargeMode();
        ResponsiveComponentsUtils.activateSmallRecommendation(root);

        expect(responsiveRecommendation.needDropdownWrapper()).toBe(false);
      });

      it('cleans up the dropdown when handleResizeEvent is called', () => {
        shouldSwitchToLargeMode();
        ResponsiveComponentsUtils.activateSmallRecommendation(root);

        responsiveRecommendation.handleResizeEvent();
        expect(responsiveDropdown.cleanUp).toHaveBeenCalled();
      });

      it('deactivates small recommendation when handleResizeEvent is called', () => {
        spyOn(ResponsiveComponentsUtils, 'deactivateSmallRecommendation');
        shouldSwitchToLargeMode();
        ResponsiveComponentsUtils.activateSmallRecommendation(root);

        responsiveRecommendation.handleResizeEvent();

        expect(ResponsiveComponentsUtils.deactivateSmallRecommendation).toHaveBeenCalledTimes(2);
      });
    });
  });
}
