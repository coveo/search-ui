/// <reference path="../../lib/jasmine/index.d.ts" />
import * as Mock from '../MockEnvironment';
import { SearchInterface } from '../../src/ui/SearchInterface/SearchInterface';
import { Recommendation } from '../../src/ui/Recommendation/Recommendation';
import { IRecommendationOptions } from '../../src/ui/Recommendation/Recommendation';
import { Simulate } from '../Simulate';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { FakeResults } from '../Fake';
import _ = require('underscore');

export function RecommendationTest() {
  describe('Recommendation', () => {
    let mainSearchInterface: Mock.IBasicComponentSetup<SearchInterface>;
    let test: Mock.IBasicComponentSetup<Recommendation>;
    let options: IRecommendationOptions;
    let actionsHistory = [1, 2, 3];
    let userId = '123';
    let store: CoveoAnalytics.HistoryStore;

    const isHidden = (test: Mock.IBasicComponentSetup<Recommendation>): boolean => {
      return test.cmp.element.classList.contains('coveo-hidden');
    };

    beforeEach(() => {
      mainSearchInterface = Mock.basicSearchInterfaceSetup(SearchInterface);
      options = {
        mainSearchInterface: mainSearchInterface.env.root,
        userContext: {
          user_id: userId
        }
      };
      store = Simulate.analyticsStoreModule(actionsHistory);
      test = Mock.optionsSearchInterfaceSetup<Recommendation, IRecommendationOptions>(Recommendation, options);
      test.cmp.historyStore = store;
    });

    afterEach(() => {
      mainSearchInterface = null;
      options = null;
      test = null;
      window['coveoanalytics'] = undefined;
    });

    it('should work if mainInterface is not specified', () => {
      let optionsWithNoMainInterface: IRecommendationOptions = {
        mainSearchInterface: null
      };

      expect(() => {
        new Recommendation(document.createElement('div'), optionsWithNoMainInterface);
      }).not.toThrow();
    });

    it('should not modify the query if it was not triggered by the mainInterface', () => {
      let queryBuilder: QueryBuilder = new QueryBuilder();
      let query = 'test';
      queryBuilder.expression.add(query);
      let simulation = Simulate.query(test.env, {
        queryBuilder: queryBuilder
      });
      expect(simulation.queryBuilder.expression.build()).toEqual('test');
    });

    it('should generate a different id by default for each recommendation component', () => {
      let secondRecommendation = Mock.basicSearchInterfaceSetup<Recommendation>(Recommendation);
      expect(test.cmp.options.id).not.toEqual(secondRecommendation.cmp.options.id);
    });

    it('should copy component options model when bound to a main search interface', () => {
      expect(mainSearchInterface.cmp.componentOptionsModel.getAttributes).toHaveBeenCalled();
      mainSearchInterface.cmp.componentOptionsModel.setMultiple({ resultLink: { alwaysOpenInNewWindow: true } });
      expect(mainSearchInterface.cmp.componentOptionsModel.getAttributes).toHaveBeenCalled();
    });

    describe('when the mainInterface triggered a query', () => {
      it('should trigger a query', () => {
        Simulate.query(mainSearchInterface.env);
        expect(test.cmp.queryController.executeQuery).toHaveBeenCalled();
      });

      it('should send the recommendation id', () => {
        test.cmp.options.id = 'test';
        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.recommendation).toEqual('test');
      });

      it('should not send the recommendation id if disabled', () => {
        test.cmp.options.id = 'test';
        test.cmp.disable();
        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.recommendation).not.toEqual('test');
      });

      it('should only copy the optionsToUse', () => {
        _.extend(options, { optionsToUse: ['expression'] });
        test = Mock.optionsSearchInterfaceSetup<Recommendation, IRecommendationOptions>(Recommendation, options);

        let queryBuilder: QueryBuilder = new QueryBuilder();
        let query = 'test';
        let advandcedQuery = '@field=test';
        queryBuilder.expression.add(query);
        queryBuilder.advancedExpression.add(advandcedQuery);

        Simulate.query(mainSearchInterface.env, {
          queryBuilder: queryBuilder
        });

        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.expression).toEqual(queryBuilder.expression);
        expect(simulation.queryBuilder.advancedExpression).not.toEqual(queryBuilder.advancedExpression);
      });

      it('should add the userContext in the triggered query', () => {
        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.context['user_id']).toEqual(userId);
      });

      it('should not add the userContext in the triggered query if disabled', () => {
        test.cmp.disable();
        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.context).toBeUndefined();
      });

      it('should not add the userContext in the triggered query if userContext was not specified', () => {
        options = {
          mainSearchInterface: mainSearchInterface.env.root
        };
        test = Mock.optionsSearchInterfaceSetup<Recommendation, IRecommendationOptions>(Recommendation, options);
        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.context).toBeUndefined();
      });

      it('should hide if the main interface has a query error', () => {
        Simulate.queryError(mainSearchInterface.env);
        expect(isHidden(test)).toBeTruthy();
      });

      describe('exposes option hideIfNoResults', () => {
        it('should hide the interface if there are no recommendations and the option is true', () => {
          options.hideIfNoResults = true;
          test = Mock.optionsSearchInterfaceSetup<Recommendation, IRecommendationOptions>(Recommendation, options);
          Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });
          expect(isHidden(test)).toBeTruthy();
        });

        it('should not hide the interface if there are no recommendations and the option is false', () => {
          options.hideIfNoResults = false;
          test = Mock.optionsSearchInterfaceSetup<Recommendation, IRecommendationOptions>(Recommendation, options);
          Simulate.query(test.env, { results: FakeResults.createFakeResults(0) });
          expect(isHidden(test)).toBeFalsy();
        });

        it('should show the interface if there are recommendations', () => {
          Simulate.query(test.env);
          expect(test.cmp.element.style.display).not.toEqual('none');
        });
      });

      it('exposes option autoTriggerQuery that should be set to false if there is a main search interface', () => {
        expect(options.mainSearchInterface).toBeDefined();
        options.autoTriggerQuery = true;
        test = Mock.optionsSearchInterfaceSetup<Recommendation, IRecommendationOptions>(Recommendation, options);
        expect(test.cmp.options.autoTriggerQuery).toBe(false);
      });

      it('exposes options autoTriggerQuery that should be left as it is if there is no main search interface', () => {
        options.mainSearchInterface = null;
        options.autoTriggerQuery = true;
        test = Mock.optionsSearchInterfaceSetup<Recommendation, IRecommendationOptions>(Recommendation, options);
        expect(test.cmp.options.autoTriggerQuery).toBe(true);
      });

      it('should hide on query error', () => {
        Simulate.query(test.env, { error: { message: 'oh noes', type: 'bad', name: 'foobar' } });
        expect(isHidden(test)).toBeTruthy();
      });

      it('should not be stuck in hide mode if hide is called multiple time', () => {
        test.cmp.hide();
        test.cmp.hide();
        expect(isHidden(test)).toBeTruthy();
        test.cmp.show();
        expect(isHidden(test)).toBeFalsy();
      });

      it('should not be stuck in visible mode if show is called multiple time', () => {
        test.cmp.show();
        test.cmp.show();
        expect(isHidden(test)).toBeFalsy();
        test.cmp.hide();
        expect(isHidden(test)).toBeTruthy();
      });

      it('should hide on being disabled', () => {
        test.cmp.show();
        expect(isHidden(test)).toBeFalsy();
        test.cmp.disable();
        expect(isHidden(test)).toBeTruthy();
      });

      it('should show on being enabled', () => {
        test.cmp.hide();
        expect(isHidden(test)).toBeTruthy();
        test.cmp.enable();
        expect(isHidden(test)).toBeFalsy();
      });
    });
  });
}
