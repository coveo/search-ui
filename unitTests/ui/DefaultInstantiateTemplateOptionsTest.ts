import { IInstantiateTemplateOptions, DefaultInstantiateTemplateOptions } from '../../src/ui/Templates/Template';

export function DefaultInstantiateTemplateOptionsTest() {
  describe('DefaultInstantiateTemplateOptions', () => {
    let saneDefaults: IInstantiateTemplateOptions;
    beforeEach(() => {
      saneDefaults = <IInstantiateTemplateOptions>{
        checkCondition: true,
        currentLayout: null,
        wrapInDiv: true
      };
    });

    it('should have sane default', () => {
      let defaults = new DefaultInstantiateTemplateOptions();
      expect(defaults.checkCondition).toBe(saneDefaults.checkCondition);
      expect(defaults.currentLayout).toBe(saneDefaults.currentLayout);
      expect(defaults.wrapInDiv).toBe(saneDefaults.wrapInDiv);
      expect(defaults.responsiveComponents).toBeDefined();
    });

    it('should allow to get sane defaults', () => {
      let defaults = new DefaultInstantiateTemplateOptions();
      expect(defaults.get()).toEqual(jasmine.objectContaining(saneDefaults));
    });

    it('should allow to merge with another IInstantiateTemplateOptions', () => {
      let merged = new DefaultInstantiateTemplateOptions().merge({
        checkCondition: false
      });
      expect(merged.checkCondition).toBe(false);
    });

    it('should not fail when merging with undefined', () => {
      expect(() => new DefaultInstantiateTemplateOptions().merge(null)).not.toThrowError();
      let merged = new DefaultInstantiateTemplateOptions().merge(null);
      expect(merged.checkCondition).toBe(true);
    });
  });
}
