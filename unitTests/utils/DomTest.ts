/// <reference path="../../lib/jasmine/index.d.ts" />
import { $$, Dom } from '../../src/utils/Dom';
import { registerCustomMatcher } from '../CustomMatchers';
import { Simulate } from '../Simulate';

interface IJQuery {
  Event: any;
}
declare const jQuery: IJQuery;

export function DomTests() {
  describe('Dom', () => {
    let el: HTMLElement;

    beforeEach(() => {
      el = document.createElement('div');
      registerCustomMatcher();
    });

    afterEach(() => {
      el = undefined;
    });

    describe('without jquery', () => {
      beforeEach(() => {
        // we want to test the basic event, not jquery one
        Simulate.removeJQuery();
      });

      afterEach(() => {
        Simulate.removeJQuery();
      });

      it('should detect supported event', () => {
        expect($$(el).canHandleEvent('scroll')).toBe(true);
        expect($$(el).canHandleEvent('click')).toBe(true);
      });

      it('should detect unsupported event', () => {
        expect($$(el).canHandleEvent('touchstart')).toBe(false);
        expect($$(el).canHandleEvent('touchend')).toBe(false);
        expect($$(el).canHandleEvent('foo')).toBe(false);
      });

      describe('when calling #isValidElement', () => {
        it('should respond true when a valid element is given', () => {
          const NORMAL_ELEMENT = document.createElement('div');
          expect($$(NORMAL_ELEMENT).isValid()).toBeTruthy();
        });

        it('should respond false when a invalid element is given', () => {
          const NOT_AN_ELEMENT = new Event('resize') as any;
          expect($$(NOT_AN_ELEMENT).isValid()).toBeFalsy();
        });

        it('should respond false when a locked element is given such as in a LockerService context', () => {
          const LOCKED_LOCKER_SERVICE_ELEMENT = {} as any;
          expect($$(LOCKED_LOCKER_SERVICE_ELEMENT).isValid()).toBeFalsy();
        });
      });

      describe('without custom event (IE11)', () => {
        let customEvent;
        beforeAll(() => {
          customEvent = CustomEvent;
          delete window['CustomEvent'];
        });

        afterAll(() => {
          window['CustomEvent'] = customEvent;
        });

        it('using trigger should work properly', () => {
          registerCustomMatcher();
          const spy = jasmine.createSpy('spy');
          new Dom(el).on('click', spy);
          new Dom(el).trigger('click');
          expect(spy).toHaveBeenCalled();

          const spy2 = jasmine.createSpy('spy2');
          new Dom(el).on('foo', spy2);
          new Dom(el).trigger('foo', { bar: 'baz' });
          expect(spy2).eventHandlerToHaveBeenCalledWith({ bar: 'baz' });
        });

        it('using "trigger" with a non alpha numeric character should work properly', () => {
          const spy = jasmine.createSpy('spy');
          el.addEventListener('thiscontainsspace', spy);

          new Dom(el).trigger('this contains space');
          expect(spy).toHaveBeenCalledTimes(1);
        });
      });

      it('insert after should work properly', () => {
        const parent = document.createElement('div');
        const sibling = document.createElement('div');
        parent.appendChild(sibling);
        expect(sibling.nextSibling).toBeNull();
        new Dom(el).insertAfter(sibling);
        expect(sibling.nextSibling).toBe(el);
        expect(sibling.previousSibling).toBeNull();

        const anotherSibling = document.createElement('div');
        parent.appendChild(anotherSibling);
        expect(el.nextSibling).toBe(anotherSibling);
        new Dom(el).insertAfter(anotherSibling);
        expect(el.nextSibling).toBeNull();
        expect(el.previousSibling).toBe(anotherSibling);
      });

      it('insert before should work properly', () => {
        const parent = document.createElement('div');
        const sibling = document.createElement('div');
        parent.appendChild(sibling);
        expect(sibling.nextSibling).toBeNull();
        new Dom(el).insertBefore(sibling);
        expect(sibling.nextSibling).toBeNull();
        expect(sibling.previousSibling).toBe(el);

        const anotherSibling = document.createElement('div');
        parent.appendChild(anotherSibling);
        expect(anotherSibling.nextSibling).toBeNull();
        expect(anotherSibling.previousSibling).toBe(sibling);
        new Dom(el).insertBefore(anotherSibling);
        expect(el.nextSibling).toBe(anotherSibling);
        expect(el.previousSibling).toBe(sibling);
      });

      it('replace should work properly', () => {
        const other = document.createElement('div');
        const sibling = document.createElement('div');
        const otherSibling = document.createElement('div');
        const parent = document.createElement('div');
        parent.appendChild(sibling);
        parent.appendChild(el);
        parent.appendChild(otherSibling);

        expect(el.parentNode).toBe(parent);
        expect(other.parentNode).toBeNull();
        expect(el.previousSibling).toBe(sibling);
        expect(el.nextSibling).toBe(otherSibling);
        new Dom(el).replaceWith(other);
        expect(el.parentNode).toBeNull();
        expect(other.parentNode).toBe(parent);
        expect(other.previousSibling).toBe(sibling);
        expect(other.nextSibling).toBe(otherSibling);
      });

      describe(`when calling #show`, () => {
        let div: HTMLElement;

        beforeEach(() => {
          div = document.createElement('div');
          $$(div).show();
        });

        it('sets display to an empty string', () => {
          expect(div.style.display).toBe('block');
        });

        it(`sets the aria-hidden attribute to 'false'`, () => {
          expect(div.getAttribute('aria-hidden')).toBe('false');
        });
      });

      describe(`when calling #hide`, () => {
        let div: HTMLElement;

        beforeEach(() => {
          div = document.createElement('div');
          $$(div).hide();
        });

        it(`sets display to 'none'`, () => {
          expect(div.style.display).toBe('none');
        });

        it(`sets the aria-hidden attribute to 'true'`, () => {
          expect(div.getAttribute('aria-hidden')).toBe('true');
        });
      });

      describe(`when calling #unhide`, () => {
        let div: HTMLElement;

        beforeEach(() => {
          div = document.createElement('div');
          $$(div).unhide();
        });

        it('sets display to an empty string', () => {
          expect(div.style.display).toBe('');
        });

        it(`sets the aria-hidden attribute to 'false'`, () => {
          expect(div.getAttribute('aria-hidden')).toBe('false');
        });
      });

      describe('prepend', () => {
        it('should work properly', () => {
          const firstChild = document.createElement('div');
          el.appendChild(firstChild);
          expect(el.firstChild).toBe(firstChild);

          const toPrepend = document.createElement('div');
          new Dom(el).prepend(toPrepend);
          expect(el.firstChild).toBe(toPrepend);
          expect(toPrepend.nextSibling).toBe(firstChild);
        });

        it('should work even if there if parent element is empty', () => {
          const parent = $$('div');
          const toPrepend = $$('span', { className: 'foo' }).el;
          parent.prepend(toPrepend);
          expect(parent.el.firstChild).toBe(toPrepend);
        });

        it('should work even if parent element contains text', () => {
          const parent = $$('div', {}, 'thisissometext');
          const toPrepend = $$('span', { className: 'foo' }).el;
          parent.prepend(toPrepend);
          expect(parent.el.firstChild).toBe(toPrepend);
        });
      });

      it('should give the correct text content', () => {
        el.innerHTML = '<div>this is the content</div>';
        expect(new Dom(el).text()).toEqual('this is the content');
        el = document.createElement('div');
        el.innerHTML = '<div>this <span>is</span> the <div><span>content</span></div></div>';
        expect(new Dom(el).text()).toEqual('this is the content');
      });

      it('should allow to set the text content', () => {
        new Dom(el).text('this is the content');
        expect(el.innerHTML).toEqual('this is the content');

        /// Setting HTML content as text should still work
        el = document.createElement('div');
        new Dom(el).text('<div>this is the content</div>');
        expect(el.childNodes[0].nodeValue).toEqual('<div>this is the content</div>');
      });

      describe('createElement', () => {
        it('should properly create a single HTMLElement', () => {
          const elem = Dom.createElement(
            'div',
            {
              id: 'heidi',
              className: 'kloss',
              'data-my-attr': 'baz'
            },
            'foobar2000'
          );
          expect(elem.tagName).toEqual('DIV');
          expect(elem.id).toEqual('heidi');
          expect(elem.className).toEqual('kloss');
          expect(elem.dataset['myAttr']).toEqual('baz');
          expect(elem.innerHTML).toEqual('foobar2000');
        });

        it("should properly create nested HTMLElement's", () => {
          const elem = Dom.createElement(
            'header',
            undefined,
            Dom.createElement('div', undefined, Dom.createElement('span', undefined, 'foo'))
          );
          expect(elem.tagName).toEqual('HEADER');
          expect(elem.firstChild.nodeName).toEqual('DIV');
          expect(elem.firstChild.firstChild.nodeName).toEqual('SPAN');
          expect(elem.firstChild.firstChild['innerHTML']).toEqual('foo');
        });
      });

      it('should find a child using a query selector', () => {
        let toFind = document.createElement('div');
        toFind.className = 'qwerty';
        el.appendChild(toFind);
        expect(new Dom(el).find('.qwerty')).toBe(toFind);

        el = document.createElement('div');
        toFind = document.createElement('div');
        toFind.className = 'qwerty notqwerty';
        el.appendChild(toFind);
        expect(new Dom(el).find('.qwerty')).toBe(toFind);

        el = document.createElement('div');
        toFind = document.createElement('div');
        toFind.id = 'qwerty';
        el.appendChild(toFind);
        expect(new Dom(el).find('#qwerty')).toBe(toFind);

        el = document.createElement('div');
        const inner = document.createElement('div');
        toFind = document.createElement('div');
        toFind.id = 'qwerty';
        inner.appendChild(toFind);
        el.appendChild(inner);
        expect(new Dom(el).find('#qwerty')).toBe(toFind);
      });

      it('should find all child using a query selector', () => {
        const toFind = document.createElement('div');
        toFind.className = 'qwerty';
        const toFind2 = document.createElement('div');
        toFind2.className = 'qwerty notqwerty';
        el.appendChild(toFind);
        el.appendChild(toFind2);
        expect(new Dom(el).findAll('.qwerty')).toContain(toFind);
        expect(new Dom(el).findAll('.qwerty')).toContain(toFind2);
      });

      it('using findClass should find the child element', () => {
        const toFind = document.createElement('div');
        toFind.className = 'qwerty';
        const toFind2 = document.createElement('div');
        toFind2.className = 'qwerty notqwerty';
        toFind2.id = 'shouldNotBeFound';
        el.appendChild(toFind);
        el.appendChild(toFind2);
        expect(new Dom(el).findClass('qwerty')).toContain(toFind);
        expect(new Dom(el).findClass('qwerty')).toContain(toFind2);
        expect(new Dom(el).findClass('shouldNotBeFound').length).toBe(0);
      });

      it('using isVisible should work if the element is display:none', () => {
        el.style.display = 'none';
        expect(new Dom(el).isVisible()).toBeFalsy();
      });

      it('using isVisible should work if the element is visibility:hidden', () => {
        el.style.display = 'none';
        expect(new Dom(el).isVisible()).toBeFalsy();
      });

      it("using isVisible should work if the element has 'coveo-tab-disabled' added by tab(s)", () => {
        el.className = 'coveo-tab-disabled';
        expect(new Dom(el).isVisible()).toBeFalsy();
      });

      it('using isVisible should work if the element is not display:none', () => {
        el.style.display = 'block';
        expect(new Dom(el).isVisible()).toBeTruthy();
      });

      it('using isVisible should work if the element is not visibility hidden', () => {
        el.style.visibility = 'visible';
        expect(new Dom(el).isVisible()).toBeTruthy();
      });

      it('using isVisible should work if the element does not have a specific css class added by tab(s)', () => {
        el.className = 'totally-not-coveo-tab-disabled';
        expect(new Dom(el).isVisible()).toBeTruthy();
      });

      it('using addClass should work properly', () => {
        el.className = 'qwerty';
        new Dom(el).addClass('notqwerty');
        expect(el.className).toBe('qwerty notqwerty');

        el = document.createElement('div');
        el.className = 'qwerty';
        new Dom(el).addClass('qwerty');
        expect(el.className).toBe('qwerty');

        el = document.createElement('div');
        new Dom(el).addClass('qwerty');
        expect(el.className).toBe('qwerty');

        el = document.createElement('div');
        new Dom(el).addClass(['a', 'b', 'c']);
        expect(el.className).toBe('a b c');
      });

      it('using removeClass should work properly', () => {
        el.className = 'qwerty';
        new Dom(el).removeClass('qwerty');
        expect(el.className).toBe('');

        el = document.createElement('div');
        el.className = 'qwerty notqwerty';
        new Dom(el).removeClass('qwerty');
        expect(el.className).toBe('notqwerty');

        el = document.createElement('div');
        el.className = 'qwerty notqwerty';
        new Dom(el).removeClass('notqwerty');
        expect(el.className).toBe('qwerty');

        el = document.createElement('div');
        new Dom(el).removeClass('qwerty');
        expect(el.className).toBe('');

        el = document.createElement('div');
        el.className = 'popoqwerty qwerty notqwerty';
        new Dom(el).removeClass('qwerty');
        expect(el.className).toBe('popoqwerty notqwerty');
      });

      it('using removeClass should work properly if we are removing part of a an existing class name', () => {
        el.className = 'a-b-c';
        new Dom(el).removeClass('a');
        expect(el.className).toBe('a-b-c');

        new Dom(el).removeClass('-b-');
        expect(el.className).toBe('a-b-c');

        new Dom(el).removeClass('a-b-');

        expect(el.className).toBe('a-b-c');

        new Dom(el).removeClass('a-b-c');
        expect(el.className).toBe('');
      });

      it('using getClass should return the correct array with all classes', () => {
        el.className = 'qwerty';
        expect(new Dom(el).getClass()).toContain('qwerty');

        el = document.createElement('div');
        el.className = 'qwerty notqwerty';
        expect(new Dom(el).getClass()).toContain('qwerty');
        expect(new Dom(el).getClass()).toContain('notqwerty');
      });

      it('using hasClass should return properly', () => {
        el.className = 'qwerty';
        expect(new Dom(el).hasClass('qwerty')).toBe(true);

        el = document.createElement('div');
        el.className = 'qwerty notqwerty qwerty';
        expect(new Dom(el).hasClass('qwerty')).toBe(true);

        el = document.createElement('div');
        el.className = 'qwerty notqwerty qwerty';
        expect(new Dom(el).hasClass(' ')).toBe(false);

        el = document.createElement('div');
        el.className = 'qwerty notqwerty qwerty';
        expect(new Dom(el).hasClass('')).toBe(false);

        el = document.createElement('div');
        el.className = 'qwerty';
        expect(new Dom(el).hasClass('notqwerty')).toBe(false);

        el = document.createElement('div');
        expect(new Dom(el).hasClass('')).toBe(false);

        el = document.createElement('div');
        expect(new Dom(el).hasClass('qwerty')).toBe(false);
      });

      it('using toggleClass without switch should work properly', () => {
        el.className = 'qwerty';
        let domEl = new Dom(el);
        domEl.toggleClass('qwerty');
        expect(domEl.hasClass('qwerty')).toBe(false);

        el = document.createElement('div');
        domEl = new Dom(el);
        domEl.toggleClass('foobar2000');
        expect(domEl.hasClass('foobar2000')).toBe(true);
      });

      it('using toggleClass with switch should work properly', () => {
        let domEl = new Dom(el);
        domEl.toggleClass('qwerty', false);
        expect(domEl.hasClass('qwerty')).toBe(false);

        domEl = new Dom(document.createElement('div'));
        domEl.addClass('foobar2000');
        domEl.toggleClass('foobar2000', true);
        expect(domEl.hasClass('foobar2000')).toBe(true);
      });

      it('using detach should work properly', () => {
        const parent = document.createElement('div');
        parent.appendChild(el);
        expect(parent.children).toContain(el);

        new Dom(el).detach();
        expect(parent.children).not.toContain(el);
      });

      it('using on should work properly', () => {
        const spy = jasmine.createSpy('spy');
        new Dom(el).on('click', spy);
        el.click();
        expect(spy).toHaveBeenCalled();

        const spy2 = jasmine.createSpy('spy2');
        new Dom(el).on('foo', spy2);
        const event = new CustomEvent('foo', {
          detail: {
            lorem: 'ipsum'
          }
        });

        el.dispatchEvent(event);
        expect(spy2).toHaveBeenCalledWith(event, event.detail);

        const spy3 = jasmine.createSpy('spy3');
        new Dom(el).on(['1', '2', '3'], spy3);
        const events = ['1', '2', '3'].map(evt => {
          return new CustomEvent(evt);
        });
        events.forEach(evt => {
          el.dispatchEvent(evt);
        });
        expect(spy3).toHaveBeenCalledTimes(3);
      });

      it('using one should work properly', () => {
        const spy = jasmine.createSpy('spy');
        new Dom(el).one('click', spy);
        el.click();
        el.click();
        el.click();
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('after calling off the event handler should not be called', () => {
        const spy = jasmine.createSpy('spy');
        new Dom(el).on('click', spy);
        new Dom(el).off('click', spy);
        el.click();
        expect(spy).not.toHaveBeenCalled();

        const spy2 = jasmine.createSpy('spy2');
        new Dom(el).on(['1', '2', '3'], spy2);
        const events = ['1', '2', '3'].map(evt => {
          return new CustomEvent(evt);
        });
        new Dom(el).off(['1', '2', '3'], spy2);
        events.forEach(evt => {
          el.dispatchEvent(evt);
        });
        expect(spy).not.toHaveBeenCalled();
      });

      it('using trigger should work properly', () => {
        registerCustomMatcher();
        const spy = jasmine.createSpy('spy');
        new Dom(el).on('click', spy);
        new Dom(el).trigger('click');
        expect(spy).toHaveBeenCalled();

        const spy2 = jasmine.createSpy('spy2');
        new Dom(el).on('foo', spy2);
        new Dom(el).trigger('foo', { bar: 'baz' });
        expect(spy2).eventHandlerToHaveBeenCalledWith({ bar: 'baz' });
      });

      it('using "on" with a non alpha numeric character should work properly', () => {
        const spy = jasmine.createSpy('spy');
        new Dom(el).on('this contains space', spy);
        const event = new CustomEvent('thiscontainsspace');

        el.dispatchEvent(event);
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('using "on" with multiple non alpha numeric character events should work properly', () => {
        const spy = jasmine.createSpy('spy');
        new Dom(el).on(['this contains space', 'this:contains space too'], spy);
        const event = new CustomEvent('thiscontainsspace');
        const event2 = new CustomEvent('this:containsspacetoo');

        el.dispatchEvent(event);
        el.dispatchEvent(event2);
        expect(spy).toHaveBeenCalledTimes(2);
      });

      it('using "one" with a non alpha numeric character should work properly', () => {
        const spy = jasmine.createSpy('spy');
        new Dom(el).one('this contains space', spy);
        const event = new CustomEvent('thiscontainsspace');

        el.dispatchEvent(event);
        el.dispatchEvent(event);
        el.dispatchEvent(event);
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('using "trigger" with a non alpha numeric character should work properly', () => {
        const spy = jasmine.createSpy('spy');
        el.addEventListener('thiscontainsspace', spy);

        new Dom(el).trigger('this contains space');
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('using isEmpty should work properly', () => {
        expect(new Dom(el).isEmpty()).toBe(true);
        el.appendChild(document.createElement('div'));
        expect(new Dom(el).isEmpty()).toBe(false);

        el = document.createElement('div');
        el.innerHTML = '        ';
        expect(new Dom(el).isEmpty()).toBe(true);
      });

      it('should find ancestor element using closest', () => {
        const root = document.createElement('div');
        root.className = 'findme';
        root.appendChild(el);
        expect(new Dom(el).closest('findme')).toBe(root);
      });

      it('should find the first ancestor element using parent', () => {
        const root = document.createElement('div');
        const parentOne = $$('div', { className: 'foo' });
        const parentTwo = $$('div', { className: 'foo' });
        const parentThree = $$('div', { className: 'foo' });

        const child = $$('div');

        root.appendChild(parentOne.el);
        parentOne.append(parentTwo.el);
        parentTwo.append(parentThree.el);
        parentThree.append(child.el);

        expect(child.parent('foo')).toEqual(parentThree.el);
      });

      it('should not throw if there are no parent element using parent', () => {
        const root = $$('div');
        expect(() => root.parent('bar')).not.toThrow();
      });

      it('should return undefined if there is no match using parent', () => {
        const root = document.createElement('div');
        const parentOne = $$('div', { className: 'foo' });
        const parentTwo = $$('div', { className: 'foo' });
        const parentThree = $$('div', { className: 'foo' });

        const child = $$('div');

        root.appendChild(parentOne.el);
        parentOne.append(parentTwo.el);
        parentTwo.append(parentThree.el);
        parentThree.append(child.el);

        expect(child.parent('bar')).toBeUndefined();
      });

      it('should find all ancestor elements using parents', () => {
        const root = document.createElement('div');
        const parentOne = $$('div', { className: 'foo' });
        const parentTwo = $$('div', { className: 'foo' });
        const parentThree = $$('div', { className: 'foo' });

        const child = $$('div');

        root.appendChild(parentOne.el);
        parentOne.append(parentTwo.el);
        parentTwo.append(parentThree.el);
        parentThree.append(child.el);

        expect(child.parents('foo')).toEqual([parentThree.el, parentTwo.el, parentOne.el]);
      });

      it('should return empty array if there is no match using parents', () => {
        const root = document.createElement('div');
        const parentOne = $$('div', { className: 'foo' });
        const parentTwo = $$('div', { className: 'foo' });
        const parentThree = $$('div', { className: 'foo' });

        const child = $$('div');

        root.appendChild(parentOne.el);
        parentOne.append(parentTwo.el);
        parentTwo.append(parentThree.el);
        parentThree.append(child.el);

        expect(child.parents('bar')).toEqual([]);
      });

      it('should not fail if there is no parent element using parents', () => {
        const root = $$('div');
        expect(() => root.parents('bar')).not.toThrow();
      });

      it('should be able to tell if an element matches a selector', () => {
        el = document.createElement('div');
        el.className = 'foo bar foobar';
        el.setAttribute('id', 'batman');

        expect(new Dom(el).is('div')).toBe(true);
        expect(new Dom(el).is('.foo')).toBe(true);
        expect(new Dom(el).is('.foobar')).toBe(true);
        expect(new Dom(el).is('#batman')).toBe(true);

        // no leading point for class
        expect(new Dom(el).is('foo')).toBe(false);
        // no leading # for id
        expect(new Dom(el).is('batman')).toBe(false);
        // class does not exists
        expect(new Dom(el).is('nope')).toBe(false);
        // not the correct tag
        expect(new Dom(el).is('input')).toBe(false);
      });

      it('should be able to empty an element', () => {
        const append1 = document.createElement('div');
        const append2 = document.createElement('div');
        el.appendChild(append1);
        el.appendChild(append2);
        expect(append1.parentElement).toBe(el);
        expect(append2.parentElement).toBe(el);
        new Dom(el).empty();
        expect(append1.parentElement).toBeNull();
        expect(append2.parentElement).toBeNull();
      });
    });

    describe('with jquery', () => {
      beforeEach(() => {
        // we want to test the basic event, not jquery one
        Simulate.addJQuery();
      });

      afterEach(() => {
        Simulate.removeJQuery();
      });

      describe('with native set to true', () => {
        beforeEach(() => {
          Dom.useNativeJavaScriptEvents = true;
        });

        afterEach(() => {
          Dom.useNativeJavaScriptEvents = false;
        });

        it('when using "on" to bind a click event, when triggering a click, it calls the click handler', () => {
          const spy = jasmine.createSpy('spy');
          new Dom(el).on('click', spy);
          el.click();
          expect(spy).toHaveBeenCalled();
        });

        it('when using "on" to bind a custom event, when triggering the custom event with a payload, it calls the handler with the payload', () => {
          const spy2 = jasmine.createSpy('spy2');
          const test = { detail: { lorem: 'ipsum' } };
          new Dom(el).on('foo', spy2);
          new Dom(el).trigger('foo', test);

          expect(spy2).toHaveBeenCalledWith(jasmine.any(Event), jasmine.objectContaining(test));
        });

        it('when using "on" to bind three different events having the same handler, when triggering the three events, it calls the handler three times', () => {
          const spy3 = jasmine.createSpy('spy3');
          const eventNames = ['1', '2', '3'];
          new Dom(el).on(eventNames, spy3);
          eventNames.map(evt => new CustomEvent(evt)).forEach(evt => el.dispatchEvent(evt));
          expect(spy3).toHaveBeenCalledTimes(3);
        });

        it('using "on" with non alpha numeric character should work properly', () => {
          const spy = jasmine.createSpy('spy');
          new Dom(el).on('this contains space', spy);
          new Dom(el).trigger('thiscontainsspace');
          expect(spy).toHaveBeenCalledTimes(1);
        });

        it('using "one" should work properly', () => {
          const spy = jasmine.createSpy('spy');
          new Dom(el).one('click', spy);
          el.click();
          el.click();
          el.click();
          expect(spy).toHaveBeenCalled();
          expect(spy).toHaveBeenCalledTimes(1);
        });

        it('using "one" with non alpha numeric character should work properly', () => {
          const spy = jasmine.createSpy('spy');
          new Dom(el).one('this contains space', spy);
          new Dom(el).trigger('thiscontainsspace');
          new Dom(el).trigger('thiscontainsspace');
          new Dom(el).trigger('thiscontainsspace');
          expect(spy).toHaveBeenCalledTimes(1);
        });

        it('using "off" should work properly', () => {
          const spy = jasmine.createSpy('spy');
          new Dom(el).on('test', spy);
          new Dom(el).off('test', spy);
          el.dispatchEvent(new CustomEvent('test'));
          expect(spy).not.toHaveBeenCalled();
        });

        it('using "trigger" should work properly', () => {
          const spy = jasmine.createSpy('spy');
          new Dom(el).on('click', spy);
          new Dom(el).trigger('click');
          expect(spy).toHaveBeenCalled();

          const spy2 = jasmine.createSpy('spy2');
          new Dom(el).on('foo', spy2);
          new Dom(el).trigger('foo', { bar: 'baz' });
          expect(spy2).toHaveBeenCalledWith(jasmine.any(Event), { bar: 'baz' });
        });

        it('using "trigger" with non alpha numeric character should work properly', () => {
          const spy = jasmine.createSpy('spy');
          new Dom(el).on('thiscontainsspace', spy);
          new Dom(el).trigger('this contains space');
          expect(spy).toHaveBeenCalledTimes(1);
        });
      });

      it('using "on" should work properly', () => {
        const spy = jasmine.createSpy('spy');
        new Dom(el).on('click', spy);
        el.click();
        expect(spy).toHaveBeenCalled();

        const spy2 = jasmine.createSpy('spy2');
        new Dom(el).on('foo', spy2);
        new Dom(el).trigger('foo', {
          detail: {
            lorem: 'ipsum'
          }
        });

        expect(spy2).toHaveBeenCalledWith(
          jasmine.any(jQuery.Event),
          jasmine.objectContaining({
            detail: {
              lorem: 'ipsum'
            }
          })
        );

        const spy3 = jasmine.createSpy('spy3');
        new Dom(el).on(['1', '2', '3'], spy3);
        const events = ['1', '2', '3'].map(evt => {
          return new CustomEvent(evt);
        });
        events.forEach(evt => {
          el.dispatchEvent(evt);
        });
        expect(spy3).toHaveBeenCalledTimes(3);
      });

      it('using "on" with non alpha numeric character should work properly', () => {
        const spy = jasmine.createSpy('spy');
        new Dom(el).on('this contains space', spy);
        window['Coveo']['$'](el).trigger('thiscontainsspace');
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('using "one" should work properly', () => {
        const spy = jasmine.createSpy('spy');
        new Dom(el).one('click', spy);
        el.click();
        el.click();
        el.click();
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('using "one" with non alpha numeric character should work properly', () => {
        const spy = jasmine.createSpy('spy');
        new Dom(el).one('this contains space', spy);
        window['Coveo']['$'](el).trigger('thiscontainsspace');
        window['Coveo']['$'](el).trigger('thiscontainsspace');
        window['Coveo']['$'](el).trigger('thiscontainsspace');
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('using "off" should work properly', () => {
        const spy = jasmine.createSpy('spy');
        new Dom(el).on('click', spy);
        new Dom(el).off('click', spy);
        el.click();
        expect(spy).not.toHaveBeenCalled();

        const spy2 = jasmine.createSpy('spy2');
        new Dom(el).on(['1', '2', '3'], spy2);
        new Dom(el).off(['1', '2', '3'], spy2);
        ['1', '2', '3'].forEach(evt => {
          new Dom(el).trigger(evt);
        });
        expect(spy).not.toHaveBeenCalled();
      });

      it('using "trigger" should work properly', () => {
        const spy = jasmine.createSpy('spy');
        new Dom(el).on('click', spy);
        new Dom(el).trigger('click');
        expect(spy).toHaveBeenCalled();

        const spy2 = jasmine.createSpy('spy2');
        new Dom(el).on('foo', spy2);
        new Dom(el).trigger('foo', { bar: 'baz' });
        expect(spy2).toHaveBeenCalledWith(jasmine.any(jQuery.Event), { bar: 'baz' });
      });

      it('using "trigger" with non alpha numeric character should work properly', () => {
        const spy = jasmine.createSpy('spy');
        window['Coveo']['$'](el).on('thiscontainsspace', spy);
        new Dom(el).trigger('this contains space');
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });
}
