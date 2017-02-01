import {UnderscoreTemplate} from '../../src/ui/Templates/UnderscoreTemplate';
import {IQueryResult} from '../../src/rest/QueryResult';
import {FakeResults} from '../Fake';
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
      let scriptCreated = new UnderscoreTemplate(element).toHtmlElement();
      expect(scriptCreated.getAttribute('type')).toEqual('text/underscore');
    });

    it('should be able to return the type', () => {
      let template = UnderscoreTemplate.create(element);
      expect(template.getType()).toEqual('UnderscoreTemplate');
    });

    it('should be able to get the fields', () => {
      let template = UnderscoreTemplate.create(element);
      expect(template.getFields()).toEqual(jasmine.arrayContaining(['foo']));
    });
  });
}
