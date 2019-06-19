import * as Mock from '../MockEnvironment';
import { NoopComponent } from '../../src/ui/NoopComponent/NoopComponent';
import { registerCustomMatcher } from '../CustomMatchers';
import { $$ } from '../../src/utils/Dom';
import { JQuery as $ } from '../JQueryModule';

export function ComponentEventsTest() {
  describe('ComponentEvent', () => {
    var test: Mock.IBasicComponentSetup<NoopComponent>;
    var spy: jasmine.Spy;

    beforeEach(function() {
      registerCustomMatcher();
      test = Mock.basicComponentSetup<NoopComponent>(NoopComponent);
      spy = jasmine.createSpy('spy');
    });

    afterEach(function() {
      test = null;
      spy = null;
    });

    it('should execute handler if the component is enabled', function() {
      test.cmp.enable();
      test.cmp.bind.onRootElement('foo', spy);
      $$(test.env.root).trigger('foo');
      expect(spy).toHaveBeenCalled();
      $$(test.env.root).trigger('foo', { bar: 'baz' });
      expect(spy).toHaveBeenCalledWith({ bar: 'baz' });
    });

    it('should execute handler with the originalEvent if its wrapped by jQuery and does not have any param', function() {
      // Setup.
      window['Coveo']['$'] = $;

      test.cmp.enable();
      test.cmp.bind.on(test.env.root, 'click', spy);

      // Trigger native click event, expecting it to be wrapped by jQuery.
      test.env.root.click();
      // It should call the spy with the native Event for first and only param.
      expect(spy).toHaveBeenCalled();
      expect(spy.calls.argsFor(0)[0] instanceof MouseEvent).toBeTruthy();
      expect((spy.calls.argsFor(0)[0] as MouseEvent).type).toBe('click');

      // Trigger jQuery click event, without any params.
      $(test.env.root).click();
      // It should call the spy without any params.
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy.calls.argsFor(1).length).toBe(0);

      // Trigger jQuery click event, with some param.
      $$(test.env.root).trigger('click', { bar: 'baz' });
      // It should call the spy with the aforementioned param.
      expect(spy).toHaveBeenCalledTimes(3);
      expect(spy).toHaveBeenCalledWith({ bar: 'baz' });

      // Clean-up.
      window['Coveo']['$'] = undefined;
    });

    it('should execute handler only once if the component is enabled', function() {
      test.cmp.enable();
      var spyOnce = jasmine.createSpy('spyOnce');
      test.cmp.bind.onRootElement('foo', spy);
      test.cmp.bind.oneRootElement('foo', spyOnce);
      $$(test.env.root).trigger('foo');
      $$(test.env.root).trigger('foo');
      $$(test.env.root).trigger('foo');
      expect(spy).toHaveBeenCalledTimes(3);
      expect(spyOnce).toHaveBeenCalledTimes(1);
    });

    it('should not execute handler if the component is disabled', function() {
      test.cmp.disable();
      test.cmp.bind.onRootElement('foo', spy);
      $$(test.env.root).trigger('foo');
      expect(spy).not.toHaveBeenCalled();
      $$(test.env.root).trigger('foo', { bar: 'baz' });
      expect(spy).not.toHaveBeenCalledWith({ bar: 'baz' });
    });

    it('should not execute handler only once if the component is disabled', function() {
      test.cmp.disable();
      test.cmp.bind.oneRootElement('foo', spy);
      $$(test.env.root).trigger('foo');
      $$(test.env.root).trigger('foo');
      $$(test.env.root).trigger('foo');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should trigger if the component is enabled', function() {
      test.cmp.enable();
      test.cmp.bind.onRootElement('foo', spy);
      test.cmp.bind.trigger(test.env.root, 'foo');
      expect(spy).toHaveBeenCalled();
      test.cmp.bind.trigger(test.env.root, 'foo', { bar: 'baz' });
      expect(spy).toHaveBeenCalledWith({ bar: 'baz' });
    });

    it('should not trigger if the component is disabled', function() {
      test.cmp.disable();
      $$(test.env.root).on('foo', spy);
      test.cmp.bind.trigger(test.env.root, 'foo');
      expect(spy).not.toHaveBeenCalled();

      test.cmp.bind.trigger(test.env.root, 'foo', { bar: 'baz' });
      expect(spy).not.eventHandlerToHaveBeenCalledWith({ bar: 'baz' });
    });
  });
}
