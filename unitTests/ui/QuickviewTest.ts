import * as Mock from '../MockEnvironment';
import { Quickview } from '../../src/ui/Quickview/Quickview';
import { FakeResults } from '../Fake';
import { IQueryResult } from '../../src/rest/QueryResult';
import { Template } from '../../src/ui/Templates/Template';
import { StringUtils } from '../../src/utils/StringUtils';
import { Simulate } from '../Simulate';
import { Defer } from '../../src/misc/Defer';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { Utils } from '../../src/utils/Utils';
import { $$ } from '../../src/utils/Dom';
import { QueryStateModel } from '../../src/models/QueryStateModel';
import { ValidLayout } from '../../src/ui/ResultLayoutSelector/ValidLayout';

export function QuickviewTest() {
  describe('Quickview', () => {
    let result: IQueryResult;
    let quickview: Quickview;
    let env: Mock.IMockEnvironment;
    let modalBox;

    beforeEach(() => {
      quickview = buildQuickview();
    });

    afterEach(() => {
      quickview = null;
      env = null;
      modalBox = null;
    });

    const buildQuickview = (template = simpleTestTemplate(), layout: ValidLayout = 'list') => {
      let mockBuilder = new Mock.MockEnvironmentBuilder().withLiveQueryStateModel();
      env = mockBuilder.build();
      env.queryStateModel.set(QueryStateModel.attributesEnum.layout, layout);
      result = FakeResults.createFakeResult();
      modalBox = Simulate.modalBoxModule();
      return new Quickview(env.element, { contentTemplate: template }, <any>mockBuilder.getBindings(), result, modalBox);
    };

    const simpleTestTemplate = () => {
      let template = new Template(() => '<div class="coveo-quick-view-full-height"></div>');
      return template;
    };

    it('should render button correctly', done => {
      expect($$(quickview.element).hasClass('coveo-accessible-button')).toBe(true);
      expect($$(quickview.element).find('.coveo-icon-for-quickview')).not.toBeNull();
      expect($$(quickview.element).find('.coveo-caption-for-icon')).not.toBeNull();
      done();
    });

    it('should have a tooltip when layout is list', done => {
      expect(
        $$(quickview.element)
          .find('.coveo-caption-for-icon')
          .hasAttribute('x-placement')
      ).toBe(true);
      done();
    });

    it('should not have a tooltip when layout is card', done => {
      quickview = buildQuickview(undefined, 'card');
      expect(
        $$(quickview.element)
          .find('.coveo-caption-for-icon')
          .hasAttribute('x-placement')
      ).toBe(false);
      done();
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

    describe('when instantiating invalid templates', () => {
      const verifyThatOpeningQuickViewDoesNotThrow = (quickview: Quickview, done) => {
        spyOn(quickview.logger, 'warn');

        quickview
          .open()
          .then(() => {
            expect(quickview.logger.warn).toHaveBeenCalled();
            done();
          })
          .catch(e => {
            fail(e);
            done();
          });
      };

      it('should not throw an error when opening a template that throws an error', done => {
        const badTemplate = new Template(() => {
          throw 'Oh, the Humanity!';
        });
        quickview = buildQuickview(badTemplate);
        verifyThatOpeningQuickViewDoesNotThrow(quickview, done);
      });

      it('should not throw an error when opening a template that returns null', done => {
        const badTemplate = new Template(() => null);
        quickview = buildQuickview(badTemplate);
        verifyThatOpeningQuickViewDoesNotThrow(quickview, done);
      });

      it('should not throw an error when opening a template that returns undefined', done => {
        const badTemplate = new Template(() => undefined);
        quickview = buildQuickview(badTemplate);
        verifyThatOpeningQuickViewDoesNotThrow(quickview, done);
      });
    });
  });
}
