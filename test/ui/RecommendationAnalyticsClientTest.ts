/// <reference path="../Test.ts" />

module Coveo {
  describe('RecommendationAnalyticsClient', function () {
    let client: RecommendationAnalyticsClient;
    let recommendation: Mock.IBasicComponentSetup<Recommendation>
    let mainSearchInterface: Mock.IBasicComponentSetup<SearchInterface>
    let endpoint: AnalyticsEndpoint;
    let clickElement: HTMLElement;

    beforeEach(function () {
      endpoint = Mock.mock<AnalyticsEndpoint>(AnalyticsEndpoint);
      mainSearchInterface = Mock.basicSearchInterfaceSetup(SearchInterface);
      recommendation = Mock.optionsSearchInterfaceSetup<Recommendation, IRecommendationOptions>(Recommendation, { mainSearchInterface: mainSearchInterface.env.root });
      client = new RecommendationAnalyticsClient(endpoint, recommendation.env.root, 'foo', 'foo display', false, 'foo run name', 'foo run version', 'default', true, recommendation.cmp.getBindings());
      clickElement = document.createElement('div');
    })

    afterEach(function () {
      endpoint = null;
      mainSearchInterface = null;
      recommendation = null;
      client = null;
      clickElement = null;
    })

    it('should change a documentOpen event to recommendationOpen', function () {
      spyOn(client, 'pushClickEvent');
      client.logClickEvent(analyticsActionCauseList.documentOpen, {}, FakeResults.createFakeResult('foo'), clickElement);
      expect((<any>client).pushClickEvent).toHaveBeenCalledWith(analyticsActionCauseList.recommendationOpen, jasmine.any(Object), jasmine.any(Object), clickElement);
    })

    it('should log a second click on the main interface', function () {
      spyOn(mainSearchInterface.cmp.usageAnalytics, 'logClickEvent');
      recommendation.cmp.mainQuerySearchUID = '123'
      client.logClickEvent(analyticsActionCauseList.documentOpen, {}, FakeResults.createFakeResult('foo'), clickElement);
      expect(mainSearchInterface.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledWith(analyticsActionCauseList.recommendationOpen, jasmine.any(Object), jasmine.any(Object), clickElement);
    })

    it('should not log a second click on the main interface if there were no main interface query', function () {
      spyOn(mainSearchInterface.cmp.usageAnalytics, 'logClickEvent');
      client.logClickEvent(analyticsActionCauseList.documentOpen, {}, FakeResults.createFakeResult('foo'), clickElement);
      expect(mainSearchInterface.cmp.usageAnalytics.logClickEvent).not.toHaveBeenCalledWith(analyticsActionCauseList.recommendationOpen, jasmine.any(Object), jasmine.any(Object), clickElement);
    })
  })
}
