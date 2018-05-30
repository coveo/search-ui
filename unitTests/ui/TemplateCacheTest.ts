import { TemplateCache } from '../../src/ui/Templates/TemplateCache';
import { Template } from '../../src/ui/Templates/Template';
export function TemplateCacheTest() {
  describe('TemplateCache', () => {
    it('should allow to register a default template', () => {
      const tmpl = new Template();
      TemplateCache.registerTemplate('a template', tmpl, true, true);
      expect(TemplateCache.getDefaultTemplates()).toEqual(jasmine.arrayContaining(['a template']));
      expect(TemplateCache.getDefaultTemplate('a template')).toEqual(tmpl);
      TemplateCache.unregisterTemplate('a template');
    });

    it('should allow to register a default template with a function', () => {
      TemplateCache.registerTemplate('a template', () => `Hello World`, true, true);
      expect(TemplateCache.getDefaultTemplate('a template').dataToString()).toEqual(`Hello World`);
      TemplateCache.unregisterTemplate('a template');
    });

    it('should throw when trying to get a non existing template', () => {
      expect(() => TemplateCache.getTemplate('a template')).toThrowError();
    });

    it('should try to rescan templates when trying to get a non existing template', () => {
      TemplateCache.scanAndRegisterTemplates = jasmine.createSpy('spy');
      expect(() => TemplateCache.getTemplate('a template')).toThrowError();
      expect(TemplateCache.scanAndRegisterTemplates).toHaveBeenCalled();
    });

    it('should allow to register a non default template', () => {
      const tmpl = new Template();
      TemplateCache.registerTemplate('a template', tmpl, true, false);
      expect(TemplateCache.getDefaultTemplates()).toEqual(jasmine.arrayContaining([]));
      expect(TemplateCache.getTemplates()).toEqual(jasmine.objectContaining({ 'a template': tmpl }));
      expect(TemplateCache.getTemplateNames()).toEqual(jasmine.arrayContaining(['a template']));
    });
  });
}
