import { HtmlTemplate } from '../../src/ui/Templates/HtmlTemplate';
import { ITemplateFromStringProperties } from '../../src/ui/Templates/TemplateFromAScriptTag';
export function HtmlTemplateTest() {
  describe('HtmlTemplate', () => {
    it('should instantiate from a script element', () => {
      let element = document.createElement('script');
      element.setAttribute('data-layout', 'card');
      let createdTemplate = HtmlTemplate.create(element);
      expect(createdTemplate.layout).toEqual('card');
      expect(createdTemplate.mobile).not.toBeDefined();
      expect(createdTemplate.getFields()).toEqual(jasmine.arrayContaining([]));
    });

    it('should instantiate from a string', () => {
      let createdTemplate = HtmlTemplate.fromString(
        `<div class="CoveoResultLink" data-field="@foo"></div>`,
        <ITemplateFromStringProperties>{
          mobile: true
        }
      );
      expect(createdTemplate.getFields()).toEqual(jasmine.arrayContaining(['foo', 'author', 'source']));
      expect(createdTemplate.layout).toEqual('list');
      expect(createdTemplate.mobile).toBe(true);
    });

    it('created element should have no attribute type', () => {
      let element = document.createElement('script');
      let createdTemplate = HtmlTemplate.create(element);
      let createdHtmlElement = createdTemplate.toHtmlElement();
      expect(createdHtmlElement.getAttribute('type')).toEqual(null);
    });

    it('created element from string should have no attribute type', () => {
      let createdTemplate = HtmlTemplate.fromString(
        `<div class="CoveoResultLink" data-field="@foo"></div>`,
        <ITemplateFromStringProperties>{}
      );
      expect(createdTemplate.element.getAttribute('type')).toEqual(null);
    });
  });
}
