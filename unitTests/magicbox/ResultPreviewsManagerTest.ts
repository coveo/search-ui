import { ResultPreviewsManager, ISearchResultPreview } from '../../src/magicbox/ResultPreviewsManager';
import { IMockEnvironment, MockEnvironmentBuilder } from '../MockEnvironment';
import { $$ } from '../../src/utils/Dom';
import { ResultPreviewsManagerEvents, IPopulateSearchResultPreviewsEventArgs } from '../../src/events/ResultPreviewsManagerEvents';
import { toArray } from 'underscore';

export function ResultPreviewsManagerTest() {
  describe('ResultPreviewsManager', function() {
    const previewClass = 'this-is-fine';
    const suggestionText = 'DVD';
    const previewsTexts = ['Fabric DVD pouch', '15 Blank CDs', 'CD/DVD drive'];
    let env: IMockEnvironment;
    let resultPreviewsManager: ResultPreviewsManager;

    function buildEnvironment() {
      return (env = new MockEnvironmentBuilder().build());
    }

    function buildSuggestionsListbox() {
      return env.element.appendChild($$('div', { id: 'some-witty-joke', className: 'coveo-magicbox-suggestions' }).el);
    }

    function buildResultPreviewsManager() {
      buildEnvironment();
      resultPreviewsManager = new ResultPreviewsManager(env.element, { previewClass });
      buildSuggestionsListbox();
    }

    function createTestSuggestion() {
      return $$('div', {}, suggestionText).el;
    }

    function createPreviews() {
      return previewsTexts.map(
        text =>
          <ISearchResultPreview>{
            element: $$(
              'div',
              {
                className: previewClass
              },
              $$(
                'div',
                {
                  className: 'CoveoResultLink'
                },
                text
              )
            ).el
          }
      );
    }

    function bindPopulateEvent() {
      $$(env.root).on(ResultPreviewsManagerEvents.populateSearchResultPreviews, (_, args: IPopulateSearchResultPreviewsEventArgs) => {
        args.previewsQueries.push(Promise.resolve(createPreviews()));
      });
    }

    function displayPreviews() {
      return resultPreviewsManager.displaySearchResultPreviewsForSuggestion(createTestSuggestion());
    }

    function getAppendedPreviews() {
      return toArray<HTMLElement>(env.element.querySelectorAll(`.${previewClass}`));
    }

    beforeEach(async done => {
      buildResultPreviewsManager();
      bindPopulateEvent();
      await displayPreviews();
      done();
    });

    it('appends previews received from the populate event', async done => {
      const appendedPreviews = getAppendedPreviews();
      expect(appendedPreviews.length).toEqual(previewsTexts.length);
      done();
    });

    describe('with accessibility', () => {
      it('builds the preview container with the appropriate roles', async done => {
        const previewHeader = env.element.querySelector('.coveo-preview-header');
        expect(previewHeader.getAttribute('role')).toEqual('status');
        const previewResults = env.element.querySelector('.coveo-preview-results');
        expect(previewResults.getAttribute('role')).toEqual('listbox');
        done();
      });

      it('sets the summary of the results container', () => {
        const previewResults = env.element.querySelector('.coveo-preview-results');
        expect(previewResults.getAttribute('summary')).toContain(suggestionText);
      });

      it('sets the role of previews to "option"', async done => {
        const appendedPreviews = getAppendedPreviews();
        appendedPreviews.forEach(preview => expect(preview.getAttribute('role')).toEqual('option'));
        done();
      });

      it('makes previews selectable', async done => {
        const appendedPreviews = getAppendedPreviews();
        appendedPreviews.forEach(preview => expect(!!preview.getAttribute('aria-selected')).toBeTruthy());
        done();
      });

      it('gives each preview a unique id', async done => {
        const appendedPreviews = getAppendedPreviews();
        appendedPreviews.forEach(preview => {
          expect(!!preview.id).toBeTruthy();
          expect(env.root.querySelectorAll(`#${preview.id}`).length).toEqual(1);
        });
        done();
      });
    });
  });
}
