import { ComponentOptionLoader } from '../../src/ui/Base/ComponentOptionsLoader';
import { $$, ComponentOptions, ComponentOptionsType, l } from '../../src/Core';
import { IComponentLocalizedStringOptionArgs } from '../../src/ui/Base/IComponentOptions';
export function ComponentOptionLoaderTest() {
  describe('ComponentOptionLoader', () => {
    it('should be able to load from the element attribute', () => {
      const elem = $$('div', { 'data-foo': 'bar' }).el;

      const valueLoaded = new ComponentOptionLoader(elem, {}, 'foo', { load: ComponentOptions.loadStringOption }).load();
      expect(valueLoaded).toBe('bar');
    });

    it('should be able to load from dictionnary value', () => {
      const elem = $$('div').el;

      const valueLoaded = new ComponentOptionLoader(elem, { abc: 'def' }, 'abc', {}).load();
      expect(valueLoaded).toBe('def');
    });

    describe('should be able to load default value from option definition', () => {
      let elem: HTMLElement;

      beforeEach(() => {
        elem = $$('div').el;
      });

      it('when it is a string', () => {
        const valueLoaded = new ComponentOptionLoader(elem, {}, 'foo', {
          type: ComponentOptionsType.STRING,
          defaultValue: 'qwerty'
        }).load();
        expect(valueLoaded).toBe('qwerty');
      });

      it('when it is a list', () => {
        const valueLoaded = new ComponentOptionLoader(elem, {}, 'foo', {
          type: ComponentOptionsType.LIST,
          defaultValue: ['q', 'w', 'e', 'r', 't', 'y']
        }).load();
        expect(valueLoaded).toEqual(['q', 'w', 'e', 'r', 't', 'y']);
      });

      it('when it is an object', () => {
        const valueLoaded = new ComponentOptionLoader(elem, {}, 'foo', {
          type: ComponentOptionsType.OBJECT,
          defaultValue: { bar: 'buzz' }
        }).load();
        expect(valueLoaded).toEqual({ bar: 'buzz' });
      });

      it('when it is a localized string', () => {
        const valueLoaded = new ComponentOptionLoader(elem, {}, 'foo', {
          type: ComponentOptionsType.LOCALIZED_STRING,
          localizedString: () => l('Title')
        } as IComponentLocalizedStringOptionArgs).load();
        expect(valueLoaded).toEqual(l('Title'));
      });

      it('when it is a localized string with defaultValue, it will return the default value with a warning', () => {
        const valueLoaded = new ComponentOptionLoader(elem, {}, 'foo', {
          type: ComponentOptionsType.LOCALIZED_STRING,
          defaultValue: l('Title')
        } as IComponentLocalizedStringOptionArgs).load();
        expect(valueLoaded).toEqual(l('Title'));
      });
    });
  });
}
