import * as Mock from '../MockEnvironment';
import { CardOverlay, ICardOverlayOptions } from '../../src/ui/CardOverlay/CardOverlay';
import { Simulate } from '../Simulate';
import { $$ } from '../../src/utils/Dom';

export function CardOverlayTest() {
  describe('CardOverlay', () => {
    let test: Mock.IBasicComponentSetup<CardOverlay>;
    let parentResult: HTMLElement;

    beforeEach(function () {
      test = Mock.advancedComponentSetup<CardOverlay>(CardOverlay, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: b => {
          parentResult = $$('div', { className: 'CoveoResult' }, $$('div')).el;
          return b.withElement(<HTMLElement>parentResult.firstChild);
        }
      });
    });

    afterEach(function () {
      test = null;
    });

    describe('exposes options', function () {
      it('title should put the title in the button and the overlay header', function () {
        test = Mock.advancedComponentSetup<CardOverlay>(CardOverlay, <Mock.AdvancedComponentSetupOptions>{
          modifyBuilder: b => {
            parentResult = $$('div', { className: 'CoveoResult' }, $$('div')).el;
            return b.withElement(<HTMLElement>parentResult.firstChild);
          },
          cmpOptions: {
            title: 'foobar'
          }
        });
        const label = $$(test.cmp.element).find('.coveo-label');
        const overlay = $$($$(parentResult).find('.coveo-card-overlay')).find('.coveo-label');
        expect(label.textContent).toBe('foobar');
        expect(overlay.textContent).toBe('foobar');
      });
    });

    it('should create an overlay on closest .CoveoResult', function () {
      expect($$(parentResult).find('.coveo-card-overlay')).not.toBeUndefined();
    });

    it('toggle should toggle between opening and closing the overlay', function () {
      const overlay = $$(parentResult).find('.coveo-card-overlay');
      expect($$(overlay).hasClass('coveo-opened')).not.toBe(true);
      test.cmp.toggleOverlay();
      expect($$(overlay).hasClass('coveo-opened')).toBe(true);
      test.cmp.toggleOverlay();
      expect($$(overlay).hasClass('coveo-opened')).not.toBe(true);
    });

  });
}
