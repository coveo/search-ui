import { ComponentOptionsPostProcessing } from '../../src/ui/Base/ComponentOptionsPostProcessing';

export function ComponentOptionsPostProcessingTest() {
  describe('ComponentOptionsPostProcessing', () => {
    it('call the post process function on the option definition', () => {
      const spy = jasmine.createSpy('foo');
      new ComponentOptionsPostProcessing({ foo: { postProcessing: spy } }, { foo: 'bar' }, 'qwerty').postProcess();
      expect(spy).toHaveBeenCalled();
    });
  });
}
