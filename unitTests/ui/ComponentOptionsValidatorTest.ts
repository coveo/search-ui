import { ComponentOptionsValidator } from '../../src/ui/Base/ComponentOptionsValidator';

export function ComponentOptionsValidatorTest() {
  describe('ComponentOptionsValidator', () => {
    it('should not modify the dictionary if the option has no validator', () => {
      const out = { foo: 'bar' };
      new ComponentOptionsValidator({}, { componentID: 'id', name: 'foo', value: 'bar' }, out).validate();
      expect(out.foo).toBe('bar');
    });

    it('should modify the dictionary if the option has an invalid validator', () => {
      const out = { foo: 'bar' };
      new ComponentOptionsValidator({ validator: v => false }, { componentID: 'id', name: 'foo', value: 'bar' }, out).validate();
      expect(out.foo).not.toBeDefined();
    });

    it('should not modify the dictionary if the option has a valid validator', () => {
      const out = { foo: 'bar' };
      new ComponentOptionsValidator({ validator: v => true }, { componentID: 'id', name: 'foo', value: 'bar' }, out).validate();
      expect(out.foo).toBe('bar');
    });
  });
}
