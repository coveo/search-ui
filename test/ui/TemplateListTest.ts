import { TemplateList } from '../../src/ui/Templates/TemplateList';
import { IQueryResult } from '../../src/rest/QueryResult';
import { FakeResults } from '../Fake';
import { DefaultResultTemplate } from '../../src/ui/Templates/DefaultResultTemplate';
import { Template } from '../../src/ui/Templates/Template';
export function TemplateListTest() {
  describe('TemplateList', () => {
    let result: IQueryResult;

    beforeEach(() => {
      result = FakeResults.createFakeResult();
    });

    afterEach(() => {
      result = null;
    });

    it('should throw when passing null or undefined in constructor', () => {
      expect(() => new TemplateList(null)).toThrow();
      expect(() => new TemplateList(undefined)).toThrow();
    });

    describe('when there are no templates', () => {
      it('should return a default result template when instantiating to element', done => {
        let templateList = new TemplateList([]);
        templateList.instantiateToElement(result).then(element => {
          expect(element.innerHTML).toEqual(new DefaultResultTemplate().instantiateToString(result));
          done();
        });
      });

      it('should return a default result template when instantiating to string', () => {
        let templateList = new TemplateList([]);
        let stringCreated = templateList.instantiateToString(result);
        expect(stringCreated).toEqual(new DefaultResultTemplate().instantiateToString(result));
      });
    });

    describe('when there are templates', () => {
      let templates: Template[];
      beforeEach(() => {
        templates = [];
        templates[0] = new Template(() => `Template 1`);
        templates[1] = new Template(() => `Template 2`);
      });

      afterEach(() => {
        templates = null;
      });

      it('should evaluate the first one first', () => {
        let templateList = new TemplateList(templates);
        expect(templateList.instantiateToString(result)).toEqual(`Template 1`);
      });

      it('should skip the first one if condition does not match', () => {
        templates[0].condition = result => result.raw['foo'] == 'baz';
        let templateList = new TemplateList(templates);
        expect(templateList.instantiateToString(result)).toEqual(`Template 2`);
      });

      it('should skip the first one if the conditionToParse does not match', () => {
        templates[0].conditionToParse = `raw.foo == "baz"`;
        let templateList = new TemplateList(templates);
        expect(templateList.instantiateToString(result)).toEqual(`Template 2`);
      });

      it('should skip the first one if the fieldsToMatch does not match', () => {
        templates[0].fieldsToMatch = [
          {
            field: 'foo',
            values: ['bar', 'baz']
          }
        ];
        let templateList = new TemplateList(templates);
        expect(templateList.instantiateToString(result)).toEqual(`Template 2`);
      });

      it('should return a default template if all condition does not match', () => {
        templates[0].condition = () => false;
        templates[1].condition = () => false;
        let templateList = new TemplateList(templates);
        expect(templateList.instantiateToString(result)).toEqual(new DefaultResultTemplate().instantiateToString(result));
      });

      it('should be able to return fields', () => {
        templates[0].fields = ['a', 'b'];
        templates[1].fields = ['b', 'c'];
        let templateList = new TemplateList(templates);
        expect(templateList.getFields()).toEqual(jasmine.arrayContaining(['a', 'b', 'c']));
      });
    });
  });
}
