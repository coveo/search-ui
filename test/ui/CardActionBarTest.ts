import * as Mock from '../MockEnvironment';
import { CardActionBar, ICardActionBarOptions } from '../../src/ui/CardActionBar/CardActionBar';
import { Simulate } from '../Simulate';
import { $$ } from '../../src/utils/Dom';

export function CardActionBarTest() {
  describe('CardActionBar', () => {
    let test: Mock.IBasicComponentSetup<CardActionBar>;
    let parentResult: HTMLElement;

    beforeEach(function () {
      test = Mock.advancedComponentSetup<CardActionBar>(CardActionBar, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: b => {
          parentResult = $$('div', { className: 'CoveoResult'}, $$('div')).el;
          return b.withElement(<HTMLElement>parentResult.firstChild);
        }
      });
    });
    afterEach(() => parentResult = null);

    describe('exposes option', function () {
      it('hidden set to true should show when parent result is clicked', function () {
        test = Mock.advancedComponentSetup<CardActionBar>(CardActionBar, <Mock.AdvancedComponentSetupOptions>{
          modifyBuilder: b => {
            parentResult = $$('div', { className: 'CoveoResult'}, $$('div')).el;
            return b.withElement(<HTMLElement>parentResult.firstChild);
          },
          cmpOptions: {
            hidden: true
          }
        });
        spyOn(test.cmp, 'show');
        $$(parentResult).trigger('click');
        expect(test.cmp.show).toHaveBeenCalledTimes(1);
      });

      it('hidden set to false should always be hidden', function () {
        test = Mock.advancedComponentSetup<CardActionBar>(CardActionBar, <Mock.AdvancedComponentSetupOptions>{
          modifyBuilder: b => {
            parentResult = $$('div', { className: 'CoveoResult'}, $$('div')).el;
            return b.withElement(<HTMLElement>parentResult.firstChild);
          },
          cmpOptions: {
            hidden: false
          }
        });
        spyOn(test.cmp, 'show');
        $$(parentResult).trigger('click');
        expect(test.cmp.show).not.toHaveBeenCalled();
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
