import * as Mock from '../MockEnvironment';
import { MissingTermManager } from '../../src/ui/MissingTerm/MissingTermManager';
import { Simulate } from '../Simulate';
import { $$ } from '../Test';

export function MissingTermsManagerTest() {
  describe('MissingTermManager', () => {
    let env: Mock.IMockEnvironment;
    let arrayGet: Array<string>;
    const spyGet = () => {
      return arrayGet;
    };
    const spySet = (key: any, values: any) => {
      arrayGet = values;
    };
    const populateBreadcrumb = () => {
      const missingTerm = 'is';
      arrayGet.push(missingTerm);
      return Simulate.breadcrumb(env);
    };

    beforeEach(() => {
      env = new Mock.MockEnvironmentBuilder().build();
      new MissingTermManager(env.root, env.queryStateModel, env.queryController);
      env.queryStateModel.get = jasmine.createSpy('missingTermSpy').and.callFake(spyGet);
      env.queryStateModel.set = jasmine.createSpy('missingTermSpy').and.callFake(spySet);
      arrayGet = [];
    });

    it('add missing term from the url in advance query', () => {
      const missingTerm = 'is';
      arrayGet.push(missingTerm);
      const query = Simulate.query(env, {
        query: {
          q: 'this is my query'
        }
      });
      expect(query.queryBuilder.advancedExpression.build()).toBe(missingTerm);
    });

    describe('the breadcrumb', () => {
      it('should populate when the event is triggered', () => {
        const breadcrumb = populateBreadcrumb();
        expect(breadcrumb.length).toBe(1);
        expect($$(breadcrumb[0].element).find('.coveo-missing-term-breadcrumb-title').innerHTML).toBe('Missing Term:');
        expect($$(breadcrumb[0].element).find('.coveo-missing-term-breadcrumb-caption').innerHTML).toBe('is');
      });

      it('should empty when the event is triggered', () => {
        populateBreadcrumb();
        expect(arrayGet).not.toEqual([]);
        Simulate.clearBreadcrumb(env);
        expect(arrayGet).toEqual([]);
      });

      it('should remove an element when it is clicked', () => {
        arrayGet.push('this');
        const breadcrumb = populateBreadcrumb();
        const element = $$(breadcrumb[0].element).find('.coveo-missing-term-breadcrumb-clear');
        element.click();
        expect(arrayGet).toEqual(['is']);
      });
    });
  });
}
