import { Logo } from '../../src/ui/Logo/Logo';
import { $$ } from '../../src/utils/Dom';
import * as Mock from '../MockEnvironment';

export function LogoTest() {
  describe('Logo', () => {
    var test: Mock.IBasicComponentSetup<Logo>;

    beforeEach(function() {
      test = Mock.basicComponentSetup<Logo>(Logo);
    });

    afterEach(function() {
      test = null;
    });

    it('Should be an image link to coveo website', () => {
      let link = $$(test.cmp.element).find('a');
      expect(link.getAttribute('href')).toBe('https://www.coveo.com/');
      expect($$(link).getClass()).toEqual(jasmine.arrayContaining(['coveo-powered-by', 'coveo-footer-logo']));
    });
  });
}
