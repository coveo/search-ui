import { ComponentOptionsPostProcessor } from '../../src/ui/Base/ComponentOptionsPostProcessor';

export function ComponentOptionsPostProcessorTest() {
  describe('ComponentOptionsPostProcessor', () => {
    it('call the post process function on the option definition', () => {
      const spy = jasmine.createSpy('foo');
      new ComponentOptionsPostProcessor({ foo: { postProcessing: spy } }, { foo: 'bar' }, 'qwerty').postProcess();
      expect(spy).toHaveBeenCalled();
    });

    it('check the required property on the option definition', () => {
      const spy = jasmine.createSpy('spy');
      spy.and.returnValue(true);

      const optionDefinition = Object.defineProperties(
        {},
        {
          required: {
            get: spy
          }
        }
      );

      new ComponentOptionsPostProcessor({ foo: optionDefinition }, { foo: 'bar' }, 'qwerty').postProcess();
      expect(spy).toHaveBeenCalled();
    });
  });
}
