import { L10N } from '../../src/misc/L10N';

declare var String: {
  toLocaleString(l10n: any);
  locale: string;
};

export function L10NTest() {
  describe('L10N', () => {
    beforeEach(() => {
      String.toLocaleString({
        en: {
          Foo: 'Bar',
          TwoNumbers: '{0} and {1}',
          baby: '{0} bab<sn>y</sn><pl>ies</pl>'
        },
        fr: {
          Foo: 'Barre',
          TwoNumbers: '{0} et {1}',
          baby: '{0} bébé<pl>s</pl>'
        }
      });
    });
    afterEach(() => {
      String.toLocaleString({
        en: {
          Foo: 'Foo'
        },
        fr: {
          Foo: 'Foo'
        }
      });
    });

    it('should work for simple localizations', () => {
      String.locale = 'fr';
      expect(L10N.format('Foo')).toBe('Barre');
      String.locale = 'en';
      expect(L10N.format('Foo')).toBe('Bar');
    });

    it('should put parameters in the outputted string properly', () => {
      String.locale = 'fr';
      expect(L10N.format('TwoNumbers', '37', '42')).toBe('37 et 42');
      String.locale = 'en';
      expect(L10N.format('TwoNumbers', '37', '42')).toBe('37 and 42');
    });

    it('should automatically pluralize values higher than one', () => {
      String.locale = 'fr';
      expect(L10N.format('baby', 0, 0)).toBe('0 bébé');
      expect(L10N.format('baby', 0.42, 0.42)).toBe('0.42 bébé');
      expect(L10N.format('baby', 1, 1)).toBe('1 bébé');
      expect(L10N.format('baby', 1.37, 1.37)).toBe('1.37 bébés');
      expect(L10N.format('baby', 42, 42)).toBe('42 bébés');

      String.locale = 'en';
      expect(L10N.format('baby', 0, 0)).toBe('0 baby');
      expect(L10N.format('baby', 0.42, 0.42)).toBe('0.42 baby');
      expect(L10N.format('baby', 1, 1)).toBe('1 baby');
      expect(L10N.format('baby', 1.37, 1.37)).toBe('1.37 babies');
      expect(L10N.format('baby', 42, 42)).toBe('42 babies');
    });

    it('should force pluralization or singularization when last argument is boolean', () => {
      String.locale = 'fr';
      expect(L10N.format('baby', 1, true)).toBe('1 bébés');
      expect(L10N.format('baby', 37, false)).toBe('37 bébé');

      String.locale = 'en';
      expect(L10N.format('baby', 1, true)).toBe('1 babies');
      expect(L10N.format('baby', 37, false)).toBe('37 baby');
    });

    it('should try to find a soft match between strings', () => {
      String.locale = 'fr';
      expect(L10N.format('foo')).toBe('Barre');
      expect(L10N.format('FOO')).toBe('Barre');
      String.locale = 'en';
    });

    it('should try to remove parameters in the translated string if no parameters are passed', () => {
      expect(L10N.format('baby')).toBe('baby');
    });
  });
}
