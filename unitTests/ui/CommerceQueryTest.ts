import { CommerceQuery, ICommerceQueryOptions } from '../../src/ui/CommerceQuery/CommerceQuery';
import * as Mock from '../MockEnvironment';
import { Simulate } from '../Simulate';
import { AnalyticsEvents, $$ } from '../../src/Core';
import { IChangeableAnalyticsDataObject, IChangeAnalyticsCustomDataEventArgs } from '../../src/events/AnalyticsEvents';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';

export function CommerceQueryTest() {
  describe('CommerceQuery', () => {
    let test: Mock.IBasicComponentSetup<CommerceQuery>;

    describe('with a listing value', () => {
      beforeEach(() => {
        test = Mock.optionsComponentSetup<CommerceQuery, ICommerceQueryOptions>(CommerceQuery, <ICommerceQueryOptions>{
          listing: 'foobar'
        });
      });

      it('should update tab in query builder to the listing option', () => {
        const simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().tab).toBe(test.cmp.options.listing);
      });

      it('should add a context value with the listing option', () => {
        const simulation = Simulate.query(test.env);

        expect(simulation.queryBuilder.build().context['listing']).toEqual(test.cmp.options.listing);
      });

      it('should update the tab in query suggest to the lisitng option', () => {
        const simulation = Simulate.querySuggest(test.env, 'abc');

        expect(simulation.buildingQuerySuggestArgs.payload.tab).toEqual(test.cmp.options.listing);
      });

      it('should add a context value to query suggest with the lisitng option', () => {
        const simulation = Simulate.querySuggest(test.env, 'abc');

        expect(simulation.buildingQuerySuggestArgs.payload.context['listing']).toEqual(test.cmp.options.listing);
      });

      it('should unset tab after resetting the listing value', () => {
        test.cmp.options.listing = null;
        const simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().tab).toBeFalsy();
      });

      it('should unset the context after reset listing to null', () => {
        test.cmp.options.listing = null;
        const simulation = Simulate.query(test.env);

        expect(simulation.queryBuilder.build().context).toBeFalsy();
      });

      describe('analytics behaviour', () => {
        const originalAnalyticsDataObject: IChangeableAnalyticsDataObject = {
          language: 'en',
          originLevel1: 'default',
          originLevel2: 'All',
          originLevel3: 'localhost:8080',
          metaObject: {}
        };

        function buildEventArgs(): IChangeAnalyticsCustomDataEventArgs {
          return <IChangeAnalyticsCustomDataEventArgs>{
            type: 'SearchEvent',
            actionType: analyticsActionCauseList.interfaceLoad.type,
            actionCause: analyticsActionCauseList.interfaceLoad.name,
            ...originalAnalyticsDataObject
          };
        }

        it('should update analytics originlevel2 to the listing value', () => {
          const args = buildEventArgs();

          $$(test.env.root).trigger(AnalyticsEvents.changeAnalyticsCustomData, args);

          expect(args['originLevel2']).toBe(test.cmp.options.listing);
        });

        it('should leave originlevel2 untouched after reset listing to null', () => {
          const args = buildEventArgs();
          test.cmp.options.listing = null;

          $$(test.env.root).trigger(AnalyticsEvents.changeAnalyticsCustomData, args);

          expect(args['originLevel2']).toBe(originalAnalyticsDataObject.originLevel2);
        });
      });
    });
  });
}
