import * as Mock from '../MockEnvironment';
import { CurrentTab } from '../../src/ui/CurrentTab/CurrentTab';
import { QueryStateModel } from '../../src/models/QueryStateModel';
import { $$ } from '../../src/utils/Dom';
import { Tab } from '../../src/ui/Tab/Tab';
import { Assert } from '../../src/misc/Assert';

export function CurrentTabTest() {
  describe('CurrentTab', () => {
    var test: Mock.IBasicComponentSetup<CurrentTab>;

    beforeEach(function () {
      test = Mock.basicComponentSetup<CurrentTab>(CurrentTab);
    });

    afterEach(function () {
      test = null;
    });

    it('is hidden when no tab is active', () => {
      test.env.queryStateModel.set(QueryStateModel.attributesEnum.t, undefined);
      expect($$(test.cmp.element).is(':visible')).toBe(false);
    });

    it('displays the caption of the current tab when it changes', () => {
      let root = $$('div').el;
      let model = new QueryStateModel(root);
      let tab1 = Mock.advancedComponentSetup<Tab>(Tab, new Mock.AdvancedComponentSetupOptions(undefined, { id: 'first', caption: 'First' }, (builder) => {
        return builder.withRoot(root).withQueryStateModel(model);
      }));
      let tab2 = Mock.advancedComponentSetup<Tab>(Tab, new Mock.AdvancedComponentSetupOptions(undefined, { id: 'second', caption: 'Second' }, (builder) => {
        return builder.withRoot(root).withQueryStateModel(model);
      }));
      let test = Mock.advancedComponentSetup<CurrentTab>(CurrentTab, new Mock.AdvancedComponentSetupOptions(undefined, undefined, (builder) => {
        return builder.withRoot(root).withQueryStateModel(model);
      }));

      tab1.cmp.select();
      expect($$(test.cmp.element).text()).toEqual('First');
      tab2.cmp.select();
      expect($$(test.cmp.element).text()).toEqual('Second');
    });

    it('does not explode when a tab section to open is defined and no element has class coveo-glass', () => {
      let tabSection = $$('div', { className: 'tabSection' });
      let root = $$('div');
      root.append(tabSection.el);

      let model = new QueryStateModel(root.el);
      Mock.advancedComponentSetup<Tab>(Tab, new Mock.AdvancedComponentSetupOptions(undefined, { id: 'first', caption: 'First' }, (builder) => {
        return builder.withRoot(root.el).withQueryStateModel(model);
      }));

      test = Mock.advancedComponentSetup<CurrentTab>(CurrentTab, new Mock.AdvancedComponentSetupOptions(undefined, { tabSectionToOpen: '.tabSection' }, (builder) => {
        return builder.withRoot(root.el).withQueryStateModel(model);
      }));

      spyOn(Assert, 'failureHandler').and.callThrough;
      test.cmp.element.click();

      expect(Assert.failureHandler).not.toHaveBeenCalled();
    });
  });
}
