import { Facet } from '../../src/ui/Facet/Facet';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import * as Mock from '../MockEnvironment';
import { IDistanceOptions, DistanceResources } from '../../src/ui/Distance/DistanceResources';
import { $$ } from '../../src/utils/Dom';
import {
  IGeolocationPosition,
  DistanceEvents,
  IResolvingPositionEventArgs,
  IGeolocationPositionProvider,
  IPositionResolvedEventArgs
} from '../../src/events/DistanceEvents';
import { InitializationEvents } from '../../src/EventsModules';
import { QueryEvents, IBuildingQueryEventArgs } from '../../src/events/QueryEvents';
import { IQueryFunction } from '../../src/rest/QueryFunction';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';

export function DistanceResourcesTest() {
  describe('DistanceResources', () => {
    const latitudeForANicePlace = 46.768005;
    const longitudeForANicePlace = -71.309405;
    const distanceField = 'distance';
    const latitudeField = 'latitude';
    const longitudeField = 'longitude';
    const defaultUnitConversionFactor = 1000;
    const disabledComponentsClass = 'bloupbloup';
    const aNicePlace = <IGeolocationPosition>{ latitude: latitudeForANicePlace, longitude: longitudeForANicePlace };
    const expectedQueryFunctionForANicePlace = <IQueryFunction>{
      function: `dist(${latitudeField}, ${longitudeField}, ${latitudeForANicePlace}, ${longitudeForANicePlace})/${
        defaultUnitConversionFactor
      }`,
      fieldName: distanceField
    };

    const aValidPositionProvider: IGeolocationPositionProvider = {
      getPosition: () => Promise.resolve(aNicePlace)
    };
    const badPositionProvider: IGeolocationPositionProvider = {
      getPosition: () => Promise.reject(`Wow I'm so bad`)
    };

    function triggerOnBuildingQuery() {
      $$(test.env.root).trigger(QueryEvents.buildingQuery, buildingQueryArgs);
    }

    let buildingQueryArgs: IBuildingQueryEventArgs;
    let defaultMockOptions: IDistanceOptions;
    let test: Mock.IBasicComponentSetup<DistanceResources>;

    beforeEach(() => {
      buildingQueryArgs = <IBuildingQueryEventArgs>{
        cancel: false,
        queryBuilder: new QueryBuilder(),
        searchAsYouType: false
      };
      defaultMockOptions = <IDistanceOptions>{
        distanceField: distanceField,
        latitudeField: latitudeField,
        longitudeField: longitudeField,
        unitConversionFactor: defaultUnitConversionFactor,
        disabledDistanceCssClass: disabledComponentsClass,
        googleApiKey: '',
        latitudeValue: 0,
        longitudeValue: 0,
        useNavigator: false,
        triggerNewQueryOnNewPosition: false,
        cancelQueryUntilPositionResolved: false
      };
      test = Mock.optionsComponentSetup<DistanceResources, IDistanceOptions>(DistanceResources, defaultMockOptions);
    });

    afterEach(() => {
      test = null;
    });

    describe('when the cancelQuery option is set', () => {
      beforeEach(() => {
        defaultMockOptions.cancelQueryUntilPositionResolved = true;
        test = Mock.optionsComponentSetup<DistanceResources, IDistanceOptions>(DistanceResources, defaultMockOptions);
      });

      it('should cancel the query when the position is not set', () => {
        triggerOnBuildingQuery();

        expect(buildingQueryArgs.cancel).toBe(true);
      });

      it('should trigger a query the first time the position is resolved', () => {
        test.cmp.setPosition(latitudeForANicePlace, longitudeForANicePlace);
        test.cmp.setPosition(1.1, 2.3);

        expect(test.env.queryController.executeQuery).toHaveBeenCalledTimes(1);
      });

      it('should add a new query function with the given position after the position is set', () => {
        test.cmp.setPosition(latitudeForANicePlace, longitudeForANicePlace);

        triggerOnBuildingQuery();

        expect(buildingQueryArgs.queryBuilder.queryFunctions).toContain(expectedQueryFunctionForANicePlace);
      });

      describe('with usage analytics', () => {
        let fakePendingSearchEvent;

        beforeEach(() => {
          fakePendingSearchEvent = {};
          fakePendingSearchEvent.templateSearchEvent = {
            actionCause: 'foo',
            actionType: 'bar'
          };
          fakePendingSearchEvent.getEventMeta = () => ({ baz: 'buzz' });
        });

        afterEach(() => {
          fakePendingSearchEvent = null;
        });

        it('should send the event associated with the blocked query', () => {
          const spy = jasmine.createSpy('getPendingSearchEvent').and.returnValue(fakePendingSearchEvent);
          test.env.usageAnalytics.getPendingSearchEvent = <any>spy;
          triggerOnBuildingQuery();
          test.cmp.setPosition(latitudeForANicePlace, longitudeForANicePlace);

          expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
            jasmine.objectContaining({
              type: fakePendingSearchEvent.templateSearchEvent.actionType,
              name: fakePendingSearchEvent.templateSearchEvent.actionCause
            }),
            jasmine.objectContaining({
              baz: 'buzz'
            })
          );
        });

        it('should send basic event if there are none sent before the blocked query', () => {
          triggerOnBuildingQuery();
          test.cmp.setPosition(latitudeForANicePlace, longitudeForANicePlace);

          expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.positionSet, jasmine.any(Object));
        });
      });
    });

    describe('when the triggerNewQuery option is set', () => {
      beforeEach(() => {
        defaultMockOptions.triggerNewQueryOnNewPosition = true;
        test = Mock.optionsComponentSetup<DistanceResources, IDistanceOptions>(DistanceResources, defaultMockOptions);
      });

      it('should trigger one query per setPosition', () => {
        test.cmp.setPosition(latitudeForANicePlace, longitudeForANicePlace);

        expect(test.env.queryController.executeQuery).toHaveBeenCalled();

        test.cmp.setPosition(latitudeForANicePlace, longitudeForANicePlace);

        expect(test.env.queryController.executeQuery).toHaveBeenCalledTimes(2);
      });
    });

    it('should trigger onPositionResolved event with the new position when setting a position', () => {
      let spy = jasmine.createSpy('spy');
      $$(test.env.element).on(DistanceEvents.onPositionResolved, spy);

      test.cmp.setPosition(latitudeForANicePlace, longitudeForANicePlace);

      expect(spy).toHaveBeenCalledWith(jasmine.any(Object), <IPositionResolvedEventArgs>{
        position: aNicePlace
      });
    });

    it('should add a new query function with the given position', () => {
      test.cmp.setPosition(latitudeForANicePlace, longitudeForANicePlace);

      triggerOnBuildingQuery();

      expect(buildingQueryArgs.queryBuilder.queryFunctions).toContain(expectedQueryFunctionForANicePlace);
    });

    it('should reactivate disabled distance components', () => {
      const hiddenComponent = document.createElement('div');
      hiddenComponent.classList.add(disabledComponentsClass);
      test.env.root.appendChild(hiddenComponent);

      test.cmp.setPosition(latitudeForANicePlace, longitudeForANicePlace);

      triggerOnBuildingQuery();

      expect(hiddenComponent.classList.contains(disabledComponentsClass)).toBe(false);
    });

    it('should reactivate disabled distance Coveo components', () => {
      const hiddenFacet = Mock.basicComponentSetup<Facet>(Facet);
      hiddenFacet.cmp.element.classList.add(disabledComponentsClass);
      hiddenFacet.cmp.disable();
      expect(hiddenFacet.cmp.disabled).toBe(true);
      test.env.root.appendChild(hiddenFacet.cmp.element);

      test.cmp.setPosition(latitudeForANicePlace, longitudeForANicePlace);

      triggerOnBuildingQuery();

      expect(hiddenFacet.cmp.element.classList.contains(disabledComponentsClass)).toBe(false);
      expect(hiddenFacet.cmp.disabled).toBe(false);
    });

    describe('when a position provider is registered', () => {
      beforeEach(() => {
        $$(test.env.element).on(DistanceEvents.onResolvingPosition, (event, args: IResolvingPositionEventArgs) => {
          args.providers.push(aValidPositionProvider);
        });
      });

      it('should trigger onPositionResolved event with the resolved position', done => {
        let spy = jasmine.createSpy('onPositionResolved');
        $$(test.env.element).on(DistanceEvents.onPositionResolved, spy);

        $$(test.env.root).trigger(InitializationEvents.afterComponentsInitialization);

        test.cmp.getLastPositionRequest().then(() => {
          expect(spy).toHaveBeenCalledWith(jasmine.any(Object), <IPositionResolvedEventArgs>{
            position: aNicePlace
          });
          done();
        });
      });
    });

    describe('when two position providers are registered', () => {
      const anotherProviderThatShouldNotBeUsed: IGeolocationPositionProvider = {
        getPosition: () => Promise.resolve(<IGeolocationPosition>{ latitude: 0, longitude: 0 })
      };

      beforeEach(() => {
        $$(test.env.element).on(DistanceEvents.onResolvingPosition, (event, args: IResolvingPositionEventArgs) => {
          args.providers.push(aValidPositionProvider);
          args.providers.push(anotherProviderThatShouldNotBeUsed);
        });
      });

      it('should use the position from the first provider', done => {
        let spy = jasmine.createSpy('onPositionResolved');
        $$(test.env.element).on(DistanceEvents.onPositionResolved, spy);

        $$(test.env.root).trigger(InitializationEvents.afterComponentsInitialization);

        test.cmp.getLastPositionRequest().then(() => {
          expect(spy).toHaveBeenCalledWith(jasmine.any(Object), <IPositionResolvedEventArgs>{
            position: aNicePlace
          });
          done();
        });
      });
    });

    describe('when a bad position provider is registered', () => {
      beforeEach(() => {
        $$(test.env.element).on(DistanceEvents.onResolvingPosition, (event, args: IResolvingPositionEventArgs) => {
          args.providers.push(badPositionProvider);
        });
      });

      it('should trigger onPositionNotResolved event', done => {
        let spy = jasmine.createSpy('onPositionNotResolved');
        $$(test.env.element).on(DistanceEvents.onPositionNotResolved, spy);

        $$(test.env.root).trigger(InitializationEvents.afterComponentsInitialization);

        test.cmp.getLastPositionRequest().then(() => {
          expect(spy).toHaveBeenCalled();
          done();
        });
      });

      it('should re-trigger a query when no position resolves and the cancelQueryUntilPositionResolved option is set', done => {
        test.cmp.options.cancelQueryUntilPositionResolved = true;
        $$(test.env.root).trigger(InitializationEvents.afterComponentsInitialization);
        triggerOnBuildingQuery();
        test.cmp.getLastPositionRequest().then(() => {
          expect(test.cmp.queryController.executeQuery).toHaveBeenCalledTimes(1);
          done();
        });
      });

      it('should disable the component when no position resolves', done => {
        test.cmp.options.cancelQueryUntilPositionResolved = true;
        $$(test.env.root).trigger(InitializationEvents.afterComponentsInitialization);
        triggerOnBuildingQuery();
        test.cmp.getLastPositionRequest().then(() => {
          expect(test.cmp.disabled).toBe(true);
          done();
        });
      });
    });

    it('should trigger onPositionNotResolved event when no position provided', done => {
      let spy = jasmine.createSpy('onPositionNotResolved');
      $$(test.env.element).on(DistanceEvents.onPositionNotResolved, spy);

      $$(test.env.root).trigger(InitializationEvents.afterComponentsInitialization);

      test.cmp.getLastPositionRequest().then(() => {
        expect(spy).toHaveBeenCalled();
        done();
      });
    });
  });
}
