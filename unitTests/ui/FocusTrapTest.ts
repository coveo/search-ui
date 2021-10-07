import { Dom, $$ } from '../../src/utils/Dom';
import { FocusTrap } from '../../src/ui/FocusTrap/FocusTrap';
import { Defer } from '../../src/Core';

export function FocusTrapTest() {
  describe('FocusTrap', () => {
    function mockFocusInEvent(oldElement: HTMLElement, newElement: HTMLElement) {
      return (<Partial<FocusEvent>>{
        type: 'focusin',
        target: newElement,
        relatedTarget: oldElement
      }) as FocusEvent;
    }

    function mockFocusOutEvent(oldElement: HTMLElement, newElement: HTMLElement) {
      return (<Partial<FocusEvent>>{
        type: 'focusout',
        target: oldElement,
        relatedTarget: newElement
      }) as FocusEvent;
    }

    function addSpy(element: Dom) {
      spyOn(element.el, 'focus').and.callFake(() => {
        focusTrap['onFocusIn'](mockFocusInEvent(currentlyActiveElement, element.el));
        if (currentlyActiveElement) {
          focusTrap['onFocusOut'](mockFocusOutEvent(currentlyActiveElement, element.el));
        }
        currentlyActiveElement = element.el;
      });
    }

    function buildTabIndexDiv(id: string) {
      const element = $$('div', { id });
      element.el.tabIndex = 0;
      addSpy(element);
      return element;
    }

    function buildButton(id: string) {
      const element = $$('button', { id });
      addSpy(element);
      return element;
    }

    function buildEnvironment() {
      rootContainer = $$(
        'div',
        {},
        (firstOuterFocusableElement = buildButton('out-first')),
        (trapContainer = $$(
          'div',
          {},
          ...(trappedFocusableElements = [buildTabIndexDiv('in-first'), buildButton('in-second'), buildTabIndexDiv('in-third')])
        )),
        (lastOuterFocusableElement = buildTabIndexDiv('out-last'))
      );
    }

    function expectSelection(actual: Dom | HTMLElement) {
      return new Promise(resolve => {
        Defer.defer(() => {
          const actualElement = actual instanceof Dom ? actual.el : actual;
          expect(actualElement.focus).toHaveBeenCalledTimes(1);
          expect(currentlyActiveElement.id).toBe(actualElement.id);
          resolve();
        });
      });
    }

    let rootContainer: Dom;
    let firstOuterFocusableElement: Dom;
    let lastOuterFocusableElement: Dom;
    let trapContainer: Dom;
    let trappedFocusableElements: Dom[];
    let focusTrap: FocusTrap;
    let currentlyActiveElement: HTMLElement;
    beforeEach(() => {
      buildEnvironment();
      document.body.appendChild(rootContainer.el);
      focusTrap = new FocusTrap(trapContainer.el);
      currentlyActiveElement = null;
    });

    afterEach(() => {
      rootContainer.remove();
      focusTrap.disable();
    });

    it('sets aria-hidden on every sibling', () => {
      expect(rootContainer.findAll('[aria-hidden="true"]')).toEqual([firstOuterFocusableElement.el, lastOuterFocusableElement.el]);
    });

    describe('when initially focusing an element outside the container', () => {
      it('selects the first element in the trapped container if the focused element is before the trapped container', async done => {
        firstOuterFocusableElement.el.focus();
        await expectSelection(trappedFocusableElements[0]);
        done();
      });

      it('selects the first element in the trapped container if the focused element is after the trapped container', async done => {
        lastOuterFocusableElement.el.focus();
        await expectSelection(trappedFocusableElements[0]);
        done();
      });
    });

    describe('when initially focusing the first element', () => {
      beforeEach(() => {
        trappedFocusableElements[0].el.focus();
      });

      it('allows the next element to be focused', async done => {
        trappedFocusableElements[1].el.focus();
        await expectSelection(trappedFocusableElements[1]);
        done();
      });

      it('focuses the next element if an element after the trapped container is focused', async done => {
        lastOuterFocusableElement.el.focus();
        await expectSelection(trappedFocusableElements[1]);
        done();
      });

      it('wraps the selection if an element before the trapped container is focused', async done => {
        firstOuterFocusableElement.el.focus();
        await expectSelection(trappedFocusableElements[2]);
        done();
      });
    });

    describe('when initially focusing the last element', () => {
      beforeEach(() => {
        trappedFocusableElements[2].el.focus();
      });

      it('allows the previous element to be focused', async done => {
        trappedFocusableElements[1].el.focus();
        await expectSelection(trappedFocusableElements[1]);
        done();
      });

      it('focuses the previous element if an element before the trapped container is focused', async done => {
        firstOuterFocusableElement.el.focus();
        await expectSelection(trappedFocusableElements[1]);
        done();
      });

      it('wraps the selection if an element after the trapped container is focused', async done => {
        lastOuterFocusableElement.el.focus();
        await expectSelection(trappedFocusableElements[0]);
        done();
      });
    });

    describe('when disabled', () => {
      beforeEach(() => {
        focusTrap.disable();
      });

      it('should not prevent selection outside the trapped container', async done => {
        firstOuterFocusableElement.el.focus();
        await expectSelection(firstOuterFocusableElement);
        lastOuterFocusableElement.el.focus();
        await expectSelection(lastOuterFocusableElement);
        done();
      });

      it('removes aria-hidden from every element', () => {
        expect(rootContainer.findAll('[aria-hidden]').length).toEqual(0);
      });
    });
  });
}
