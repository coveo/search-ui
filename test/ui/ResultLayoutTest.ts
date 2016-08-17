import * as Mock from '../MockEnvironment';
import {ResultLayout} from '../../src/ui/ResultLayout/ResultLayout';
import {ResultLayoutEvents} from '../../src/events/ResultLayoutEvents';
import {$$} from '../../src/utils/Dom';

export function ResultLayoutTest() {
  describe('ResultLayout', () => {
    let test: Mock.IBasicComponentSetup<ResultLayout>;

    beforeEach(function () {
      test = Mock.basicComponentSetup<ResultLayout>(ResultLayout);
    });

    afterEach(function () {
      test = null;
    });

    describe('with "card" and "list" layouts available', () => {
      beforeEach(() => {
        test = Mock.advancedComponentSetup<ResultLayout>(ResultLayout, <Mock.AdvancedComponentSetupOptions>{
          modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
            $$(builder.root).on(ResultLayoutEvents.resultLayoutPopulate, (e, args) => {
              args.layouts.push('card');
              args.layouts.push('list');
            });
            return builder;
          }
        });
      });

      it('changeLayout should switch the layout when entering a valid and available layout', function () {
        test.cmp.changeLayout('card');
        expect(test.cmp.getCurrentLayout()).toBe('card');
      });

      it('changeLayout should throw an error when switching to a valid but unavailable layout', function () {
        expect(() => test.cmp.changeLayout('table')).toThrow();
      });
    });

    it('changeLayout should not throw an error when having only one layout and switching to it', function () {
      test = Mock.advancedComponentSetup<ResultLayout>(ResultLayout, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
          $$(builder.root).on(ResultLayoutEvents.resultLayoutPopulate, (e, args) => {
            args.layouts.push('table');
          });
          return builder;
        }
      });
      expect(() => test.cmp.changeLayout('table')).not.toThrow();
    });

    it('should throw an error when being populated with invalid result layout names', function () {
      expect(() => Mock.advancedComponentSetup<ResultLayout>(ResultLayout, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
          $$(builder.root).on(ResultLayoutEvents.resultLayoutPopulate, (e, args) => {
            args.layouts.push('star-shaped');
          });
          return builder;
        }
      })).toThrowError(/Invalid layout/);
    });

    it('changeLayout should throw an error when entering an invalid layout', function () {
      expect(() => test.cmp.changeLayout('pony-shaped')).toThrow();
    });

    it('hides when there are less than 2 layouts available', function () {
      test = Mock.advancedComponentSetup<ResultLayout>(ResultLayout, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
          $$(builder.root).on(ResultLayoutEvents.resultLayoutPopulate, (e, args) => {
            args.layouts.push('list');
          });
          return builder;
        }
      });
      expect(test.cmp.element.classList).toContain('coveo-result-layout-hidden');
    });

    it('does not hide when there are 2 layouts or more available', function () {
      test = Mock.advancedComponentSetup<ResultLayout>(ResultLayout, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
          $$(builder.root).on(ResultLayoutEvents.resultLayoutPopulate, (e, args) => {
            args.layouts.push('list');
            args.layouts.push('card');
            args.layouts.push('table');
          });
          return builder;
        }
      });
      expect(test.cmp.element.classList).not.toContain('coveo-result-layout-hidden');
    });

    it('hides its parent `result-layout-section` instead of itself if it is present', function () {
      let parentSection = $$('div', { className: 'coveo-result-layout-section' });
      test = Mock.advancedComponentSetup<ResultLayout>(ResultLayout, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
          $$(builder.root).on(ResultLayoutEvents.resultLayoutPopulate, (e, args) => {
            args.layouts.push('list');
          });
          parentSection.append(builder.element);
          return builder;
        }
      });
      expect(parentSection.el.classList).toContain('coveo-result-layout-hidden');
      expect(test.cmp.element.classList).not.toContain('coveo-result-layout-hidden');
    });
  });
}
