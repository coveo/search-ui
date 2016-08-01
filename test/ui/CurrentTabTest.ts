import * as Mock from '../MockEnvironment';
import {CurrentTab} from '../../src/ui/CurrentTab/CurrentTab';
import {QueryStateModel} from '../../src/models/QueryStateModel';
import {$$} from '../../src/utils/Dom';
import {Tab} from '../../src/ui/Tab/Tab';

export function CurrentTabTest() {
  describe('CurrentTab', () => {
    var test: Mock.IBasicComponentSetup<CurrentTab>

    beforeEach(function () {
      test = Mock.basicComponentSetup<CurrentTab>(CurrentTab);
    });

    afterEach(function () {
      test = null;
    })

    it('is hidden when no tab is active', () => {
      test.env.queryStateModel.set(QueryStateModel.attributesEnum.t, undefined);
      expect($$(test.cmp.element).is(':visible')).toBe(false);
    })

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
    })

  })
}
