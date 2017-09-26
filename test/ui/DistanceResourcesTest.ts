import { Facet } from '../../src/ui/Facet/Facet';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import * as Mock from '../MockEnvironment';
import { IDistanceOptions, DistanceResources } from '../../src/ui/Distance/DistanceResources';
import { Simulate } from '../Simulate';
import { ISimulateQueryData } from '../Simulate';
import { QueryStateModel } from '../../src/models/QueryStateModel';
import { $$ } from '../../src/utils/Dom';
import {
  IPosition,
  DistanceEvents,
  IResolvingPositionEventArgs,
  IPositionProvider,
  IPositionResolvedEventArgs
} from '../../src/events/DistanceEvents';
import { InitializationEvents } from '../../src/EventsModules';
import { QueryEvents, IBuildingQueryEventArgs } from '../../src/events/QueryEvents';
import { IQueryFunction } from '../../src/rest/QueryFunction';

export function DistanceResourcesTest() {
  describe('DistanceResources', () => {
    const latitudeForANicePlace = 46.768005;
    const longitudeForANicePlace = -71.309405;
    const distanceField = 'distance';
    const latitudeField = 'latitude';
    const longitudeField = 'longitude';
    const defaultUnitConversionFactor = 1000;
    const disabledComponentsClass = 'bloupbloup';
    const aNicePlace: IPosition = { lat: latitudeForANicePlace, long: longitudeForANicePlace };

    const aValidPositionProvider: IPositionProvider = {
      getPosition: () => Promise.resolve(aNicePlace)
    };
    const badPositionProvider: IPositionProvider = {
      getPosition: () => Promise.reject("Wow I'm so bad")
    };

    function triggerOnBuildingQuery() {
      $$(test.env.root).trigger(QueryEvents.buildingQuery, buildingQueryArgs);
    }

    let buildingQueryArgs;
    let test: Mock.IBasicComponentSetup<DistanceResources>;

    beforeEach(() => {
      buildingQueryArgs = <IBuildingQueryEventArgs>{
        cancel: false,
        queryBuilder: new QueryBuilder(),
        searchAsYouType: false
      };
      test = Mock.optionsComponentSetup<DistanceResources, IDistanceOptions>(DistanceResources, <IDistanceOptions>{
        distanceField: distanceField,
        latitudeField: latitudeField,
        longitudeField: longitudeField,
        unitConversionFactor: defaultUnitConversionFactor,
        disabledDistanceCssClass: disabledComponentsClass
      });
    });

    afterEach(() => {
      test = null;
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

      expect(buildingQueryArgs.queryBuilder.queryFunctions).toContain(<IQueryFunction>{
        function: `dist(${latitudeField}, ${longitudeField}, ${latitudeForANicePlace}, ${longitudeForANicePlace})/${defaultUnitConversionFactor}`,
        fieldName: distanceField
      });
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
      const anotherProviderThatShouldNotBeUsed: IPositionProvider = {
        getPosition: () => Promise.resolve({ lat: 0, long: 0 })
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
