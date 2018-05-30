import { CardOverlay } from '../../src/ui/CardOverlay/CardOverlay';
import { $$ } from '../../src/utils/Dom';
import { Mock } from '../../testsFramework/TestsFramework';

export function CardOverlayTest() {
  describe('CardOverlay', () => {
    let test: Mock.IBasicComponentSetup<CardOverlay>;
    let parentResult: HTMLElement;

    beforeEach(() => {
      test = Mock.advancedComponentSetup<CardOverlay>(CardOverlay, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: b => {
          parentResult = $$('div', { className: 'CoveoResult' }, $$('div')).el;
          return b.withElement(<HTMLElement>parentResult.firstChild);
        }
      });
    });

    afterEach(() => {
      test = null;
    });

    describe('exposes options', () => {
      it('title should put the title in the button and the overlay header', () => {
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
      it('icon should put an icon in the button and the overlay header', () => {
        test = Mock.advancedComponentSetup<CardOverlay>(CardOverlay, <Mock.AdvancedComponentSetupOptions>{
          modifyBuilder: b => {
            parentResult = $$('div', { className: 'CoveoResult' }, $$('div')).el;
            return b.withElement(<HTMLElement>parentResult.firstChild);
          },
          cmpOptions: {
            icon: 'search'
          }
        });
        expect($$(test.cmp.element).find('.coveo-search-svg')).not.toBeNull();
        expect($$($$(parentResult).find('.coveo-card-overlay')).find('.coveo-search-svg')).not.toBeNull();
      });
    });

    it('should create an overlay on closest .CoveoResult', () => {
      expect($$(parentResult).find('.coveo-card-overlay')).not.toBeUndefined();
    });

    it('toggle should toggle between opening and closing the overlay', () => {
      const overlay = $$(parentResult).find('.coveo-card-overlay');
      expect($$(overlay).hasClass('coveo-opened')).not.toBe(true);
      test.cmp.toggleOverlay();
      expect($$(overlay).hasClass('coveo-opened')).toBe(true);
      test.cmp.toggleOverlay();
      expect($$(overlay).hasClass('coveo-opened')).not.toBe(true);
    });

    it('should transfer DOM elements from its body to the overlay', () => {
      test = Mock.advancedComponentSetup<CardOverlay>(CardOverlay, <Mock.AdvancedComponentSetupOptions>{
        modifyBuilder: b => {
          parentResult = $$('div', { className: 'CoveoResult' }).el;
          parentResult.innerHTML = `<div><span class="innerElement"></span></div>`;
          return b.withElement(<HTMLElement>parentResult.firstChild);
        }
      });
      const overlay = $$(parentResult).find('.coveo-card-overlay');

      expect($$(test.cmp.element).find('.innerElement')).toBeNull();
      expect($$(overlay).find('.innerElement')).not.toBeNull();
    });

    it('clicking the overlay button should call toggleOverlay', () => {
      spyOn(test.cmp, 'toggleOverlay');
      $$(test.cmp.element).trigger('click');
      expect(test.cmp.toggleOverlay).toHaveBeenCalledTimes(1);
    });

    it('clicking the overlay header should call toggleOverlay', () => {
      spyOn(test.cmp, 'toggleOverlay');
      const overlayHeader = $$(parentResult).find('.coveo-card-overlay-header');
      $$(overlayHeader).trigger('click');
      expect(test.cmp.toggleOverlay).toHaveBeenCalledTimes(1);
    });

    it('clicking the overlay footer should call toggleOverlay', () => {
      spyOn(test.cmp, 'toggleOverlay');
      const overlayFooter = $$(parentResult).find('.coveo-card-overlay-footer');
      $$(overlayFooter).trigger('click');
      expect(test.cmp.toggleOverlay).toHaveBeenCalledTimes(1);
    });
  });
}
