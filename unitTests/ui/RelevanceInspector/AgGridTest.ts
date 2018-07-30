import { loadAgGridLibrary, reset } from '../../../src/ui/RelevanceInspector/AgGrid';
import { $$ } from '../../Test';
declare global {
  interface Window {
    [propName: string]: any;
  }
}

let oldAgGridReference: any;

export function AgGridTest() {
  describe('AgGrid', () => {
    let doc: HTMLDocument;

    beforeEach(() => {
      reset();
      if (window.agGrid) {
        oldAgGridReference = window.agGrid;
        delete window.agGrid;
      }
      doc = document.implementation.createHTMLDocument('testing');
    });

    afterEach(() => {
      window.agGrid = oldAgGridReference;
    });

    it('should load the script in the document', () => {
      loadAgGridLibrary(doc);
      const script = $$(doc.head).find('script');
      expect((script as HTMLScriptElement).src).toContain('ag-grid');
    });

    it('should load the needed css in the document', () => {
      loadAgGridLibrary(doc);
      const styles = $$(doc.head).findAll('link');
      expect(styles.length).toBe(2);

      styles.forEach((style: HTMLLinkElement) => {
        expect(style.href).toContain('ag-grid');
      });
    });

    it('should not load ag grid multiple time while it is still loading', () => {
      loadAgGridLibrary(doc);
      let scripts = $$(doc.head).findAll('script');
      expect(scripts.length).toBe(1);
      loadAgGridLibrary(doc);
      scripts = $$(doc.head).findAll('script');
      expect(scripts.length).toBe(1);
    });
  });
}
