/// <reference path="../Test.ts" />

module Coveo {

  describe('RecommendationQuery', () => {

    it('should be able to modify the advanced query based on its content', () => {
      let script = $$('script');
      script.text('@sysfiletype="youtube"');
      let test = Mock.advancedComponentSetup<RecommendationQuery>(RecommendationQuery, new Mock.AdvancedComponentSetupOptions(script.el));
      let simulation = Simulate.query(test.env);
      expect(simulation.queryBuilder.advancedExpression.build()).toBe('@sysfiletype="youtube"')
    })

    it('should not modify the query if it is not a script', () => {
      let div = $$('div');
      div.text('@sysfiletype="youtube"');
      let test = Mock.advancedComponentSetup<RecommendationQuery>(RecommendationQuery, new Mock.AdvancedComponentSetupOptions(div.el));
      let simulation = Simulate.query(test.env);
      expect(simulation.queryBuilder.advancedExpression.build()).not.toBe('@sysfiletype="youtube"')
    })

  })
}
