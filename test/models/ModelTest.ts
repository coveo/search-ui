module Coveo {
  describe('Model', function () {
    var model: Model;
    var div: HTMLDivElement;
    var env: Mock.IMockEnvironment;
    var bindings: IComponentBindings;

    beforeEach(function () {
      div = document.createElement('div');
      env = new Mock.MockEnvironmentBuilder().withRoot(div).build();
      registerCustomMatcher();
    })

    afterEach(function () {
      div = null;
      env = null;
      model = null;
    })


    describe('with basic setup', function () {
      var spy: jasmine.Spy;
      beforeEach(function () {
        model = new Model(div, 'test', {
          foo: 'bar'
        })
        spy = jasmine.createSpy('spy');
      })

      it('can be built with attributes', function () {
        expect(model.attributes).toEqual({
          foo: 'bar'
        })
      })

      it('will trigger event on changeOne', function () {
        $$(div).on('test:change:foo', spy);
        model.set('foo', 'new value');
        model.set('foo', 'new value');
        expect(spy).toHaveBeenCalledTimes(1);
      })

      it('will trigger event on change any', function () {
        $$(div).on('test:change', spy);
        model.registerNewAttribute('newAttr', 'something');
        model.set('foo', 'bar2');
        model.set('foo', 'bar3');
        model.set('newAttr', 'something else');
        model.set('newAttr', 'something else');
        expect(spy).toHaveBeenCalledTimes(3);
      })

      it('will trigger event on reset', function () {
        $$(div).on('test:reset', spy);
        model.reset();
        expect(spy).toHaveBeenCalledTimes(1);
      })

      it('will trigger event on all', function () {
        $$(div).on('test:all', spy);
        model.set('foo', 'bar2');
        model.reset();
        model.registerNewAttribute('newAttr', 'something');
        model.set('newAttr', 'booo');
        model.reset();
        expect(spy).toHaveBeenCalledTimes(4);
      })

      it('will throw on type mismatch', function () {
        expect(() => model.set('foo', 1)).toThrow();
        expect(() => model.set('foo', {})).toThrow();
        expect(() => model.set('foo', true)).toThrow();
        expect(() => model.set('foo', false)).toThrow();
      })

      it('can setMultiple', function () {
        model.registerNewAttribute('newAttr', 'newValue');
        model.setMultiple({
          foo: 'new stuff',
          newAttr: 'new stuff too'
        })
        expect(model.get('foo')).toBe('new stuff');
        expect(model.get('newAttr')).toBe('new stuff too');
      })

      it('can return all attributes that are not at their default state', function () {
        model.registerNewAttribute('newAttr', 'newValue');
        model.set('foo', 'new stuff');
        expect(model.getAttributes()).toEqual({
          'foo': 'new stuff'
        })
      })
    })
  })
}
