import * as Mock from '../MockEnvironment';
import { Quickview, IQuickviewOptions, ValidTooltipPlacement } from '../../src/ui/Quickview/Quickview';
import { FakeResults } from '../Fake';
import { IQueryResult } from '../../src/rest/QueryResult';
import { Template } from '../../src/ui/Templates/Template';
import { ResultListEvents } from '../../src/events/ResultListEvents';
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

    const buildQuickview = (template = simpleTestTemplate(), layout: ValidLayout = 'list', options?: IQuickviewOptions) => {
      const mockBuilder = new Mock.MockEnvironmentBuilder().withLiveQueryStateModel();
      const bindings = { ...(<any>mockBuilder.getBindings()), resultElement: $$('div').el };
      env = mockBuilder.build();
      env.queryStateModel.set(QueryStateModel.attributesEnum.layout, layout);
      result = FakeResults.createFakeResult();
      modalBox = Simulate.fullModalBoxModule();
      return new Quickview(env.element, { contentTemplate: template, ...options }, bindings, result, modalBox);
    };

    const simpleTestTemplate = () => {
      let template = new Template(() => '<div class="coveo-quick-view-full-height"></div>');
      return template;
    };

    it('should render button correctly', done => {
      expect($$(quickview.element).hasClass('coveo-accessible-button')).toBe(true);
      expect($$(quickview.element).find('.coveo-icon-for-quickview')).toBeTruthy();
      expect($$(quickview.element).find('.coveo-caption-for-icon')).toBeTruthy();
      done();
    });

    it('when the layout is list, the caption should be positioned (i.e. appear as a tooltip)', done => {
      expect(
        $$(quickview.element)
          .find('.coveo-caption-for-icon')
          .hasAttribute('x-placement')
      ).toBe(true);
      done();
    });

    it('when the layout is card, the caption should not be positioned (i.e. be inline)', done => {
      quickview = buildQuickview(undefined, 'card');
      expect(
        $$(quickview.element)
          .find('.coveo-caption-for-icon')
          .hasAttribute('x-placement')
      ).toBe(false);
      done();
    });

    it('when the tooltipPlacement option is set, the tooltip has to be positionned accordingly', done => {
      const placements: ValidTooltipPlacement[] = ['left', 'top-end', 'right-start', 'bottom'];
      for (const placement of placements) {
        quickview = buildQuickview(undefined, undefined, { tooltipPlacement: placement });
        expect(
          $$(quickview.element)
            .find('.coveo-caption-for-icon')
            .getAttribute('x-placement')
        ).toBe(placement);
      }
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

    it('calls event.stopPropagation on openQuickview', () => {
      const stopPropagation = jasmine.createSpy('stopPropagation');
      $$(quickview.bindings.resultElement).trigger(ResultListEvents.openQuickview, {
        stopPropagation
      });

      expect(stopPropagation).toHaveBeenCalled();
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
