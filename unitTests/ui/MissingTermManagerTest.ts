import * as Mock from '../MockEnvironment';
import { MissingTermManager } from '../../src/ui/MissingTerm/MissingTermManager';
import { Simulate } from '../Simulate';
import { $$, l } from '../Test';
import { NoopAnalyticsClient } from '../../src/ui/Analytics/NoopAnalyticsClient';
import { IMissingTermManagerArgs } from '../../src/ui/SearchInterface/SearchInterface';
import { escape } from 'underscore';

export function MissingTermsManagerTest() {
  describe('MissingTermManager', () => {
    let env: Mock.IMockEnvironment;
    const usageAnalytics = new NoopAnalyticsClient();

    const getMissingTerms = () => {
      return [...env.queryStateModel.get('missingTerms')];
    };

    const setMissingTerms = (term: string) => {
      const missingterm = [...env.queryStateModel.get('missingTerms')];
      missingterm.push(term);
      env.queryStateModel.set('missingTerms', missingterm);
    };

    const populateBreadcrumb = () => {
      return Simulate.breadcrumb(env);
    };

    beforeEach(() => {
      env = new Mock.MockEnvironmentBuilder().withLiveQueryStateModel().build();
      const MissingTermManagerArgs: IMissingTermManagerArgs = {
        element: env.root,
        queryStateModel: env.queryStateModel,
        queryController: env.queryController,
        usageAnalytics: usageAnalytics
      };
      new MissingTermManager(MissingTermManagerArgs);
    });

    it('add missing term from the url in advance query', () => {
      const aMissingTerm = 'is';
      setMissingTerms(aMissingTerm);
      const simulation = Simulate.query(env, {
        query: {
          q: 'this is my query'
        }
      });
      expect(simulation.queryBuilder.advancedExpression.build()).toBe(aMissingTerm);
    });

    it(`when the query change,
    if the missing term is no longer in the query,
    it is removed from the missing term`, () => {
      const aMissingTerm = 'is';
      setMissingTerms(aMissingTerm);
      env.queryStateModel.set('q', 'this my query');
      expect(getMissingTerms().length).toBe(0);
    });

    it(`when the query change,
    if the missing term is still present in the query,
    it stay in missing term`, () => {
      const aMissingTerm = 'is';
      setMissingTerms(aMissingTerm);
      env.queryStateModel.set('q', 'this is my super query');
      expect(getMissingTerms().length).toBe(1);
    });

    describe('the breadcrumb', () => {
      it('should populate when the event is triggered', () => {
        const aMissingTerm = 'is';
        setMissingTerms(aMissingTerm);
        const breadcrumb = populateBreadcrumb();
        expect(breadcrumb.length).toBe(1);
        expect($$(breadcrumb[0].element).find('.coveo-missing-term-breadcrumb-title').innerHTML).toBe(l('MustContain'));
        expect($$(breadcrumb[0].element).find('.coveo-missing-term-breadcrumb-caption').innerHTML).toBe(aMissingTerm);
      });

      it('should escape content', () => {
        const unEscaped = `<script>1+1</script>`;
        setMissingTerms(unEscaped);
        const breadcrumb = populateBreadcrumb();
        expect(breadcrumb.length).toBe(1);
        expect($$(breadcrumb[0].element).find('.coveo-missing-term-breadcrumb-title').innerHTML).toBe(l('MustContain'));
        expect($$(breadcrumb[0].element).find('.coveo-missing-term-breadcrumb-caption').innerHTML).toBe(escape(unEscaped));
      });

      it('should empty when the event is triggered', () => {
        const aMissingTerm = 'is';
        setMissingTerms(aMissingTerm);
        populateBreadcrumb();
        expect(getMissingTerms()).not.toEqual([]);
        Simulate.clearBreadcrumb(env);
        expect(getMissingTerms()).toEqual([]);
      });

      it('should remove an element when it is clicked', () => {
        const missingTerm1 = 'is';
        const missingTerm2 = 'this';
        setMissingTerms(missingTerm1);
        setMissingTerms(missingTerm2);
        const breadcrumb = populateBreadcrumb();
        const element = $$(breadcrumb[0].element).find('.coveo-missing-term-breadcrumb-clear');
        expect(getMissingTerms().length).toBe(2);
        element.click();
        expect(getMissingTerms().length).toBe(1);
      });

      it('should log a removeMissingTerm event when it is clicked', () => {
        spyOn(usageAnalytics, 'logSearchEvent');
        const missingTerm1 = 'is';
        const missingTerm2 = 'this';
        setMissingTerms(missingTerm1);
        setMissingTerms(missingTerm2);
        const breadcrumb = populateBreadcrumb();
        const element = $$(breadcrumb[0].element).find('.coveo-missing-term-breadcrumb-clear');
        element.click();
        expect(usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
          jasmine.objectContaining({
            name: 'removeMissingTerm',
            type: 'missingTerm'
          }),
          jasmine.objectContaining({
            missingTerm: 'is'
          })
        );
      });
    });
  });
}
