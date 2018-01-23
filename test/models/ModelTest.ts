import { Model } from '../../src/models/Model';
import * as Mock from '../MockEnvironment';
import { registerCustomMatcher } from '../CustomMatchers';
import { $$ } from '../../src/utils/Dom';

export function ModelTest() {
  describe('Model', function() {
    let model: Model;
    let div: HTMLDivElement;

    beforeEach(function() {
      div = document.createElement('div');
      new Mock.MockEnvironmentBuilder().withRoot(div).build();
      registerCustomMatcher();
    });

    afterEach(function() {
      div = null;
      model = null;
    });

    describe('with basic setup', function() {
      let spy: jasmine.Spy;
      beforeEach(function() {
        model = new Model(div, 'test', {
          foo: 'bar'
        });
        spy = jasmine.createSpy('spy');
      });

      it('can be built with attributes', function() {
        expect(model.attributes).toEqual({
          foo: 'bar'
        });
      });

      it('will trigger event on changeOne', function() {
        $$(div).on('test:change:foo', spy);
        model.set('foo', 'new value');
        model.set('foo', 'new value');
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('will trigger event on change any', function() {
        $$(div).on('test:change', spy);
        model.registerNewAttribute('newAttr', 'something');
        model.set('foo', 'bar2');
        model.set('foo', 'bar3');
        model.set('newAttr', 'something else');
        model.set('newAttr', 'something else');
        expect(spy).toHaveBeenCalledTimes(3);
      });

      it('will trigger event on reset', function() {
        $$(div).on('test:reset', spy);
        model.reset();
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('will trigger event on all', function() {
        $$(div).on('test:all', spy);
        model.set('foo', 'bar2');
        model.reset();
        model.registerNewAttribute('newAttr', 'something');
        model.set('newAttr', 'booo');
        model.reset();
        expect(spy).toHaveBeenCalledTimes(4);
      });

      it('will not throw on type mismatch', function() {
        expect(() => model.set('foo', 1)).not.toThrow();
        expect(() => model.set('foo', {})).not.toThrow();
        expect(() => model.set('foo', true)).not.toThrow();
        expect(() => model.set('foo', false)).not.toThrow();
      });

      it('can setMultiple', function() {
        model.registerNewAttribute('newAttr', 'newValue');
        model.setMultiple({
          foo: 'new stuff',
          newAttr: 'new stuff too'
        });
        expect(model.get('foo')).toBe('new stuff');
        expect(model.get('newAttr')).toBe('new stuff too');
      });

      it('can return all attributes that are not at their default state', function() {
        model.registerNewAttribute('newAttr', 'newValue');
        model.set('foo', 'new stuff');
        expect(model.getAttributes()).toEqual({
          foo: 'new stuff'
        });
      });

      it('keeps setting values after seeing a value with the wrong type', () => {
        model = new Model(div, 'test', {
          first: 'first',
          second: 'second',
          third: 'third'
        });
        let toSet = {
          first: [1],
          second: '2',
          third: '3'
        };

        model.setMultiple(toSet);

        expect(model.get('second')).toBe('2');
        expect(model.get('third')).toBe('3');
      });

      it('keeps the original value if the type is not correct', () => {
        let toSet = { foo: 1 };
        model.setMultiple(toSet);
        expect(model.get('foo')).toBe('bar');
      });
    });
  });
}
