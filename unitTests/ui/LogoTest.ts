import { Logo, ILogoOptions } from '../../src/ui/Logo/Logo';
import { $$ } from '../../src/utils/Dom';
import * as Mock from '../MockEnvironment';
import { Simulate } from '../Simulate';

export function LogoTest() {
  describe('Logo', () => {
    let test: Mock.IBasicComponentSetup<Logo>;

    beforeEach(function() {
      test = Mock.basicComponentSetup<Logo>(Logo);
    });

    afterEach(function() {
      test = null;
    });

    const logoIsHidden = () => {
      return $$(test.cmp.element).hasClass('coveo-hidden');
    };

    const getLink = () => {
      return $$(test.cmp.element).find('a') as HTMLAnchorElement;
    };

    it('Should be an image link to coveo website', () => {
      const link = getLink();
      expect(link.href).toBe('https://www.coveo.com/');
      expect($$(link).getClass()).toEqual(jasmine.arrayContaining(['coveo-powered-by', 'coveo-footer-logo']));
    });

    it('should be hidden on no results', () => {
      Simulate.noResults(test.env);
      expect(logoIsHidden()).toBe(true);
    });

    it('should be hidden on query error', () => {
      Simulate.queryError(test.env);
      expect(logoIsHidden()).toBe(true);
    });

    it('should be visible on successful query', () => {
      Simulate.query(test.env);
      expect(logoIsHidden()).toBe(false);
    });

    it('should be visible on successful query after no results', () => {
      Simulate.noResults(test.env);
      Simulate.query(test.env);
      expect(logoIsHidden()).toBe(false);
    });

    it('should be visible on successful query after query error', () => {
      Simulate.queryError(test.env);
      Simulate.query(test.env);
      expect(logoIsHidden()).toBe(false);
    });

    describe('exposes options', () => {
      it('target allows to specify the target attribute on the link', () => {
        test = Mock.optionsComponentSetup<Logo, ILogoOptions>(Logo, {
          target: '_blank'
        });
        expect(getLink().target).toBe('_blank');
      });

      it('target left undefined should not output any target attribute on the link', () => {
        test = Mock.optionsComponentSetup<Logo, ILogoOptions>(Logo, {
          target: undefined
        });
        expect(getLink().target).toBe('');
      });
    });
  });
}
