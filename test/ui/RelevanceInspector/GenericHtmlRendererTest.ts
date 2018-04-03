import { GenericHtmlRenderer } from '../../../src/ui/RelevanceInspector/TableBuilder';
import { $$ } from '../../Test';

export function GenericHtmlRendererTest() {
  describe('GenericHtmlRenderer', () => {
    it('should render a default output when there is nothing to render', () => {
      const htmlRenderer = new GenericHtmlRenderer();
      htmlRenderer.init();
      const built = htmlRenderer.getGui();
      expect(built.textContent).toBe('-- NULL --');
    });

    it('should render the correct output with an HTML element', () => {
      const htmlRenderer = new GenericHtmlRenderer();
      htmlRenderer.init({
        value: $$('div', { className: 'foo' }).el,
        api: { filterManager: { quickFilter: '' } }
      });
      const built = htmlRenderer.getGui();
      expect($$(built).find('.foo')).toBeDefined();
    });

    it("should highlight the HTML element if there's a filter", () => {
      const htmlRenderer = new GenericHtmlRenderer();
      htmlRenderer.init({
        value: $$('div', { className: 'foo' }, 'Hello World').el,
        api: { filterManager: { quickFilter: 'World' } }
      });
      const built = htmlRenderer.getGui();
      expect($$(built).find('.coveo-highlight')).toBeDefined();
    });
  });
}
