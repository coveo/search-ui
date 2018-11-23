import { Debug } from '../../src/ui/Debug/Debug';
import { $$ } from '../../src/utils/Dom';
import * as Mock from '../MockEnvironment';

export function DebugTest() {
  describe('Debug', () => {
    let test: Mock.IBasicComponentSetupWithModalBox<Debug>;

    beforeEach(() => {
      test = Mock.basicComponentSetupWithModalBox<Debug>(Debug);
    });

    afterEach(() => {
      test = null;
    });

    it('should allow to open the debug panel after a delay', done => {
      test.cmp.showDebugPanel();
      setTimeout(() => {
        expect(test.modalBox.open).toHaveBeenCalled();
        done();
      }, 200);
    });

    it('should allow to add additional info of content HTML and they should render correctly', done => {
      let headerDiv = $$('div', { className: 'some-header' }, 'the content of the header').el;
      test.cmp.addInfoToDebugPanel({
        Header: headerDiv
      });
      test.cmp.showDebugPanel();

      setTimeout(() => {
        const modalOpened = (<jasmine.Spy>test.modalBox.open).calls.argsFor(0)[0];
        expect($$(modalOpened).find('.some-header')).not.toBeNull();
        expect($$($$(modalOpened).find('.some-header')).text()).toBe('the content of the header');
        done();
      }, 200);
    });

    it('should allow to add additional info of as a function and they should render correctly', done => {
      let func = jasmine.createSpy('func');

      func.and.returnValue(
        $$(
          'div',
          {
            className: 'my-function'
          },
          'my-function-content'
        ).el
      );

      test.cmp.addInfoToDebugPanel({
        HeaderFunc: func
      });
      test.cmp.showDebugPanel();

      setTimeout(() => {
        const modalOpened = (<jasmine.Spy>test.modalBox.open).calls.argsFor(0)[0];
        expect($$(modalOpened).find('.my-function')).not.toBeNull();
        expect($$($$(modalOpened).find('.my-function')).text()).toBe('my-function-content');
        expect(func).toHaveBeenCalled();
        done();
      }, 200);
    });

    it('shoud allow to add additional info as a JSON and it should render correctly', done => {
      test.cmp.addInfoToDebugPanel({
        HeaderJSON: {
          foo: 'bar',
          sup: 'hello',
          baz: {
            buzz: 'bizz'
          },
          date: new Date(),
          number: 1,
          boolean: true,
          nothing: null
        }
      });
      test.cmp.showDebugPanel();

      setTimeout(() => {
        const modalOpened = (<jasmine.Spy>test.modalBox.open).calls.argsFor(0)[0];
        expect($$(modalOpened).find('.coveo-property-object')).not.toBeNull();
        expect($$(modalOpened).find('.coveo-property-basic')).not.toBeNull();
        expect($$(modalOpened).find('.coveo-property-value-boolean')).not.toBeNull();
        expect($$(modalOpened).find('.coveo-property-value-date')).not.toBeNull();
        expect($$(modalOpened).find('.coveo-property-value-string')).not.toBeNull();
        expect($$(modalOpened).find('.coveo-property-value-number')).not.toBeNull();
        expect($$(modalOpened).find('.coveo-property-value-null')).not.toBeNull();
        done();
      }, 200);
    });

    it('should allow to search', () => {
      let headerDiv = $$('div', { className: 'some-header' }, 'the content of the header').el;
      test.cmp.addInfoToDebugPanel({
        Header: headerDiv
      });
      test.cmp.showDebugPanel();
    });
  });
}
