import * as Mock from '../MockEnvironment';
import { MissingTermManager } from '../../src/ui/MissingTerm/MissingTermManager';
import { Simulate } from '../Simulate';
import { $$, l } from '../Test';

export function MissingTermsManagerTest() {
  describe('MissingTermManager', () => {
    let env: Mock.IMockEnvironment;
    let missingTerms: string[];

    const spyGet = () => {
      return missingTerms;
    };
    const spySet = (key: any, values: any) => {
      missingTerms = values;
    };
    const populateBreadcrumb = () => {
      return Simulate.breadcrumb(env);
    };

    beforeEach(() => {
      env = new Mock.MockEnvironmentBuilder().build();
      new MissingTermManager(env.root, env.queryStateModel, env.queryController);
      env.queryStateModel.get = jasmine.createSpy('missingTermSpy').and.callFake(spyGet);
      env.queryStateModel.set = jasmine.createSpy('missingTermSpy').and.callFake(spySet);
      missingTerms = [];
    });

    it('add missing term from the url in advance query', () => {
      const aMissingTerm = 'is';
      missingTerms.push(aMissingTerm);
      const simulation = Simulate.query(env, {
        query: {
          q: 'this is my query'
        }
      });
      expect(simulation.queryBuilder.advancedExpression.build()).toBe(aMissingTerm);
    });

    describe('the breadcrumb', () => {
      it('should populate when the event is triggered', () => {
        const aMissingTerm = 'is';
        missingTerms.push(aMissingTerm);
        const breadcrumb = populateBreadcrumb();
        expect(breadcrumb.length).toBe(1);
        expect($$(breadcrumb[0].element).find('.coveo-missing-term-breadcrumb-title').innerHTML).toBe(l('MustContain'));
        expect($$(breadcrumb[0].element).find('.coveo-missing-term-breadcrumb-caption').innerHTML).toBe(aMissingTerm);
      });

      it('should empty when the event is triggered', () => {
        missingTerms.push('is');
        populateBreadcrumb();
        expect(missingTerms).not.toEqual([]);
        Simulate.clearBreadcrumb(env);
        expect(missingTerms).toEqual([]);
      });

      it('should remove an element when it is clicked', () => {
        missingTerms.push('is');
        missingTerms.push('this');
        const breadcrumb = populateBreadcrumb();
        const element = $$(breadcrumb[0].element).find('.coveo-missing-term-breadcrumb-clear');
        expect(missingTerms.length).toBe(2);
        element.click();
        expect(missingTerms.length).toBe(1);
      });
    });
  });
}
