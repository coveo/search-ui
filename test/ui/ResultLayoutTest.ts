import * as Mock from '../MockEnvironment';
import { ResultLayout } from '../../src/ui/ResultLayout/ResultLayout';
import { ResultLayoutEvents } from '../../src/events/ResultLayoutEvents';
import { QueryEvents, IQuerySuccessEventArgs } from '../../src/events/QueryEvents';
import { InitializationEvents } from '../../src/events/InitializationEvents';
import { IResultLayoutPopulateArgs } from '../../src/events/ResultLayoutEvents';
import { FakeResults } from '../Fake';
import { QueryStateModel } from '../../src/models/QueryStateModel';
import { $$ } from '../../src/utils/Dom';

export function ResultLayoutTest() {
  describe('ResultLayout', () => {
    let test: Mock.IBasicComponentSetup<ResultLayout>;

    beforeEach(() => {
      test = Mock.basicComponentSetup<ResultLayout>(ResultLayout);
    });

    afterEach(() => {
      test = null;
    });

    describe('with duplicate result layouts', () => {
      const addResultLayouts = (layouts: string[]) => {
        const root = $$('div');
        root.on(ResultLayoutEvents.populateResultLayout, (e, args: IResultLayoutPopulateArgs) => (args.layouts = layouts));

        test = Mock.advancedComponentSetup<ResultLayout>(ResultLayout, <Mock.AdvancedComponentSetupOptions>{
          modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
            builder.withRoot(root.el);
            return builder;
          }
        });
      };

      it('removes duplicates having the same case', () => {
        addResultLayouts(['list', 'list']);
        $$(test.env.root).trigger(InitializationEvents.afterComponentsInitialization);

        const activeLayouts = test.cmp.activeLayouts;
        const noOfActiveLayouts = Object.keys(activeLayouts).length;
        expect(noOfActiveLayouts).toEqual(1);
      });

      it('removes duplicates having different cases', () => {
        addResultLayouts(['table', 'Table']);
        $$(test.env.root).trigger(InitializationEvents.afterComponentsInitialization);

        const activeLayouts = test.cmp.activeLayouts;
        const noOfActiveLayouts = Object.keys(activeLayouts).length;
        expect(noOfActiveLayouts).toEqual(1);
      });
    });

    describe('with "card" and "list" layouts available', () => {
      beforeEach(() => {
        test = Mock.advancedComponentSetup<ResultLayout>(ResultLayout, <Mock.AdvancedComponentSetupOptions>{
          modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
            $$(builder.root).on(ResultLayoutEvents.populateResultLayout, (e, args) => {
              args.layouts.push('card');
              args.layouts.push('list');
            });
            return builder;
          }
        });
        $$(test.env.root).trigger(InitializationEvents.afterComponentsInitialization);
      });

      it('hides on querySuccess when there are 0 results and the page is resized', () => {
        const root = $$(test.cmp.root);
        let spy = jasmine.createSpy('hideSpy');
        test.cmp['hide'] = spy;
        root.width = () => 400;

        $$(test.env.root).trigger(QueryEvents.querySuccess, <IQuerySuccessEventArgs>{
          results: FakeResults.createFakeResults(0)
        });
        expect(spy).toHaveBeenCalled();
      });

      it('changeLayout should switch the layout when entering a valid and available layout', () => {
        test.cmp.changeLayout('card');
        expect(test.cmp.getCurrentLayout()).toBe('card');
      });

      it('changeLayout should throw an error when switching to a valid but unavailable layout', () => {
        expect(() => test.cmp.changeLayout('table')).toThrow();
      });

      it('should put tabindex=0 on each of the layout buttons', () => {
        const children = test.cmp.element.children;
        for (let i = 0; i < children.length; ++i) {
          expect(children[i].getAttribute('tabindex')).toBe('0');
        }
      });

      it('hides on querySuccess when there are 0 results', () => {
        let spy = jasmine.createSpy('hideSpy');
        test.cmp['hide'] = spy;
        $$(test.env.root).trigger(QueryEvents.querySuccess, <IQuerySuccessEventArgs>{
          results: FakeResults.createFakeResults(0)
        });
        expect(spy).toHaveBeenCalled();
      });

      it('show after it has been hidden when there are more than 0 results', () => {
        const spyShow = jasmine.createSpy('showSpy');
        const spyHide = jasmine.createSpy('hideSpy');
        test.cmp['hide'] = spyHide;
        test.cmp['show'] = spyShow;
        $$(test.env.root).trigger(QueryEvents.querySuccess, <IQuerySuccessEventArgs>{
          results: FakeResults.createFakeResults(0)
        });
        expect(spyHide).toHaveBeenCalled();
        $$(test.env.root).trigger(QueryEvents.querySuccess, <IQuerySuccessEventArgs>{
          results: FakeResults.createFakeResults(10)
        });
        expect(spyShow).toHaveBeenCalled();
      });

      it('shows on querySuccess when there are results', () => {
        let spy = jasmine.createSpy('showSpy');
        test.cmp['show'] = spy;
        $$(test.env.root).trigger(QueryEvents.querySuccess, <IQuerySuccessEventArgs>{
          results: FakeResults.createFakeResults(3)
        });
        expect(spy).toHaveBeenCalled();
      });

      describe('with live queryStateModel', () => {
        beforeEach(() => {
          test = Mock.advancedComponentSetup<ResultLayout>(ResultLayout, <Mock.AdvancedComponentSetupOptions>{
            modifyBuilder: builder => {
              builder.withLiveQueryStateModel();
              $$(builder.root).on(ResultLayoutEvents.populateResultLayout, (e, args) => {
                args.layouts.push('list');
                args.layouts.push('card');
              });
              return builder;
            }
          });
          $$(test.env.root).trigger(InitializationEvents.afterComponentsInitialization);
        });

        it('calls changeLayout with the new value on queryStateChanged if it is available', () => {
          test.env.queryStateModel.set(QueryStateModel.attributesEnum.layout, 'card');
          expect(test.cmp.getCurrentLayout()).toBe('card');
        });

        it('calls changeLayout with its first layout if no value is provided', () => {
          test.env.queryStateModel.set(QueryStateModel.attributesEnum.layout, 'list');
          test.env.queryStateModel.set(QueryStateModel.attributesEnum.layout, '');
          expect(test.cmp.getCurrentLayout()).toBe('list');
        });

        it('calls changeLayout with its first layout if an invalid value is provided', () => {
          test.env.queryStateModel.set(QueryStateModel.attributesEnum.layout, 'list');
          test.env.queryStateModel.set(QueryStateModel.attributesEnum.layout, 'Emacs <3');
          expect(test.cmp.getCurrentLayout()).toBe('list');
        });
      });
    });

    it('changeLayout should not throw an error when having only one layout and switching to it', () => {
      test = Mock.advancedComponentSetup<ResultLayout>(ResultLayout, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
          $$(builder.root).on(ResultLayoutEvents.populateResultLayout, (e, args) => {
            args.layouts.push('table');
          });
          return builder;
        }
      });
      $$(test.env.root).trigger(InitializationEvents.afterComponentsInitialization);
      expect(() => test.cmp.changeLayout('table')).not.toThrow();
    });

    it('should throw an error when being populated with invalid result layout names', () => {
      test = Mock.advancedComponentSetup<ResultLayout>(ResultLayout, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
          $$(builder.root).on(ResultLayoutEvents.populateResultLayout, (e, args) => {
            args.layouts.push('star-shaped');
          });
          return builder;
        }
      });
      expect(() => test.cmp['populate']()).toThrowError(/Invalid layout/);
    });

    it('changeLayout should throw an error at runtime when entering an invalid layout', () => {
      expect(() => test.cmp.changeLayout.call(test.cmp, 'pony-shaped')).toThrow();
    });

    it('hides when there are less than 2 layouts available', () => {
      test = Mock.advancedComponentSetup<ResultLayout>(ResultLayout, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
          $$(builder.root).on(ResultLayoutEvents.populateResultLayout, (e, args) => {
            args.layouts.push('list');
          });
          return builder;
        }
      });
      $$(test.env.root).trigger(InitializationEvents.afterComponentsInitialization);
      expect(test.cmp.element.classList).toContain('coveo-result-layout-hidden');
    });

    it('does not hide when there are 2 layouts or more available', () => {
      test = Mock.advancedComponentSetup<ResultLayout>(ResultLayout, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
          $$(builder.root).on(ResultLayoutEvents.populateResultLayout, (e, args) => {
            args.layouts.push('list');
            args.layouts.push('card');
            args.layouts.push('table');
          });
          return builder;
        }
      });
      $$(test.env.root).trigger(InitializationEvents.afterComponentsInitialization);
      expect(test.cmp.element.classList).not.toContain('coveo-result-layout-hidden');
    });

    it('hides its parent `result-layout-section` instead of itself if it is present', () => {
      let parentSection = $$('div', { className: 'coveo-result-layout-section' });
      test = Mock.advancedComponentSetup<ResultLayout>(ResultLayout, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
          $$(builder.root).on(ResultLayoutEvents.populateResultLayout, (e, args) => {
            args.layouts.push('list');
          });
          parentSection.append(builder.element);
          return builder;
        }
      });
      $$(test.env.root).trigger(InitializationEvents.afterComponentsInitialization);
      expect(parentSection.el.classList).toContain('coveo-result-layout-hidden');
      expect(test.cmp.element.classList).not.toContain('coveo-result-layout-hidden');
    });

    it('hides on queryError', () => {
      let hideSpy = jasmine.createSpy('hideSpy');
      test.cmp['hide'] = hideSpy;
      $$(test.env.root).trigger(QueryEvents.queryError, {});
      expect(hideSpy).toHaveBeenCalled();
    });
  });
}
