import * as Mock from '../MockEnvironment';
import { CardActionBar } from '../../src/ui/CardActionBar/CardActionBar';
import { $$ } from '../../src/utils/Dom';

export function CardActionBarTest() {
  describe('CardActionBar', () => {
    let test: Mock.IBasicComponentSetup<CardActionBar>;
    let parentResult: HTMLElement;

    beforeEach(function () {
      test = Mock.advancedComponentSetup<CardActionBar>(CardActionBar, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: b => {
          parentResult = $$('div', { className: 'CoveoResult' }, $$('div')).el;
          return b.withElement(<HTMLElement>parentResult.firstChild);
        }
      });
    });
    afterEach(() => parentResult = null);

    describe('exposes option', function () {
      describe('hidden set to true', function () {
        beforeEach(function () {
          test = Mock.advancedComponentSetup<CardActionBar>(CardActionBar, <Mock.AdvancedComponentSetupOptions>{
            modifyBuilder: b => {
              parentResult = $$('div', { className: 'CoveoResult' }, $$('div')).el;
              return b.withElement(<HTMLElement>parentResult.firstChild);
            },
            cmpOptions: {
              hidden: true
            }
          });
        });

        it('should show when parent result is clicked', function () {
          spyOn(test.cmp, 'show');
          $$(parentResult).trigger('click');
          expect(test.cmp.show).toHaveBeenCalledTimes(1);
        });

        it('should hide when mouse leaves parent result', function () {
          spyOn(test.cmp, 'hide');
          $$(parentResult).trigger('mouseleave');
          expect(test.cmp.hide).toHaveBeenCalledTimes(1);
        });

        it('should display an arrow indicator in its parent CoveoResult', function () {
          expect($$(parentResult).find('.coveo-card-action-bar-arrow-container')).not.toBeNull();
        });
      });

      describe('hidden set to false', function () {
        beforeEach(function () {
          test = Mock.advancedComponentSetup<CardActionBar>(CardActionBar, <Mock.AdvancedComponentSetupOptions>{
            modifyBuilder: b => {
              parentResult = $$('div', { className: 'CoveoResult' }, $$('div')).el;
              return b.withElement(<HTMLElement>parentResult.firstChild);
            },
            cmpOptions: {
              hidden: false
            }
          });
        });

        it('should always be hidden', function () {
          spyOn(test.cmp, 'show');
          $$(parentResult).trigger('click');
          expect(test.cmp.show).not.toHaveBeenCalled();
        });

        it('should not display an arrow indicator in its parent CoveoResult', function () {
          expect($$(parentResult).find('.coveo-card-action-bar-arrow-container')).toBeNull();
        });
      });

    });

    it('show should add coveo-opened class', function () {
      test.cmp.show();
      expect($$(test.cmp.element).hasClass('coveo-opened')).toBe(true);
    });

    it('hide should remove coveo-opened class', function () {
      test.cmp.show();
      test.cmp.hide();
      expect($$(test.cmp.element).hasClass('coveo-opened')).toBe(false);
    });
  });
}
