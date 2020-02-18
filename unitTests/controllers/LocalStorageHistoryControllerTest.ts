import * as Mock from '../MockEnvironment';
import { LocalStorageHistoryController, InitializationEvents, $$ } from '../../src/Core';

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
      const modelInLocalStorage: Record<string, string> = { q: 'localstorage' };

      function emitRestoreHistoryStateEvent() {
        $$(env.root).trigger(InitializationEvents.restoreHistoryState);
      }

      beforeEach(() => {
        spyOn(localStorageHistoryController.storage, 'load').and.returnValue(modelInLocalStorage);
      });

      it(`initializes the model with the values in localstorage`, () => {
        spyOn(env.queryStateModel, 'setMultiple');
        emitRestoreHistoryStateEvent();

        expect(env.queryStateModel.setMultiple).toHaveBeenCalledWith(jasmine.objectContaining(modelInLocalStorage));
      });

      it(`if an attribute has a value in the url hash, it prioritizes the url hash value over the local storage value`, () => {
        const hashQueryAttributeValue = 'queryInUrl';
        const urlHash = `#q=${hashQueryAttributeValue}`;
        mockWindow.location.replace(urlHash);
        spyOn(env.queryStateModel, 'setMultiple');

        expect(hashQueryAttributeValue).not.toEqual(modelInLocalStorage.q);
        emitRestoreHistoryStateEvent();

        expect(env.queryStateModel.setMultiple).toHaveBeenCalledWith(jasmine.objectContaining({ q: hashQueryAttributeValue }));
      });
    });
  });
}
