/// <reference path="../Test.ts" />
module Coveo {
  describe('TemplateLoder', ()=> {
    let test;
    it('should not load a template into itself for template-ception', function () {
      let badTemplateId = 'badTemplate';
      let badTemplate = new Template(()=> {
        return `<div class='CoveoTemplateLoader' data-template-id='${badTemplateId}'></div>`;
      })
      TemplateCache.registerTemplate(badTemplateId, badTemplate);

      expect(()=> {
        test = Mock.advancedComponentSetup<TemplateLoader>(TemplateLoader, new Mock.AdvancedComponentSetupOptions($$('div', {
          'data-template-id': badTemplateId
        }).el))
      }).toThrow();
    })
  })
}