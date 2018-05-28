import { Component } from '../../src/ui/Base/Component';
import { ResultLink } from '../../src/ui/ResultLink/ResultLink';
import { DefaultRecommendationTemplate } from '../../src/ui/Templates/DefaultRecommendationTemplate';
import { $$ } from '../../src/utils/Dom';

export function DefaultRecommendationTemplateTest() {
  describe('DefaultRecommendationTemplate', () => {
    it('should not crash on instantiate to string', () => {
      expect(() => new DefaultRecommendationTemplate().instantiateToString()).not.toThrowError();
    });

    it('should create an element with at least a result link', done => {
      new DefaultRecommendationTemplate().instantiateToElement().then(created => {
        expect($$(created).find(`.${Component.computeCssClassName(ResultLink)}`)).not.toBeNull();
        done();
      });
    });
  });
}
