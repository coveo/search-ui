import * as Mock from '../MockEnvironment';
import { Icon } from '../../src/ui/Icon/Icon';
import { IQueryResult } from '../../src/rest/QueryResult';
import { FakeResults } from '../Fake';
import { IIconOptions } from '../../src/ui/Icon/Icon';
import { $$ } from '../../src/utils/Dom';

export function IconTest() {
  describe('Icon', function() {
    let test: Mock.IBasicComponentSetup<Icon>;
    let result: IQueryResult;

    beforeEach(function() {
      result = FakeResults.createFakeResult('foobar');
      result.raw.filetype = 'unknown';
      test = Mock.optionsResultComponentSetup<Icon, IIconOptions>(Icon, undefined, result);
    });

    afterEach(function() {
      test = null;
      result = null;
    });

    it('should render an icon for a few known filetype', function() {
      expect($$(test.cmp.element).hasClass('coveo-icon')).toBe(true);
      expect($$(test.cmp.element).hasClass('filetype')).toBe(true);
      expect($$(test.cmp.element).hasClass('unknown')).toBe(true);
    });

    describe('with an objecttype', function() {
      it('objecttype should have priority over filetype', function() {
        result.raw.objecttype = 'user';
        test = Mock.optionsResultComponentSetup<Icon, IIconOptions>(Icon, undefined, result);
        expect($$(test.cmp.element).hasClass('coveo-icon')).toBe(true);
        expect($$(test.cmp.element).hasClass('filetype')).toBe(false);
        expect($$(test.cmp.element).hasClass('objecttype')).toBe(true);
        expect($$(test.cmp.element).hasClass('user')).toBe(true);
      });

      it('should fallback on filetype when objecttype is "Document"', function() {
        result.raw.objecttype = 'Document';
        test = Mock.optionsResultComponentSetup<Icon, IIconOptions>(Icon, undefined, result);
        expect($$(test.cmp.element).hasClass('coveo-icon')).toBe(true);
        expect($$(test.cmp.element).hasClass('objecttype')).toBe(false);
        expect($$(test.cmp.element).hasClass('filetype')).toBe(true);
        expect($$(test.cmp.element).hasClass('unknown')).toBe(true);
      });

      it('should fallback on filetype when objecttype is "File"', function() {
        result.raw.objecttype = 'File';
        test = Mock.optionsResultComponentSetup<Icon, IIconOptions>(Icon, undefined, result);
        expect($$(test.cmp.element).hasClass('coveo-icon')).toBe(true);
        expect($$(test.cmp.element).hasClass('objecttype')).toBe(false);
        expect($$(test.cmp.element).hasClass('filetype')).toBe(true);
        expect($$(test.cmp.element).hasClass('unknown')).toBe(true);
      });

      it('should fallback on filetype when objecttype is "contentversion" case insensitive', function() {
        result.raw.objecttype = 'contentversion';
        test = Mock.optionsResultComponentSetup<Icon, IIconOptions>(Icon, undefined, result);
        expect($$(test.cmp.element).hasClass('coveo-icon')).toBe(true);
        expect($$(test.cmp.element).hasClass('objecttype')).toBe(false);
        expect($$(test.cmp.element).hasClass('filetype')).toBe(true);
        expect($$(test.cmp.element).hasClass('unknown')).toBe(true);
      });
    });

    describe('with a quickview inside', function() {
      beforeEach(function() {
        test = Mock.advancedResultComponentSetup<Icon>(
          Icon,
          result,
          new Mock.AdvancedComponentSetupOptions(
            $$('div', undefined, $$('div', { className: 'CoveoQuickview' }).el).el,
            undefined,
            undefined
          )
        );
      });

      it('should render properly', function() {
        expect($$(test.cmp.element).hasClass('coveo-icon')).toBe(true);
        expect($$(test.cmp.element).hasClass('filetype')).toBe(true);
        expect($$(test.cmp.element).hasClass('unknown')).toBe(true);
      });
    });

    describe('exposes options', function() {
      it('value allows to set the generated css', function() {
        test = Mock.optionsResultComponentSetup<Icon, IIconOptions>(
          Icon,
          {
            value: 'trololo'
          },
          result
        );
        expect($$(test.cmp.element).hasClass('trololo')).toBe(true);
      });

      it('small should ouput the correct css class', function() {
        test = Mock.optionsResultComponentSetup<Icon, IIconOptions>(
          Icon,
          {
            small: false
          },
          result
        );
        expect($$(test.cmp.element).hasClass('coveo-small')).toBe(false);

        test = Mock.optionsResultComponentSetup<Icon, IIconOptions>(
          Icon,
          {
            small: true
          },
          result
        );
        expect($$(test.cmp.element).hasClass('coveo-small')).toBe(true);
      });

      it('withLabel should output the correct css class', function() {
        test = Mock.optionsResultComponentSetup<Icon, IIconOptions>(
          Icon,
          {
            withLabel: true
          },
          result
        );
        expect($$(test.cmp.element).hasClass('coveo-icon-with-caption-overlay')).toBe(true);

        test = Mock.optionsResultComponentSetup<Icon, IIconOptions>(
          Icon,
          {
            withLabel: false
          },
          result
        );
        expect($$(test.cmp.element).hasClass('coveo-icon-with-caption-overlay')).toBe(false);
      });

      it('labelValue should allow to set the caption', function() {
        test = Mock.optionsResultComponentSetup<Icon, IIconOptions>(
          Icon,
          {
            labelValue: 'troll'
          },
          result
        );
        expect($$($$(test.cmp.element).find('.coveo-icon-caption-overlay')).text()).toBe('troll');
      });
    });
  });
}
