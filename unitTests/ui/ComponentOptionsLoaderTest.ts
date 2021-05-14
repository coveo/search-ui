import { ComponentOptionLoader } from '../../src/ui/Base/ComponentOptionsLoader';
import { $$, ComponentOptions, ComponentOptionsType, l } from '../../src/Core';
import { IComponentLocalizedStringOptionArgs, IComponentOptions } from '../../src/ui/Base/IComponentOptions';
export function ComponentOptionLoaderTest() {
  describe('ComponentOptionLoader', () => {
    it('should be able to load from the element attribute', () => {
      const elem = $$('div', { 'data-foo': 'bar' }).el;

      const valueLoaded = new ComponentOptionLoader(elem, {}, 'foo', { load: ComponentOptions.loadStringOption }).load();
      expect(valueLoaded).toBe('bar');
    });

    it('should be able to load from dictionary value', () => {
      const elem = $$('div').el;

      const valueLoaded = new ComponentOptionLoader(elem, { abc: 'def' }, 'abc', {}).load();
      expect(valueLoaded).toBe('def');
    });

    it(`when the value of a custom option is specified using a dictionary,
    the value is transformed by the option definition`, () => {
      const elem = $$('div').el;
      const optionName = 'a';
      const dictionary = { [optionName]: 'b' };

      const definition: IComponentOptions<string> = {};
      ComponentOptions.buildCustomOption(() => 'c', definition);

      const option = new ComponentOptionLoader(elem, dictionary, optionName, definition);
      expect(option.load()).toBe('c');
    });

    it(`when the value of a custom option with an alias is specified using a dictionary,
    the value is transformed by the option definition`, () => {
      const elem = $$('div').el;
      const optionName = 'a';
      const dictionary = { [optionName]: 'b' };

      const definition: IComponentOptions<string> = { attrName: `data-alias-${optionName}` };
      ComponentOptions.buildCustomOption(() => 'c', definition);

      const option = new ComponentOptionLoader(elem, dictionary, optionName, definition);
      expect(option.load()).toBe('c');
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
