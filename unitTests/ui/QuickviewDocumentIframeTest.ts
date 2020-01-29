import { QuickviewDocumentIframe } from '../../src/ui/Quickview/QuickviewDocumentIframe';
import { AjaxError } from '../../src/rest/AjaxError';
import { $$ } from '../../src/utils/Dom';
import { l } from '../Test';

export function QuickviewDocumentIframeTest() {
  describe('QuickviewDocumentIframe', () => {
    let quickviewIframe: QuickviewDocumentIframe;

    beforeEach(() => {
      quickviewIframe = new QuickviewDocumentIframe();
    });

    it('should sandbox the iframe and allow same origin', () => {
      expect(quickviewIframe.iframeHTMLElement.getAttribute('sandbox')).toContain('allow-same-origin');
    });

    it('should sandbox the iframe and allow top navigation', () => {
      expect(quickviewIframe.iframeHTMLElement.getAttribute('sandbox')).toContain('allow-top-navigation');
    });

    describe('when rendering', () => {
      beforeEach(() => {
        quickviewIframe.el.style.display = 'none';
        document.body.appendChild(quickviewIframe.el);
      });

      afterEach(() => {
        quickviewIframe.el.remove();
      });

      describe('an error', () => {
        let error: AjaxError;

        beforeEach(() => {
          error = new AjaxError('oh no', 500);
        });

        it('should render a "No Quickview" message on a 400 error', () => {
          error.status = 400;
          quickviewIframe.renderError(error);
          expect($$(quickviewIframe.body).text()).toContain(l('NoQuickview'));
        });

        it('should render a generic error message on a generic error', () => {
          quickviewIframe.renderError(error);
          expect($$(quickviewIframe.body).text()).toContain(l('OoopsError'));
        });

        it('should resolve with the iframe element when the error is done rendering', async done => {
          const resolved = await quickviewIframe.renderError(error);
          expect(resolved).toBe(quickviewIframe.iframeHTMLElement);
          done();
        });

        it('should not do anything if the users closes the quickview before rendering the error', async done => {
          quickviewIframe.el.remove();
          try {
            await quickviewIframe.renderError(error);
          } catch (err) {
            expect(err).toBeNull();
            done();
          }
        });
      });

      describe('an HTML document', () => {
        let htmlDocument: HTMLDocument;

        beforeEach(() => {
          htmlDocument = document.implementation.createHTMLDocument();
          htmlDocument.body.textContent = 'hello world';
        });

        it('should render the content of the document', async done => {
          await quickviewIframe.render(htmlDocument);
          expect(quickviewIframe.body.textContent).toContain('hello world');
          done();
        });

        it('should render the given title', async done => {
          const title = 'abcdef';
          await quickviewIframe.render(htmlDocument, title);
          expect(quickviewIframe.iframeHTMLElement.title).toEqual(title);
          done();
        });

        it('should add additional styling in the header of the document', async done => {
          await quickviewIframe.render(htmlDocument);
          expect(quickviewIframe.document.head.children.length).toBeGreaterThan(0);
          done();
        });

        it('should modify links in the document to allow to escape sandbox', async done => {
          const link = $$('a', { href: 'the internets.com' }).el;
          htmlDocument.body.appendChild(link);

          await quickviewIframe.render(htmlDocument);
          expect(link.getAttribute('target')).toBe('_top');
          done();
        });

        it('should resolve with the iframe element when the document is done rendering', async done => {
          const resolved = await quickviewIframe.render(htmlDocument);
          expect(resolved).toBe(quickviewIframe.iframeHTMLElement);
          done();
        });

        it('should not do anything if the users closes the quickview before rendering the document', async done => {
          quickviewIframe.el.remove();
          try {
            await quickviewIframe.render(htmlDocument);
          } catch (err) {
            expect(err).toBeNull();
            done();
          }
        });

        it('should detect old quickview document', async done => {
          await quickviewIframe.render(htmlDocument);
          expect(quickviewIframe.isNewQuickviewDocument()).toBeFalsy();
          done();
        });

        it('should detect new quickview document by using meta available in the header of the document', async done => {
          const meta = $$('meta', {
            name: 'generator',
            content: 'pdf2htmlEX'
          });
          htmlDocument.head.appendChild(meta.el);

          await quickviewIframe.render(htmlDocument);
          expect(quickviewIframe.isNewQuickviewDocument()).toBeTruthy();
          done();
        });
      });
    });
  });
}
