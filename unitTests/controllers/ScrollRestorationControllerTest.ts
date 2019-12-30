import { ScrollRestorationController } from '../../src/controllers/ScrollRestorationController';
import * as Mock from '../MockEnvironment';

export function ScrollRestorationControllerTest() {
  describe('ScrollRestorationController', () => {
    let scrollRestorationController: ScrollRestorationController;
    let env: Mock.IMockEnvironment;

    beforeEach(() => {
      env = new Mock.MockEnvironmentBuilder().withLiveQueryStateModel().build();
      scrollRestorationController = new ScrollRestorationController(env.root, Mock.mockWindow(), env.queryStateModel);
    });

    afterEach(() => {
      scrollRestorationController = null;
      env = null;
    });

    it('should register a query state model attribute to store the last scroll position', () => {
      const attributeName = ScrollRestorationController.stateAttributeName;
      expect(scrollRestorationController.queryStateModel.attributes).toEqual(
        jasmine.objectContaining({
          [attributeName]: 0
        })
      );
    });
  });
}
