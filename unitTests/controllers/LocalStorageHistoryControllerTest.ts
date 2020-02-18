import * as Mock from '../MockEnvironment';
import { LocalStorageHistoryController, InitializationEvents, $$, QueryStateModel } from '../../src/Core';

export function LocalStorageHistoryControllerTest() {
  describe('LocalStorageHistoryController', () => {
    let localStorageHistoryController: LocalStorageHistoryController;
    let env: Mock.IMockEnvironment;
    let mockWindow: Window;

    beforeEach(() => {
      mockWindow = Mock.mockWindow();
      env = new Mock.MockEnvironmentBuilder().withLiveQueryStateModel().build();
      localStorageHistoryController = new LocalStorageHistoryController(env.root, mockWindow, env.queryStateModel, env.queryController);
    });

    describe(`with state in localstorage, when triggering the ${InitializationEvents.restoreHistoryState} event`, () => {
      const modelInLocalStorage: Record<string, string> = { q: 'hello' };

      function emitRestoreHistoryStateEvent() {
        $$(env.root).trigger(InitializationEvents.restoreHistoryState);
      }

      beforeEach(() => {
        spyOn(localStorageHistoryController.storage, 'load').and.returnValue(modelInLocalStorage);
      });

      it(`initializes the model with the values in localstorage`, () => {
        spyOn(env.queryStateModel, 'setMultiple');
        emitRestoreHistoryStateEvent();

        expect(env.queryStateModel.setMultiple).toHaveBeenCalledWith(jasmine.objectContaining({ q: modelInLocalStorage.q }));
      });

      it('if localstorage does not have a value defined, it uses the default value', () => {
        const key = 'layout';
        expect(modelInLocalStorage[key]).toBeUndefined();

        spyOn(env.queryStateModel, 'setMultiple');
        emitRestoreHistoryStateEvent();

        expect(env.queryStateModel.setMultiple).toHaveBeenCalledWith(
          jasmine.objectContaining({ [key]: QueryStateModel.defaultAttributes.layout })
        );
      });

      it(`if an attribute has a value in the url hash, it prioritizes the url hash value over the local storage value`, () => {
        const queryInHash = 'world';
        const urlHash = `#q=${queryInHash}`;
        mockWindow.location.replace(urlHash);

        expect(queryInHash).not.toEqual(modelInLocalStorage.q);

        spyOn(env.queryStateModel, 'setMultiple');
        emitRestoreHistoryStateEvent();

        expect(env.queryStateModel.setMultiple).toHaveBeenCalledWith(jasmine.objectContaining({ q: queryInHash }));
      });
    });
  });
}
