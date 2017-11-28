import * as Mock from '../MockEnvironment';
import { Quickview } from '../../src/ui/Quickview/Quickview';
import { FakeResults } from '../Fake';
import { IQueryResult } from '../../src/rest/QueryResult';
import { Template } from '../../src/ui/Templates/Template';
import { StringUtils } from '../../src/utils/StringUtils';
import { Simulate } from '../Simulate';
import { Defer } from '../../src/misc/Defer';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { Utils } from '../../src/UtilsModules';

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

    it('creates a modal box on open', done => {
      quickview.open();
      Defer.defer(() => {
        expect(modalBox.open).toHaveBeenCalled();
        done();
      });
    });

    it('closes the modal box on close', done => {
      quickview.open();
      Defer.defer(() => {
        quickview.close();
        expect(modalBox.close).toHaveBeenCalled();
        done();
      });
    });

    it('logs an analytics event on open', done => {
      quickview.open();
      Defer.defer(() => {
        expect(quickview.usageAnalytics.logClickEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.documentQuickview,
          {
            author: Utils.getFieldValue(result, 'author'),
            documentURL: result.clickUri,
            documentTitle: result.title
          },
          result,
          quickview.element
        );
        done();
      });
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
