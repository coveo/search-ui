import { TemplateFromAScriptTag } from '../../src/ui/Templates/TemplateFromAScriptTag';
import { Template } from '../../src/ui/Templates/Template';
import { ValidLayout } from '../../src/ui/ResultLayout/ResultLayout';
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
