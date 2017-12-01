import * as Mock from '../MockEnvironment';
import { OmniboxResultList, IOmniboxResultListOptions } from '../../src/ui/OmniboxResultList/OmniboxResultList';
import { FakeResults } from '../Fake';
import { $$ } from '../../src/utils/Dom';
import { IQueryResults } from '../../src/rest/QueryResults';
import { Simulate } from '../Simulate';
import { Template } from '../../src/ui/Templates/Template';
import { get } from '../../src/ui/Base/RegisteredNamedMethods';
import { Quickview } from '../../src/ui/Quickview/Quickview';
import { ResultLink } from '../../src/ui/ResultLink/ResultLink';

export function OmniboxResultListTest() {
  describe('OmniboxResultListTest', () => {
    let test: Mock.IBasicComponentSetup<OmniboxResultList>;
    let results: IQueryResults;

    beforeEach(() => {
      test = Mock.basicComponentSetup<OmniboxResultList>(OmniboxResultList);
      results = FakeResults.createFakeResults();
    });

    it('should support building results', async done => {
      const built = await test.cmp.buildResults(results);
      expect(built.length).toEqual(results.results.length);
      done();
    });

    it('should make all results selectable by the omnibox', async done => {
      const built = await test.cmp.buildResults(results);
      built.forEach(element => {
        expect($$(element).hasClass('coveo-omnibox-selectable')).toBe(true);
      });
      done();
    });

    it('should set the no-text-suggestion property on each result for the magicbox', async done => {
      const built = await test.cmp.buildResults(results);
      built.forEach(element => {
        expect(element['no-text-suggestion']).toBeTruthy();
      });
      done();
    });

    describe('when selecting an element', () => {
      let spyOnSelect: jasmine.Spy;

      beforeEach(() => {
        spyOnSelect = jasmine.createSpy('onClick');
        test.cmp.options.onSelect = spyOnSelect;
        Simulate.omnibox(test.env);
      });

      it('should call the onSelect option when clicking on each element of the result list', async done => {
        const built = await test.cmp.buildResults(results);

        built.forEach(element => {
          $$(element).trigger('click');
        });
        expect(spyOnSelect).toHaveBeenCalledTimes(results.results.length);
        done();
      });

      it('should call the onSelect option when doing keyboard selection on each element of the result list', async done => {
        const built = await test.cmp.buildResults(results);
        built.forEach(element => {
          $$(element).trigger('keyboardSelect');
        });
        expect(spyOnSelect).toHaveBeenCalledTimes(results.results.length);
        done();
      });

      describe('with a custom result template', () => {
        const setupCustomTemplate = (templateContent: string) => {
          const tmpl = new Template(() => templateContent);
          tmpl.condition = () => true;
          test.cmp.options.resultTemplate = tmpl;
        };

        it('should not trigger select event on a quickview', async done => {
          const spyOnQuickviewOpen = jasmine.createSpy('openQuickview');

          setupCustomTemplate(`
          <div>
          <span class='random-stuff'></span>
          <div class='CoveoQuickview'></div>
          </div>
          `);

          const built = await test.cmp.buildResults(results);

          built.forEach(element => {
            const quickview = $$(element).find('.CoveoQuickview');
            (<Quickview>get(quickview)).open = spyOnQuickviewOpen;
            $$(quickview).trigger('click');
          });

          expect(spyOnSelect).not.toHaveBeenCalled();
          expect(spyOnQuickviewOpen).toHaveBeenCalledTimes(results.results.length);
          done();
        });

        it('should not trigger select event on a result link', async done => {
          const spyOnResultLinkOpen = jasmine.createSpy('openResultLink');
          setupCustomTemplate(`
          <div>
          <span class='random-stuff'></span>
          <div class='CoveoResultLink'></div>
          </div>
          `);

          const built = await test.cmp.buildResults(results);

          built.forEach(element => {
            const resultLink = $$(element).find('.CoveoResultLink');
            (<ResultLink>get(resultLink)).openLink = spyOnResultLinkOpen;
            $$(resultLink).trigger('click');
          });

          expect(spyOnSelect).not.toHaveBeenCalled();
          expect(spyOnResultLinkOpen).toHaveBeenCalledTimes(results.results.length);
          done();
        });

        it('should trigger the standard on select event on a random element', async done => {
          setupCustomTemplate(`
          <div>
          <span class='random-stuff'></span>
          <div class='CoveoResultLink'></div>
          </div>
          `);

          const built = await test.cmp.buildResults(results);

          built.forEach(element => {
            const randomStuff = $$(element).find('.random-stuff');
            $$(randomStuff).trigger('click');
          });

          expect(spyOnSelect).toHaveBeenCalledTimes(results.results.length);
          done();
        });
      });
    });

    describe('exposes options', () => {
      it('layout should be forced to list', () => {
        test = Mock.optionsComponentSetup<OmniboxResultList, IOmniboxResultListOptions>(OmniboxResultList, {
          layout: 'card'
        });
        expect(test.cmp.options.layout).toEqual('list');
      });

      it('headerTitle should output a title', async done => {
        test = Mock.optionsComponentSetup<OmniboxResultList, IOmniboxResultListOptions>(OmniboxResultList, {
          headerTitle: 'My title'
        });
        Simulate.omnibox(test.env);
        const built = await test.cmp.buildResults(results);
        await test.cmp.renderResults(built);
        const header = $$(test.cmp.options.resultContainer).find('.coveo-omnibox-result-list-header');
        expect($$(header).text()).toEqual('My title');
        done();
      });
    });
  });
}
