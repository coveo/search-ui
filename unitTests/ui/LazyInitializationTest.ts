import { LazyInitialization, IInitializationParameters } from '../../src/ui/Base/Initialization';
import { Querybox } from '../../src/ui/Querybox/Querybox';
import { $$ } from '../../src/utils/Dom';
import { MockEnvironmentBuilder } from '../MockEnvironment';
import { get } from '../../src/ui/Base/RegisteredNamedMethods';
import { IComponentDefinition } from '../../src/ui/Base/Component';

export function LazyInitializationTest() {
  describe('LazyInitialization', () => {
    let initParameters: IInitializationParameters;

    beforeEach(() => {
      initParameters = {
        bindings: new MockEnvironmentBuilder().build(),
        options: undefined,
        result: undefined
      };
    });

    afterEach(() => {
      initParameters = null;
    });

    it('should allow to register a lazy component', () => {
      let loadPromise = new Promise<IComponentDefinition>((resolve, reject) => resolve(Querybox));
      const myStuff = () => loadPromise;
      LazyInitialization.registerLazyComponent('MyStuff', myStuff);
      expect(LazyInitialization.getLazyRegisteredComponent('MyStuff')).toEqual(loadPromise);
    });

    it('should allow to create a component with a factory', done => {
      const myStuff = () => new Promise<IComponentDefinition>((resolve, reject) => resolve(Querybox));
      LazyInitialization.registerLazyComponent('MyStuff', myStuff);
      const elementOne = $$('div', { className: 'CoveoMyStuff' });
      const elementTwo = $$('div', { className: 'CoveoMyStuff' });
      const resultOfFactory = LazyInitialization.componentsFactory([elementOne.el, elementTwo.el], 'MyStuff', initParameters);
      expect(resultOfFactory.isLazyInit).toBe(true);
      Promise.all(resultOfFactory.factory()).then(() => {
        expect(get(elementOne.el) instanceof Querybox).toBe(true);
        expect(get(elementTwo.el) instanceof Querybox).toBe(true);
        done();
      });
    });
  });
}
