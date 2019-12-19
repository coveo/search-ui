import { QueryForCommerce, IQueryForCommerceOptions } from '../../src/ui/QueryForCommerce/QueryForCommerce';
import * as Mock from '../MockEnvironment';
import { Simulate } from '../Simulate';
import { AnalyticsEvents, $$ } from '../../src/Core';
import { IChangeableAnalyticsDataObject, IChangeAnalyticsCustomDataEventArgs } from '../../src/events/AnalyticsEvents';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';

export function QueryForCommerceTest() {
  describe('QueryForCommerce', function() {
    let test: Mock.IBasicComponentSetup<QueryForCommerce>;

    const originalAnalyticsDataObject: IChangeableAnalyticsDataObject = {
      language: 'en',
      originLevel1: 'default',
      originLevel2: 'All',
      originLevel3: 'localhost:8080',
      metaObject: {}
    };

    describe('with a listing value', () => {
      beforeEach(function() {
        test = Mock.optionsComponentSetup<QueryForCommerce, IQueryForCommerceOptions>(QueryForCommerce, <IQueryForCommerceOptions>{
          listing: 'foobar'
        });
      });

      it('should update tab in query builder to the listing option', function() {
        const simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().tab).toBe(test.cmp.options.listing);
      });

      it('should add a context value with the listing option', function() {
        const simulation = Simulate.query(test.env);

        expect(simulation.queryBuilder.build().context).toEqual(
          jasmine.objectContaining({
            listing: test.cmp.options.listing
          })
        );
      });

      it('should update analytics originlevel2 to the listing value', function() {
        const args: IChangeAnalyticsCustomDataEventArgs = {
          type: 'SearchEvent',
          actionType: analyticsActionCauseList.interfaceLoad.type,
          actionCause: analyticsActionCauseList.interfaceLoad.name,
          ...originalAnalyticsDataObject
        };
        $$(test.env.root).trigger(AnalyticsEvents.changeAnalyticsCustomData, args);

        expect(args['originLevel2']).toBe(test.cmp.options.listing);
      });

      it('should unset tab after resetting the listing value', function() {
        test.cmp.options.listing = null;
        const simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().tab).toBeFalsy();
      });

      it('should unset the context after reset listing to null', function() {
        test.cmp.options.listing = null;
        const simulation = Simulate.query(test.env);

        expect(simulation.queryBuilder.build().context).toBeFalsy();
      });

      it('should leave originlevel2 untouched after reset listing to null', function() {
        const args: IChangeAnalyticsCustomDataEventArgs = {
          type: 'SearchEvent',
          actionType: analyticsActionCauseList.interfaceLoad.type,
          actionCause: analyticsActionCauseList.interfaceLoad.name,
          ...originalAnalyticsDataObject
        };
        test.cmp.options.listing = null;

        $$(test.env.root).trigger(AnalyticsEvents.changeAnalyticsCustomData, args);

        expect(args['originLevel2']).toBe(originalAnalyticsDataObject.originLevel2);
      });
    });
  });
}
