import { TemplateFromAScriptTag } from '../../src/ui/Templates/TemplateFromAScriptTag';
import { Template } from '../../src/ui/Templates/Template';
import { ValidLayout } from '../../src/ui/ResultLayoutSelector/ValidLayout';
import { $$ } from '../../src/utils/Dom';
export function TemplateFromAScriptTagTest() {
  describe('TemplateFromAScriptTag', () => {
    let tmpl: Template;

    beforeEach(() => {
      tmpl = new Template(() => 'Hello World');
    });

    afterEach(() => {
      tmpl = null;
    });

    it('should be able to instantiate from a script tag', () => {
      let scriptTag = document.createElement('script');
      expect(() => new TemplateFromAScriptTag(tmpl, scriptTag)).not.toThrowError();
    });

    it('should be able to pickup fields on the script element', () => {
      let scriptTag = document.createElement('script');
      scriptTag.setAttribute('data-fields', '@foo,@bar');
      let created = new TemplateFromAScriptTag(tmpl, scriptTag);
      expect(created.template.getFields()).toEqual(jasmine.arrayContaining(['foo', 'bar']));
    });

    describe('when there are fields to match directly on the the HTMLElement', () => {
      const createMatcher = (field, values) => {
        return jasmine.arrayContaining([
          jasmine.objectContaining({
            field,
            values
          })
        ]);
      };

      it('should extract fields to match from the HTMLScript element', () => {
        const scriptTag = $$('script', {
          'data-field-foo': 'bar'
        }).el as HTMLScriptElement;

        const created = new TemplateFromAScriptTag(tmpl, scriptTag);
        expect(created.template.fieldsToMatch).toEqual(createMatcher('foo', ['bar']));
      });

      it('should extract fields to match with underscore', () => {
        const scriptTag = $$('script', {
          'data-field-foo___something_bar': 'baz'
        }).el as HTMLScriptElement;

        const created = new TemplateFromAScriptTag(tmpl, scriptTag);
        expect(created.template.fieldsToMatch).toEqual(createMatcher('foo___something_bar', ['baz']));
      });

      it('should trim field values', () => {
        const scriptTag = $$('script', {
          'data-field-foo': '1, 2 ,  3,4  ,5'
        }).el as HTMLScriptElement;

        const created = new TemplateFromAScriptTag(tmpl, scriptTag);
        expect(created.template.fieldsToMatch).toEqual(createMatcher('foo', ['1', '2', '3', '4', '5']));
      });

      it('should extract fields to match with dots', () => {
        const scriptTag = $$('script', {
          'data-field-foo.bar.baz': 'hello'
        }).el as HTMLScriptElement;

        const created = new TemplateFromAScriptTag(tmpl, scriptTag);
        expect(created.template.fieldsToMatch).toEqual(createMatcher('foo.bar.baz', ['hello']));
      });
    });

    describe('instantiated from a string', () => {
      let tmplString: string;

      beforeEach(() => {
        tmplString = `<div class="CoveoResultLink"></div>`;
      });

      afterEach(() => {
        tmplString = null;
      });

      it('should work with a condition', () => {
        let createdScriptElement = TemplateFromAScriptTag.fromString(tmplString, {
          condition: `raw.foo != null`
        });
        let created = new TemplateFromAScriptTag(tmpl, createdScriptElement);
        expect(created.template.condition).toEqual(jasmine.any(Function));
      });

      it('should work with a layout', () => {
        let createdScriptElement = TemplateFromAScriptTag.fromString(tmplString, {
          layout: <ValidLayout>'list'
        });
        let created = new TemplateFromAScriptTag(tmpl, createdScriptElement);
        expect(created.template.layout).toBe('list');
      });

      it('should work with mobile option', () => {
        let createdScriptElement = TemplateFromAScriptTag.fromString(tmplString, {
          mobile: true
        });
        let created = new TemplateFromAScriptTag(tmpl, createdScriptElement);
        expect(created.template.mobile).toBe(true);
      });

      it('should work with tablet option', () => {
        let createdScriptElement = TemplateFromAScriptTag.fromString(tmplString, {
          tablet: true
        });
        let created = new TemplateFromAScriptTag(tmpl, createdScriptElement);
        expect(created.template.tablet).toBe(true);
      });

      it('should work with desktop option', () => {
        let createdScriptElement = TemplateFromAScriptTag.fromString(tmplString, {
          desktop: true
        });
        let created = new TemplateFromAScriptTag(tmpl, createdScriptElement);
        expect(created.template.desktop).toBe(true);
      });

      it('should work with fields to match', () => {
        let createdScriptElement = TemplateFromAScriptTag.fromString(tmplString, {
          fieldsToMatch: [
            {
              field: 'foo',
              values: ['bar', 'baz']
            }
          ]
        });
        let created = new TemplateFromAScriptTag(tmpl, createdScriptElement);
        expect(created.template.fieldsToMatch).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              field: 'foo',
              values: ['bar', 'baz']
            })
          ])
        );
      });

      it('should work with fields to match with no values', () => {
        let createdScriptElement = TemplateFromAScriptTag.fromString(tmplString, {
          fieldsToMatch: [
            {
              field: 'foo'
            }
          ]
        });
        let created = new TemplateFromAScriptTag(tmpl, createdScriptElement);
        expect(created.template.fieldsToMatch).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              field: 'foo',
              values: undefined
            })
          ])
        );
      });
    });
  });
}
