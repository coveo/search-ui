import { ComponentOptionsMerger } from '../../src/ui/Base/ComponentOptionsMerger';
import { ComponentOptionsType, l } from '../../src/Core';

export function ComponentOptionsMergerTest() {
  describe('ComponentOptionMerger', () => {
    it('should not merge null values', () => {
      const out = {} as any;
      new ComponentOptionsMerger({ type: ComponentOptionsType.STRING }, { value: null, name: 'bar' }, out).merge();
      expect(out.bar).not.toBeDefined();
    });

    it('should not merge undefined values', () => {
      const out = {} as any;
      new ComponentOptionsMerger({ type: ComponentOptionsType.STRING }, { value: undefined, name: 'bar' }, out).merge();
      expect(out.bar).not.toBeDefined();
    });

    it('should merge simple string value', () => {
      const out = {} as any;
      new ComponentOptionsMerger({ type: ComponentOptionsType.STRING }, { value: 'foo', name: 'bar' }, out).merge();
      expect(out.bar).toEqual('foo');
    });

    it('should merge empty string', () => {
      const out = {} as any;
      new ComponentOptionsMerger({ type: ComponentOptionsType.STRING }, { value: '', name: 'bar' }, out).merge();
      expect(out.bar).toEqual('');
    });

    it('should merge simple number values', () => {
      const out = {} as any;
      new ComponentOptionsMerger({ type: ComponentOptionsType.NUMBER }, { value: 123, name: 'bar' }, out).merge();
      expect(out.bar).toEqual(123);
    });

    it('should merge simple falsy number values', () => {
      const out = {} as any;
      new ComponentOptionsMerger({ type: ComponentOptionsType.NUMBER }, { value: 0, name: 'bar' }, out).merge();
      expect(out.bar).toEqual(0);
    });

    it('should merge simple object values', () => {
      const out = {} as any;
      new ComponentOptionsMerger({ type: ComponentOptionsType.OBJECT }, { value: { buzz: 'bazz' }, name: 'bar' }, out).merge();
      expect(out.bar).toEqual({ buzz: 'bazz' });
    });

    it('should override existing values in dictionnary', () => {
      const out = { bar: 999 } as any;
      new ComponentOptionsMerger({ type: ComponentOptionsType.NUMBER }, { value: 123, name: 'bar' }, out).merge();
      expect(out.bar).toEqual(123);
    });

    it('should override merge existing values in dictionnary as object', () => {
      const out = { bar: { buzz: 'bazz' } } as any;
      new ComponentOptionsMerger({ type: ComponentOptionsType.OBJECT }, { value: { hello: 'world' }, name: 'bar' }, out).merge();
      expect(out.bar).toEqual({ buzz: 'bazz', hello: 'world' });
    });

    it('should merge simple localized string values', () => {
      const out = {} as any;
      new ComponentOptionsMerger({ type: ComponentOptionsType.LOCALIZED_STRING }, { value: 'Title', name: 'bar' }, out).merge();
      expect(out.bar).toEqual(l('Title'));
    });
  });
}
