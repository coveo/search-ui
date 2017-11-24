import * as Mock from '../MockEnvironment';
import { Template } from '../../src/ui/Templates/Template';
import { TemplateCache } from '../../src/ui/Templates/TemplateCache';
import { TemplateLoader } from '../../src/ui/TemplateLoader/TemplateLoader';
import { $$ } from '../../src/utils/Dom';

export function TemplateLoaderTest() {
  describe('TemplateLoder', () => {
    it('should not load a template into itself for template-ception', function() {
      let badTemplateId = 'badTemplate';
      let badTemplate = new Template(() => {
        return `<div class='CoveoTemplateLoader' data-template-id='${badTemplateId}'></div>`;
      });
      TemplateCache.registerTemplate(badTemplateId, badTemplate);

      expect(() => {
        Mock.advancedComponentSetup<TemplateLoader>(
          TemplateLoader,
          new Mock.AdvancedComponentSetupOptions(
            $$('div', {
              'data-template-id': badTemplateId
            }).el
          )
        );
      }).toThrow();
      TemplateCache.unregisterTemplate(badTemplateId);
    });
  });
}
