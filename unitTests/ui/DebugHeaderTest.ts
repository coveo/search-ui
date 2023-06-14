import { DebugHeader } from '../../src/ui/Debug/DebugHeader';
import { IMockEnvironment, MockEnvironmentBuilder } from '../MockEnvironment';
import { Dom, $$ } from '../../src/utils/Dom';
import { Simulate } from '../Simulate';
import { InitializationEvents } from '../../src/events/InitializationEvents';
import { ResultListEvents } from '../../src/events/ResultListEvents';
import { QueryBuilder } from '../../src/ui/Base/QueryBuilder';
import { Debug } from '../../src/ui/Debug/Debug';
export function DebugHeaderTest() {
  describe('DebugHeader', () => {
    let env: IMockEnvironment;
    let elem: Dom;
    let searchSpy: jasmine.Spy;
    let debug: Debug;
    let debugHeader: DebugHeader;

    beforeEach(() => {
      env = new MockEnvironmentBuilder().build();
      elem = $$('div');
      searchSpy = jasmine.createSpy('search');
      debug = new Debug(env.root, env, null, null);
      debugHeader = new DebugHeader(debug, elem.el, searchSpy, {
        foo: 'bar'
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

    const getRequestFieldCheckbox = (elem: HTMLElement) => {
      return $$(elem).find('input[value="Request all fields available"]');
    };

    const getSearchInput = (elem: HTMLElement) => {
      return <HTMLInputElement>$$(elem).find('input[type="text"]');
    };

    it('should create a debug checkbox', () => {
      expect(getDebugCheckbox(elem.el)).not.toBeNull();
    });

    it('should create a query syntax checkbox', () => {
      expect(getQuerySyntaxCheckbox(elem.el)).not.toBeNull();
    });

    it('should create a highlight checkbox', () => {
      expect(getHighlightCheckbox(elem.el)).not.toBeNull();
    });

    it('should create a search box', () => {
      expect(getSearchInput(elem.el)).not.toBeNull();
    });

    it('should create a request field checkbox', () => {
      expect(getRequestFieldCheckbox(elem.el)).not.toBeNull();
    });

    it('should reset search input when changing search function', () => {
      getSearchInput(elem.el).value = 'foo';
      debugHeader.setSearch((value: string) => {});
      expect(getSearchInput(elem.el).value).toBe('');
    });

    it('should add debug if enabled', () => {
      getDebugCheckbox(elem.el).setAttribute('checked', 'checked');
      $$(getDebugCheckbox(elem.el)).trigger('change');
      const simulation = Simulate.query(env);
      expect(simulation.queryBuilder.enableDebug).toBe(true);
    });

    it('should add the proper origin when executing a query with debug enabled', () => {
      getDebugCheckbox(elem.el).setAttribute('checked', 'checked');
      $$(getDebugCheckbox(elem.el)).trigger('change');
      Simulate.query(env);
      expect(env.queryController.executeQuery).toHaveBeenCalledWith(jasmine.objectContaining({ origin: debug }));
    });

    it('should modify the fieldsToInclude if enabled', () => {
      getRequestFieldCheckbox(elem.el).setAttribute('checked', 'checked');
      $$(getRequestFieldCheckbox(elem.el)).trigger('change');
      const builder = new QueryBuilder();
      builder.includeRequiredFields = true;
      const simulation = Simulate.query(env, {
        queryBuilder: builder
      });
      expect(simulation.queryBuilder.includeRequiredFields).toBe(false);
    });

    it('should not modify fields to include if not enabled', () => {
      const builder = new QueryBuilder();
      builder.includeRequiredFields = true;
      const simulation = Simulate.query(env, {
        queryBuilder: builder
      });
      expect(simulation.queryBuilder.includeRequiredFields).toBe(true);
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
      expect(env.componentOptionsModel.set).toHaveBeenCalledWith(
        'searchBox',
        jasmine.objectContaining({
          enableQuerySyntax: true
        })
      );
    });
  });
}
