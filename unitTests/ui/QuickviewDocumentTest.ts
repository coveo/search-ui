import { QuickviewDocument } from '../../src/ui/Quickview/QuickviewDocument';
import * as Mock from '../MockEnvironment';
import { QuickviewEvents } from '../../src/events/QuickviewEvents';
import { $$ } from '../../src/utils/Dom';
import { FakeResults } from '../Fake';

export function QuickviewDocumentTest() {
  describe('QuickviewDocument', () => {
    const title = 'foo';
    let test: Mock.IBasicComponentSetup<QuickviewDocument>;

    beforeEach(() => {
      test = Mock.advancedResultComponentSetup<QuickviewDocument>(QuickviewDocument, { ...FakeResults.createFakeResult(), title });
    });

    it('should request the last query on the query controller when opening', () => {
      test.cmp.open();
      expect(test.env.queryController.getLastQuery).toHaveBeenCalled();
    });

    it('should trigger an openQuickview event when opening', () => {
      const openSpy = jasmine.createSpy('open');
      $$(test.cmp.root).on(QuickviewEvents.openQuickview, openSpy);
      test.cmp.open();
      expect(openSpy).toHaveBeenCalled();
    });

    it('should properly modify the terms to highlight on the result', () => {
      $$(test.cmp.root).on(QuickviewEvents.openQuickview, (e, args) => {
        args.termsToHighlight.push('bar');
        args.termsToHighlight.push('baz');
      });

      test.cmp.open();

      expect(test.cmp.result.termsToHighlight['bar']).toEqual(['bar']);
      expect(test.cmp.result.termsToHighlight['baz']).toEqual(['baz']);
    });

    it('should call getDocumentHtml on the endpoint', () => {
      test.cmp.open();
      expect(test.env.searchEndpoint.getDocumentHtml).toHaveBeenCalled();
    });

    describe('when rendering an HTML document', () => {
      let doc: HTMLDocument;

      beforeEach(() => {
        doc = document.implementation.createHTMLDocument();
        (test.env.searchEndpoint.getDocumentHtml as jasmine.Spy).and.returnValue(doc);
        document.body.appendChild(test.cmp.element);
      });

      afterEach(() => {
        test.cmp.element.remove();
      });

      it('should trigger an after load event', async done => {
        const loadedSpy = jasmine.createSpy('loaded');
        $$(test.cmp.element).on(QuickviewEvents.quickviewLoaded, loadedSpy);
        await test.cmp.open();
        expect(loadedSpy).toHaveBeenCalled();
        done();
      });

      it('should pass the value of the title option to the iframe', async done => {
        await test.cmp.open();
        expect(test.cmp['iframe'].iframeHTMLElement.title).toEqual(title);
        done();
      });
    });
  });
}
