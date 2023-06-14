import { FacetColumnAutoLayoutAdjustment } from '../../src/ui/SearchInterface/FacetColumnAutoLayoutAdjustment';
import { $$, Dom, QueryEvents } from '../Test';
export function FacetColumnAutoLayoutAdjustmentTest() {
  describe('FacetColumnAutoLayoutAdjustment', () => {
    const getAutoLayoutAdjustableComponent = () => {
      const spy = jasmine.createSpy('spy');
      const component = {
        isCurrentlyDisplayed: spy
      };
      return {
        component,
        spy
      };
    };

    it('should correctly tell if an object function is autoLayoutAdjustable', () => {
      expect(FacetColumnAutoLayoutAdjustment.isAutoLayoutAdjustable(getAutoLayoutAdjustableComponent().component)).toBeTruthy();
    });

    it('should correctly tell if an object function is not autoLayoutAdjustable', () => {
      const { component } = getAutoLayoutAdjustableComponent();
      delete component.isCurrentlyDisplayed;
      expect(FacetColumnAutoLayoutAdjustment.isAutoLayoutAdjustable(component)).toBeFalsy();
    });

    it('should allow to register a single root element with mulitple components', () => {
      const root = $$('div');
      const { component } = getAutoLayoutAdjustableComponent();
      const { component: component2 } = getAutoLayoutAdjustableComponent();
      FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root.el, component);
      FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root.el, component2);

      expect(FacetColumnAutoLayoutAdjustment.autoLayoutAdjustmentComponent.get(root.el)).toEqual(
        jasmine.arrayContaining([component, component2])
      );
    });

    it('should allow to register multiple root element with multiple components', () => {
      const root = $$('div');
      const root2 = $$('div');
      const { component } = getAutoLayoutAdjustableComponent();
      const { component: component2 } = getAutoLayoutAdjustableComponent();

      FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root.el, component);
      FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root2.el, component);

      FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root.el, component2);
      FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root2.el, component2);

      expect(FacetColumnAutoLayoutAdjustment.autoLayoutAdjustmentComponent.get(root.el)).toEqual(
        jasmine.arrayContaining([component, component2])
      );
      expect(FacetColumnAutoLayoutAdjustment.autoLayoutAdjustmentComponent.get(root2.el)).toEqual(
        jasmine.arrayContaining([component, component2])
      );
    });

    describe('with a facet column', () => {
      let root: Dom;
      let column: Dom;
      let dropDownHeader: Dom;

      const isHidden = () => {
        return $$(root).hasClass('coveo-no-visible-facet');
      };

      beforeEach(() => {
        root = $$('div');
        column = $$('div', { className: 'coveo-facet-column' });
        dropDownHeader = $$('div', { className: 'coveo-facet-dropdown-header' });
        root.append(column.el);
        root.append(dropDownHeader.el);
      });

      it('should show the facet column if the component is currently displayed on a deferred query success', () => {
        const { component } = getAutoLayoutAdjustableComponent();
        component.isCurrentlyDisplayed.and.returnValue(true);

        FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root.el, component);
        $$(root).trigger(QueryEvents.deferredQuerySuccess);
        expect(component.isCurrentlyDisplayed).toHaveBeenCalled();
        expect(isHidden()).toBeFalsy();
      });

      it('should hide the facet column if the component is not currently displayed on a deferred query success', () => {
        const { component } = getAutoLayoutAdjustableComponent();
        component.isCurrentlyDisplayed.and.returnValue(false);

        FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root.el, component);
        $$(root).trigger(QueryEvents.deferredQuerySuccess);
        expect(isHidden()).toBeTruthy();
      });

      describe('with a custom element inside the facet column with a hidden component', () => {
        let customElement: Dom;
        let component;
        beforeEach(() => {
          customElement = $$('div');
          column.append(customElement.el);
          component = getAutoLayoutAdjustableComponent().component;
          component.isCurrentlyDisplayed.and.returnValue(false);
        });

        it('should not hide the facet column', () => {
          FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root.el, component);
          $$(root).trigger(QueryEvents.deferredQuerySuccess);
          expect(isHidden()).toBeFalsy();
        });

        it('should hide the facet column if the customElement is not displayed', () => {
          customElement.el.style.display = 'none';
          FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root.el, component);
          $$(root).trigger(QueryEvents.deferredQuerySuccess);
          expect(isHidden()).toBeTruthy();
        });

        it('should hide the facet column if the customElement is not visible', () => {
          customElement.el.style.visibility = 'hidden';
          FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root.el, component);
          $$(root).trigger(QueryEvents.deferredQuerySuccess);
          expect(isHidden()).toBeTruthy();
        });

        it('should hide the facet column if the customElement is disabled by a tab', () => {
          customElement.el.className = 'coveo-tab-disabled';
          FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root.el, component);
          $$(root).trigger(QueryEvents.deferredQuerySuccess);
          expect(isHidden()).toBeTruthy();
        });
      });

      describe('with non component elements inside the facet column that should be ignored', () => {
        let customElement: Dom;
        let component;

        beforeEach(() => {
          customElement = $$('div');
          column.append(customElement.el);
          component = getAutoLayoutAdjustableComponent().component;
          component.isCurrentlyDisplayed.and.returnValue(false);
        });

        it("should hide the facet column if it contains only an element with 'coveo-facet-header-filter-by-container'", () => {
          customElement.addClass('coveo-facet-header-filter-by-container');
          FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root.el, component);
          $$(root).trigger(QueryEvents.deferredQuerySuccess);
          expect(isHidden()).toBeTruthy();
        });

        it("should hide the facet column if it contains only an element with 'coveo-topSpace'", () => {
          customElement.addClass('coveo-topSpace');
          FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root.el, component);
          $$(root).trigger(QueryEvents.deferredQuerySuccess);
          expect(isHidden()).toBeTruthy();
        });

        it("should hide the facet column if it contains only an element with 'coveo-bottomSpace'", () => {
          customElement.addClass('coveo-bottomSpace');
          FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root.el, component);
          $$(root).trigger(QueryEvents.deferredQuerySuccess);
          expect(isHidden()).toBeTruthy();
        });
      });

      it('should not hide the facet column if there is multiple component and some are currentlyDisplayed and some are not currentlyDisplayed', () => {
        const { component } = getAutoLayoutAdjustableComponent();
        component.isCurrentlyDisplayed.and.returnValue(false);

        const { component: component2 } = getAutoLayoutAdjustableComponent();
        component2.isCurrentlyDisplayed.and.returnValue(true);

        FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root.el, component);
        FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root.el, component2);
        $$(root).trigger(QueryEvents.deferredQuerySuccess);
        expect(isHidden()).toBeFalsy();
      });

      it("should hide and show if the component changes it's currently displayed property", () => {
        const { component } = getAutoLayoutAdjustableComponent();
        component.isCurrentlyDisplayed.and.returnValue(false);
        FacetColumnAutoLayoutAdjustment.initializeAutoLayoutAdjustment(root.el, component);

        $$(root).trigger(QueryEvents.deferredQuerySuccess);
        expect(isHidden()).toBeTruthy();

        component.isCurrentlyDisplayed.and.returnValue(true);
        $$(root).trigger(QueryEvents.deferredQuerySuccess);
        expect(isHidden()).toBeFalsy();
      });
    });
  });
}
