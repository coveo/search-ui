import * as Mock from '../MockEnvironment';
import {ResultLayout, IResultLayoutOptions} from '../../src/ui/ResultLayout/ResultLayout';

export function ResultLayoutTest() {
  describe('ResultLayout', () => {
    let test: Mock.IBasicComponentSetup<ResultLayout>;

    beforeEach(function () {
      test = Mock.basicComponentSetup<ResultLayout>(ResultLayout);
    });

    afterEach(function () {
      test = null;
    });

    it('exposes options', () => {
      it('defaultLayout, when valid, should set the currentLayout correctly', function () {
        const testLayouts = ['list', 'card', 'table'];
        _.each(testLayouts, layout => {
          test = Mock.optionsComponentSetup<ResultLayout, IResultLayoutOptions>(ResultLayout, {
            defaultLayout: layout
          })
          expect(test.cmp.getCurrentLayout()).toBe(layout);
        });
      })
      it('defaultLayout, when invalid, should default to the list layout', function () {
        test = Mock.optionsComponentSetup<ResultLayout, IResultLayoutOptions>(ResultLayout, {
          defaultLayout: 'upside-down'
        })
        expect(test.cmp.getCurrentLayout()).toBe('list');
      })
    })

    it('changeLayout should switch the layout when entering a valid layout', function () {
      test.cmp.changeLayout('card');
      expect(test.cmp.getCurrentLayout()).toBe('card');
    })

    it('changeLayout should throw an error when entering an invalid layout', function () {
      expect(() => test.cmp.changeLayout('pony-shaped')).toThrow();
    })
  })
}
