import { UnderscoreTemplate } from '../../src/ui/Templates/UnderscoreTemplate';
import { IQueryResult } from '../../src/rest/QueryResult';
import { FakeResults } from '../Fake';
export function UnderscoreTemplateTest() {
  describe('UnderscoreTemplate', () => {
    let element: HTMLElement;
    let result: IQueryResult;

    beforeEach(() => {
      element = document.createElement('script');
      element.innerHTML = '<div><%= clickUri %><div class="CoveoResultLink" data-field="@foo"></div></div>';
      result = FakeResults.createFakeResult();
    });

    it('should be able to create an HTMLElement', () => {
      const scriptCreated = new UnderscoreTemplate(element).toHtmlElement();
      expect(scriptCreated.getAttribute('type')).toEqual('text/underscore');
    });

    it('should be able to return a valid UnderscoreTemplate from string', () => {
      const template = UnderscoreTemplate.fromString(element.innerHTML, {});
      expect(template.instantiateToString(result).indexOf(result.clickUri)).toBeGreaterThan(0);
    });

    it('should be able to return the type', () => {
      const template = UnderscoreTemplate.create(element);
      expect(template.getType()).toEqual('UnderscoreTemplate');
    });

    it('should be able to get the fields', () => {
      const template = UnderscoreTemplate.create(element);
      expect(template.getFields()).toEqual(jasmine.arrayContaining(['foo']));
    });
  });
}
