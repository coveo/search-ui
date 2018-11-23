import { GenericValueOutput } from '../../../src/ui/RelevanceInspector/GenericValueOutput';
export function GenericValueOutputTest() {
  describe('GenericValueOutput', () => {
    const checkArrayContent = (content: string) => {
      expect(content).toContain('<li>1</li>');
      expect(content).toContain('<li>4</li>');
      expect(content).toContain('<li>6</li>');
    };

    const checkSimpleObjectContent = (content: string) => {
      expect(content).toContain('<dt>foo</dt>');
      expect(content).toContain('<dd>bar</dd>');
    };

    it('should output simple string value without modification', () => {
      expect(new GenericValueOutput().output('foo')).toEqual(
        jasmine.objectContaining({
          content: 'foo'
        })
      );
    });

    it('should output a empty string value to NULL', () => {
      expect(new GenericValueOutput().output('')).toEqual(
        jasmine.objectContaining({
          content: '-- NULL --'
        })
      );
    });

    it('should output null value to NULL', () => {
      expect(new GenericValueOutput().output(null)).toEqual(
        jasmine.objectContaining({
          content: '-- NULL --'
        })
      );
    });

    it('should output undefined value to NULL', () => {
      expect(new GenericValueOutput().output(undefined)).toEqual(
        jasmine.objectContaining({
          content: '-- NULL --'
        })
      );
    });

    it('should output number value to a simple string', () => {
      expect(new GenericValueOutput().output(1)).toEqual(
        jasmine.objectContaining({
          content: '1'
        })
      );
    });

    it('should output 0 properly to a simple string', () => {
      expect(new GenericValueOutput().output(0)).toEqual(
        jasmine.objectContaining({
          content: '0'
        })
      );
    });

    it('should output true value to a simple string', () => {
      expect(new GenericValueOutput().output(true)).toEqual(
        jasmine.objectContaining({
          content: 'true'
        })
      );
    });

    it('should output false value to a simple string', () => {
      expect(new GenericValueOutput().output(false)).toEqual(
        jasmine.objectContaining({
          content: 'false'
        })
      );
    });

    it('should output array as a list', () => {
      const contentBuilt = new GenericValueOutput().output([1, 4, 6]).content;
      expect(contentBuilt).toContain('ul');
      checkArrayContent(contentBuilt);
    });

    it('should ouput empty array to NULL', () => {
      const contentBuilt = new GenericValueOutput().output([]).content;
      expect(contentBuilt).toContain('-- NULL --');
    });

    it('should output array that contains object to a definition list', () => {
      const contentBuilt = new GenericValueOutput().output([1, 4, 6, { foo: 'bar' }]).content;
      expect(contentBuilt).toContain('dl');
      checkArrayContent(contentBuilt);
      checkSimpleObjectContent(contentBuilt);
    });

    it('should output object to a definition list', () => {
      const contentBuilt = new GenericValueOutput().output({ foo: 'bar' }).content;
      expect(contentBuilt).toContain('dl');
      checkSimpleObjectContent(contentBuilt);
    });

    it('should output object that contains array values to a definition list', () => {
      const contentBuilt = new GenericValueOutput().output({ foo: [1, 4, 6] }).content;
      expect(contentBuilt).toContain('dl');
      expect(contentBuilt).toContain('<dt>foo</dt>');
      checkArrayContent(contentBuilt);
    });

    it('should output object that contains sub object properties as definition list', () => {
      const contentBuilt = new GenericValueOutput().output({ baz: { foo: 'bar' } }).content;
      expect(contentBuilt).toContain('dl');
      checkSimpleObjectContent(contentBuilt);
    });
  });
}
