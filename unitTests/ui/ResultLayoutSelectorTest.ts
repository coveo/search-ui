import { ResultLayoutSelector } from '../../src/ui/ResultLayoutSelector/ResultLayoutSelector';
import { ValidLayout } from '../../src/ui/ResultLayoutSelector/ValidLayout';
import * as Mock from '../MockEnvironment';
import { $$ } from '../../src/utils/Dom';
import { ResultLayoutEvents, IResultLayoutPopulateArgs } from '../../src/events/ResultLayoutEvents';
import { InitializationEvents } from '../../src/events/InitializationEvents';

export function ResultLayoutSelectorTest() {
  describe('ResultLayoutSelector', () => {
    let test: Mock.IBasicComponentSetup<ResultLayoutSelector>;

    function handleLayoutsPopulation(rootElement: HTMLElement) {
      $$(rootElement).on(ResultLayoutEvents.populateResultLayout, (e, args: IResultLayoutPopulateArgs) => {
        args.layouts.push(...ResultLayoutSelector.validLayouts);
      });
    }

    function triggerRootEvent(event: string) {
      $$(test.env.root).trigger(event);
    }

    function buildResultLayoutSelector(activeLayout: ValidLayout) {
      test = Mock.advancedComponentSetup<ResultLayoutSelector>(ResultLayoutSelector, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: builder => {
          handleLayoutsPopulation(builder.root);
          (builder.queryStateModel.get as jasmine.Spy).and.returnValue(activeLayout);
          return builder;
        }
      });
      triggerRootEvent(InitializationEvents.afterComponentsInitialization);
      triggerRootEvent(InitializationEvents.afterInitialization);
    }

    function getLayoutButton(layout: ValidLayout) {
      return test.cmp['currentActiveLayouts'][layout].button.el;
    }

    it('if the list layout is selected, should give the pressed state to the list button', () => {
      buildResultLayoutSelector('list');
      expect(getLayoutButton('list').getAttribute('aria-pressed')).toEqual('true');
    });

    it("if the card layout is selected, shouldn't give the pressed state to the list button", () => {
      buildResultLayoutSelector('card');
      expect(getLayoutButton('list').getAttribute('aria-pressed')).toEqual('false');
    });

    it(`when the current layout is disabled and then renabled (e.g. due to resizing the screen smaller then larger),
    the original layout is restored`, () => {
      buildResultLayoutSelector('list');

      test.cmp.disableLayouts(['list']);
      test.cmp.enableLayouts(['list']);

      expect(test.cmp.currentLayout).toBe('list');
    });

    it(`when the current layout is disabled, changed, and then renabled, the original layout is not restored`, () => {
      buildResultLayoutSelector('list');

      test.cmp.disableLayouts(['list']);
      test.cmp.changeLayout('card');
      test.cmp.enableLayouts(['list']);

      expect(test.cmp.currentLayout).toBe('card');
    });
  });
}
