import { Utils } from '../../src/Core';
import { attachShadow } from '../../src/misc/AttachShadowPolyfill';
import { $$ } from '../../src/utils/Dom';

export function AttachShadowPolyfillTest() {
  describe('AttachShadowPolyfill', () => {
    let element: HTMLElement;
    let shadowRoot: HTMLElement;
    let onSizeChangedSpy: jasmine.Spy;

    function appendHeightElement() {
      shadowRoot.appendChild($$('div', { style: 'height: 200px;' }).el);
    }

    beforeEach(async done => {
      element = $$('div').el;
      document.body.appendChild(element);
      shadowRoot = await attachShadow(element, {
        mode: 'open',
        title: 'hello',
        onSizeChanged: onSizeChangedSpy = jasmine.createSpy('onSizeChanged')
      });
      done();
    });

    afterEach(() => {
      element.remove();
    });

    it("doesn't call onSizeChanged initially", () => {
      expect(onSizeChangedSpy).not.toHaveBeenCalled();
    });

    it('calls onSizeChanged when content is added', async done => {
      appendHeightElement();
      await Utils.resolveAfter(0);
      expect(onSizeChangedSpy).toHaveBeenCalledTimes(1);
      appendHeightElement();
      await Utils.resolveAfter(0);
      expect(onSizeChangedSpy).toHaveBeenCalledTimes(2);
      done();
    });
  });
}
