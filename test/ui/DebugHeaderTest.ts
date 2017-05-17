import { DebugHeader } from '../../src/ui/Debug/DebugHeader';
import { IMockEnvironment, MockEnvironmentBuilder } from '../MockEnvironment';
import { Dom, $$ } from '../../src/utils/Dom';
import { Simulate } from '../Simulate';
import { InitializationEvents } from '../../src/events/InitializationEvents';
import { ResultListEvents } from '../../src/events/ResultListEvents';
export function DebugHeaderTest() {

  describe('DebugHeader', () => {
    let env: IMockEnvironment;
    let elem: Dom;
    let searchSpy: jasmine.Spy;
    let debugHeader: DebugHeader;

    beforeEach(() => {
      env = new MockEnvironmentBuilder().build();
      elem = $$('div');
      searchSpy = jasmine.createSpy('search');
      debugHeader = new DebugHeader(env.root, elem.el, env, searchSpy, {
        'foo': 'bar'
      });
    });

    const getDebugCheckbox = (elem: HTMLElement) => {
      return $$(elem).find('input[value="Enable query debug"]');
    };

    const getQuerySyntaxCheckbox = (elem: HTMLElement) => {
      return $$(elem).find('input[value="Enable query syntax in search box"]');
    };

    const getHighlightCheckbox = (elem: HTMLElement) => {
      return $$(elem).find('input[value="Highlight recommendation"]');
    };

    const getSearchInput = (elem: HTMLElement) => {
      return <HTMLInputElement>$$(elem).find('input[type="text"]');
    };

    it('should create a download button', () => {

      expect($$(elem.el).find('a[download="debug.json"]')).not.toBeNull();
    });

    it('should create a debug checkbox', () => {
      expect(getDebugCheckbox(elem.el)).not.toBeNull();
    });

    it('should create a query syntax checkbox', () => {
      expect(getQuerySyntaxCheckbox(elem.el)).not.toBeNull();
    });

    it('should create an highlight checkbox', () => {
      expect(getHighlightCheckbox(elem.el)).not.toBeNull();
    });

    it('should create a search box', () => {
      expect(getSearchInput(elem.el)).not.toBeNull();
    });

    it('should add debug if enabled', () => {
      getDebugCheckbox(elem.el).setAttribute('checked', 'checked');
      $$(getDebugCheckbox(elem.el)).trigger('change');
      const simulation = Simulate.query(env);
      expect(simulation.queryBuilder.enableDebug).toBe(true);
    });

    it('should add highlight if enabled', () => {
      $$(env.root).trigger(InitializationEvents.afterInitialization);

      getHighlightCheckbox(elem.el).setAttribute('checked', 'checked');
      $$(getHighlightCheckbox(elem.el)).trigger('change');
      const fakeResultElement = {
        item: $$('div').el,
        result: {
          isRecommendation: true
        }
      };
      $$(env.root).trigger(ResultListEvents.newResultDisplayed, fakeResultElement);
      expect($$(fakeResultElement.item).hasClass('coveo-is-recommendation')).toBe(true);
    });

    it('should add query syntax if enabled', () => {
      const querySyntax = getQuerySyntaxCheckbox(elem.el);
      querySyntax.setAttribute('checked', 'checked');
      $$(querySyntax).trigger('change');
      expect(env.componentOptionsModel.set).toHaveBeenCalledWith('searchBox', jasmine.objectContaining({
        enableQuerySyntax: true
      }));
    });
  });
}
