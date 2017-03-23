import * as Mock from '../MockEnvironment';
import { Quickview } from '../../src/ui/Quickview/Quickview';
import { $$ } from '../../src/utils/Dom';
import { FakeResults } from '../Fake';
import { IQueryResult } from '../../src/rest/QueryResult';
import { Template } from '../../src/ui/Templates/Template';
import { StringUtils } from '../../src/utils/StringUtils';
import { ModalBox } from '../../src/ExternalModulesShim';
import { Simulate } from '../Simulate';

export function QuickviewTest() {
  describe('Quickview', () => {
    let result: IQueryResult;
    let quickview: Quickview;
    let env: Mock.IMockEnvironment;
    let modalBox;

    beforeEach(() => {
      let mockBuilder = new Mock.MockEnvironmentBuilder();
      env = mockBuilder.build();
      result = FakeResults.createFakeResult();
      modalBox = Simulate.modalBoxModule();
      quickview = new Quickview(env.element, { contentTemplate: buildTemplate() }, <any>mockBuilder.getBindings(), result, modalBox);
    });

    afterEach(() => {
      quickview = null;
      env = null;
      modalBox = null;
    });

    it('creates a modal box on open', () => {
      quickview.open();
      expect(modalBox.open).toHaveBeenCalled();
    });

    it('closes the modal box on close', () => {
      quickview.open();
      quickview.close();
      expect(modalBox.close).toHaveBeenCalled();
    });

    it('computes the hash id', () => {
      let hash = quickview.getHashId();
      expect(hash).toBe(result.queryUid + '.' + result.index + '.' + StringUtils.hashCode(result.uniqueId));
    });

    function buildTemplate() {
      let template = new Template(() => '<div class="coveo-quick-view-full-height"></div>');
      return template;
    }
  });


}
