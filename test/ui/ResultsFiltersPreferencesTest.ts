import * as Mock from '../MockEnvironment';
import { ResultsFiltersPreferences } from '../../src/ui/ResultsFiltersPreferences/ResultsFiltersPreferences';
import { $$ } from '../../src/utils/Dom';
import { PreferencesPanel } from '../../src/ui/PreferencesPanel/PreferencesPanel';
import { Simulate } from '../Simulate';
import { BreadcrumbEvents, IBreadcrumbItem } from '../../src/events/BreadcrumbEvents';

export function ResultsFiltersPreferencesTest() {
  describe('ResultsFiltersPreferences', () => {
    let test: Mock.IBasicComponentSetup<ResultsFiltersPreferences>;
    let testPreferencesPanel: Mock.IBasicComponentSetup<PreferencesPanel>;

    beforeEach(() => {
      testPreferencesPanel = Mock.basicComponentSetup<PreferencesPanel>(PreferencesPanel);
      test = Mock.advancedComponentSetup<ResultsFiltersPreferences>(
        ResultsFiltersPreferences,
        new Mock.AdvancedComponentSetupOptions(undefined, undefined, env => {
          return env.withElement(testPreferencesPanel.cmp.element);
        })
      );
    });

    afterEach(() => {
      test = null;
    });

    it('should allow to createDom', () => {
      test.cmp.createDom();
      expect(test.cmp.container).not.toBeNull();
    });

    it('should allow to save', () => {
      test.cmp.createDom();
      expect(() => test.cmp.save()).not.toThrow();
    });

    describe('with a predetermined filter', () => {
      beforeEach(() => {
        test = Mock.advancedComponentSetup<ResultsFiltersPreferences>(
          ResultsFiltersPreferences,
          new Mock.AdvancedComponentSetupOptions(
            undefined,
            {
              filters: { 'Test filter': { expression: 'test expression' } }
            },
            env => {
              return env.withElement(testPreferencesPanel.cmp.element);
            }
          )
        );
      });

      it('should allow to create the filter', () => {
        expect(() => test.cmp.createDom()).not.toThrow();
      });

      it('should log an analytics event when a filter is selected', () => {
        test.cmp.createDom();

        let choiceInput = $$(test.cmp.element).find('input');
        $$(choiceInput).trigger('change');
        expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalled();
      });

      it('should trigger a query when a filter is selected', () => {
        test.cmp.createDom();

        let choiceInput = $$(test.cmp.element).find('input');
        $$(choiceInput).trigger('change');
        expect(test.env.queryController.executeQuery).toHaveBeenCalled();
      });

      it('should add the needed filter when the query is executed', () => {
        test.cmp.createDom();
        let choiceInput = $$(test.cmp.element).find('input');
        (<HTMLInputElement>choiceInput).checked = true;
        $$(choiceInput).trigger('change');

        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().aq).toBe('test expression');
      });

      it('should populate breadcrumb when a filter is active', () => {
        test.cmp.createDom();
        let choiceInput = $$(test.cmp.element).find('input');
        (<HTMLInputElement>choiceInput).checked = true;
        $$(choiceInput).trigger('change');
        let breadcrumbItems: IBreadcrumbItem[] = [];
        $$(test.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, { breadcrumbs: breadcrumbItems });
        expect($$(breadcrumbItems[0].element).text()).toContain('Test filter');
      });

      it('should validate and save on form submit', () => {
        test.cmp.createDom();
        let form = $$(test.cmp.element).find('form');
        expect(() => $$(form).trigger('submit')).not.toThrow();
      });
    });
  });
}
