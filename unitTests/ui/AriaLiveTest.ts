import { AriaLive } from '../../src/ui/AriaLive/AriaLive';
import { QueryEvents } from '../../src/events/QueryEvents';
import { $$, OmniboxEvents } from '../../src/Core';
import { Simulate } from '../Simulate';
import { MockEnvironmentBuilder, IMockEnvironment } from '../MockEnvironment';
import { FakeResults } from '../Fake';

export const AriaLiveTest = () => {
  describe('AriaLive', () => {
    let ariaLive: AriaLive;
    let env: IMockEnvironment;

    beforeEach(() => {
      env = new MockEnvironmentBuilder().build();
      ariaLive = new AriaLive(env.root);
    });

    function ariaLiveEl() {
      return $$(env.root).find('[aria-live]');
    }

    it(`adds a div with attribute aria-live as a child`, () => {
      expect(ariaLiveEl().getAttribute('aria-live')).toBe('polite');
    });

    it(`when calling #updateText with a value,
    it sets the ariaLive element text to the value`, () => {
      const text = 'text';
      ariaLive.updateText(text);

      expect(ariaLiveEl().textContent).toBe(text);
    });

    it(`when calling #updateText with the same value multiple times,
    it should append a non-breaking space character to the value
    so the screen reader says it again`, () => {
      const text = 'text';
      ariaLive.updateText(text);
      ariaLive.updateText(text);

      expect(ariaLiveEl().textContent).toBe(`${text}\u00A0`);
    });

    it('During a query, it announces that results are updating', () => {
      $$(env.root).trigger(QueryEvents.duringQuery);
      expect(ariaLiveEl().textContent).toBe('Updating results');
    });

    it(`when triggering a successful query with results,
    it updates the text with the number of results`, () => {
      Simulate.query(env);
      expect(ariaLiveEl().textContent).toMatch(/^Results/);
    });

    describe(`when triggering a successful query with unsafe characters and no results`, () => {
      const dangerousChar = '<';

      beforeEach(() => {
        const options = {
          query: { q: dangerousChar },
          results: FakeResults.createFakeResults(0)
        };
        Simulate.query(env, options);
      });

      it('updates the text to a no results message', () => expect(ariaLiveEl().textContent).toMatch(/^No results/));

      it('the message contains a sanitized form of the query', () => {
        const message = ariaLiveEl().textContent;
        expect(message).not.toContain(dangerousChar);
      });
    });

    it('when triggering a query that errors, it updates the text to an error message', () => {
      Simulate.queryError(env);
      const message = ariaLiveEl().textContent;

      expect(message).toContain('error');
    });

    describe('when fetching query suggestions', () => {
      describe('when there are no suggestions', () => {
        beforeEach(() => {
          Simulate.querySuggest(env, '', []);
        });

        it('updates the text', () => {
          expect(ariaLiveEl().textContent).toContain(' no ');
        });
      });

      describe('when there are 5 suggestions', () => {
        beforeEach(() => {
          Simulate.querySuggest(env, '', ['', '', '', '', '']);
        });

        it('does not update the text', () => {
          expect(ariaLiveEl().textContent).toEqual('');
        });

        describe('when the suggestions are rendered', () => {
          beforeEach(() => {
            $$(env.root).trigger(OmniboxEvents.querySuggestRendered);
          });

          it('updates the text', () => {
            expect(ariaLiveEl().textContent).toContain('5');
          });
        });
      });
    });
  });
};
