/// <reference path="../Test.ts" />

module Coveo {
  describe('ComponentEvent', () => {

    var test: Mock.IBasicComponentSetup<Components.NoopComponent>;
    var spy: jasmine.Spy;

    beforeEach(function () {
      registerCustomMatcher();
      test = Mock.basicComponentSetup<Components.NoopComponent>(Components.NoopComponent);
      spy = jasmine.createSpy('spy');
    });

    afterEach(function () {
      test = null;
      spy = null;
    });

    it('should execute handler if the component is enabled', function () {
      test.cmp.enable();
      test.cmp.bind.onRootElement('foo', spy);
      test.cmp.bind.onRootElement('foo', function () {
        console.log(arguments)
      });
      $$(test.env.root).trigger('foo');
      expect(spy).toHaveBeenCalled();
      $$(test.env.root).trigger('foo', { bar: 'baz' });
      expect(spy).toHaveBeenCalledWith({ bar: 'baz' });
    });

    it('should execute handler only once if the component is enabled', function () {
      test.cmp.enable();
      var spyOnce = jasmine.createSpy('spyOnce')
      test.cmp.bind.onRootElement('foo', spy);
      test.cmp.bind.oneRootElement('foo', spyOnce);
      $$(test.env.root).trigger('foo');
      $$(test.env.root).trigger('foo');
      $$(test.env.root).trigger('foo');
      expect(spy).toHaveBeenCalledTimes(3);
      expect(spyOnce).toHaveBeenCalledTimes(1);
    });

    it('should not execute handler if the component is disabled', function () {
      test.cmp.disable();
      test.cmp.bind.onRootElement('foo', spy);
      $$(test.env.root).trigger('foo');
      expect(spy).not.toHaveBeenCalled();
      $$(test.env.root).trigger('foo', { bar: 'baz' });
      expect(spy).not.toHaveBeenCalledWith({ bar: 'baz' });
    });

    it('should not execute handler only once if the component is disabled', function () {
      test.cmp.disable();
      test.cmp.bind.oneRootElement('foo', spy);
      $$(test.env.root).trigger('foo');
      $$(test.env.root).trigger('foo');
      $$(test.env.root).trigger('foo');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should trigger if the component is enabled', function () {
      test.cmp.enable();
      test.cmp.bind.onRootElement('foo', spy);
      test.cmp.bind.trigger(test.env.root, 'foo');
      expect(spy).toHaveBeenCalled();
      test.cmp.bind.trigger(test.env.root, 'foo', { bar: 'baz' });
      expect(spy).toHaveBeenCalledWith({ bar: 'baz' });
    });

    it('should not trigger if the component is disabled', function () {
      test.cmp.disable();
      $$(test.env.root).on('foo', spy);
      test.cmp.bind.trigger(test.env.root, 'foo');
      expect(spy).not.toHaveBeenCalled();

      test.cmp.bind.trigger(test.env.root, 'foo', { bar: 'baz' });
      expect(spy).not.eventHandlerToHaveBeenCalledWith({ bar: 'baz' });
    });
  })
}
