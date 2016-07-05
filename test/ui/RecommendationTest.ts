/// <reference path="../Test.ts" />

module Coveo {

  describe('Recommendation', () => {
    let mainSearchInterface: Mock.IBasicComponentSetup<SearchInterface>;
    let test: Mock.IBasicComponentSetup<Recommendation>;
    let options: IRecommendationOptions;
    let actionsHistory = [1, 2, 3];
    let userId = '123';
    let store: CoveoAnalytics.HistoryStore;

    beforeEach(() => {
      mainSearchInterface = Mock.basicSearchInterfaceSetup(SearchInterface);
      options = {
        mainSearchInterface: mainSearchInterface.env.root,
        userContext: {
          user_id: userId
        }
      }
      store = {
        addElement: (query: IQuery) => { },
        getHistory: () => { return actionsHistory },
        setHistory: (history: any[]) => { },
        clear: () => { }
      }
      test = Mock.optionsSearchInterfaceSetup<Recommendation, IRecommendationOptions>(Recommendation, options)
      Mock.initPageViewScript(store);
    });

    afterEach(() => {
      mainSearchInterface = null;
      options = null;
      test = null;
      coveoanalytics = undefined;
    });

    it('should work if mainInterface is not specified', () => {
      let optionsWithNoMainInterface: IRecommendationOptions = {
        mainSearchInterface: null,
        userContext: {}
      }

      expect(() => {
        new Recommendation(document.createElement('div'), optionsWithNoMainInterface)
      }).not.toThrow();
    })

    it('should work if coveoanalytics is not specified', () => {
      coveoanalytics = undefined;
      test = Mock.optionsSearchInterfaceSetup<Recommendation, IRecommendationOptions>(Recommendation, options);
      let simulation = Simulate.query(test.env);
      expect(simulation.queryBuilder.actionsHistory).toEqual('[]');
    })

    it('should not modify the query if it was not triggered by the mainInterface', () => {
      let queryBuilder: QueryBuilder = new QueryBuilder();
      let query = 'test';
      queryBuilder.expression.add(query);
      let simulation = Simulate.query(test.env, {
        queryBuilder: queryBuilder
      });
      expect(simulation.queryBuilder.expression.build()).toEqual('test')
    })

    describe('when the mainInterface triggered a query', () => {

      it('should trigger a query', () => {
        let simulation = Simulate.query(mainSearchInterface.env);
        expect(test.cmp.queryController.executeQuery).toHaveBeenCalled();
      })

      it('should send the recommendation id', () => {
        test.cmp.options.id = 'test';
        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.recommendation).toEqual('test');
      })

      it('should modify the triggered query to match the mainInterface query', () => {
        let queryBuilder: QueryBuilder = new QueryBuilder();
        let query = 'test';
        queryBuilder.expression.add(query);

        Simulate.query(mainSearchInterface.env, {
          queryBuilder: queryBuilder
        });

        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.expression.build()).toEqual(query);
      })

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
      })

      it('should add the userContext in the triggered query', () => {
        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.context['user_id']).toEqual(userId);
      })

      it('should not add the userContext in the triggered query if userContext was not specified', () => {
        options = {
          mainSearchInterface: mainSearchInterface.env.root,
          userContext: {}
        }
        test = Mock.optionsSearchInterfaceSetup<Recommendation, IRecommendationOptions>(Recommendation, options)
        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.context).toBeUndefined();
      })

      it('should modify the results searchUid to match the main query', () => {
        let results = FakeResults.createFakeResults();
        let uid = '123';
        results.searchUid = uid;
        Simulate.query(mainSearchInterface.env, { results: results });
        let simulation = Simulate.query(test.env);
        expect(simulation.results.searchUid).toEqual(uid);
      })

      it('should not modify the results searchUid if linkSearchUid option is false', () => {
        options.linkSearchUid = false;
        test = Mock.optionsSearchInterfaceSetup<Recommendation, IRecommendationOptions>(Recommendation, options)

        let results = FakeResults.createFakeResults();
        let uid = '123';
        results.searchUid = uid;
        Simulate.query(mainSearchInterface.env, { results: results });
        let simulation = Simulate.query(test.env);
        expect(simulation.results.searchUid).not.toEqual(uid);
      })

      describe('exposes option sendActionHistory', () => {
        it('should add the actionsHistory in the triggered query', () => {
          let simulation = Simulate.query(test.env);
          expect(simulation.queryBuilder.actionsHistory).toEqual(JSON.stringify(actionsHistory));
        })

        it('should add the actionsHistory even if the user context is not specified', () => {
          options = {
            mainSearchInterface: mainSearchInterface.env.root,
            userContext: {}
          }
          test = Mock.optionsSearchInterfaceSetup<Recommendation, IRecommendationOptions>(Recommendation, options)
          let simulation = Simulate.query(test.env);
          expect(simulation.queryBuilder.actionsHistory).toEqual(JSON.stringify(actionsHistory));
        })

        it('should not send the actionsHistory if false', () => {
          options.sendActionsHistory = false;
          test = Mock.optionsSearchInterfaceSetup<Recommendation, IRecommendationOptions>(Recommendation, options)
          let simulation = Simulate.query(test.env);
          expect(simulation.queryBuilder.actionsHistory).toBeUndefined();
        })
      })

    })
  })
}
