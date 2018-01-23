import * as Mock from '../MockEnvironment';
import { DidYouMean } from '../../src/ui/DidYouMean/DidYouMean';
import { IQueryCorrection } from '../../src/rest/QueryCorrection';
import { IWordCorrection } from '../../src/rest/QueryCorrection';
import { Simulate } from '../Simulate';
import { FakeResults } from '../Fake';
import { ISimulateQueryData } from '../Simulate';
import { analyticsActionCauseList } from '../../src/ui/Analytics/AnalyticsActionListMeta';
import { IDidYouMeanOptions } from '../../src/ui/DidYouMean/DidYouMean';
import { QueryStateModel } from '../../src/models/QueryStateModel';
import { $$ } from '../../src/utils/Dom';

export function DidYouMeanTest() {
  describe('DidYouMean', function() {
    var test: Mock.IBasicComponentSetup<DidYouMean>;
    var fakeQueryCorrection: IQueryCorrection;
    beforeEach(function() {
      test = Mock.basicComponentSetup<DidYouMean>(DidYouMean);
      fakeQueryCorrection = {
        correctedQuery: 'this is the corrected query',
        wordCorrections: [
          <IWordCorrection>{
            offset: 12,
            length: 9,
            originalWord: 'corected',
            correctedWord: 'corrected'
          }
        ]
      };
      test.env.queryStateModel.get = () => 'originalquery';
    });

    it('should be hidden before making a query', function() {
      expect(test.cmp.element.style.display).toBe('none');
    });

    it('should be shown when there are both query corrections and results', function() {
      Simulate.query(test.env, {
        results: FakeResults.createFakeResults(2),
        queryCorrections: [fakeQueryCorrection]
      });

      expect(test.cmp.element.style.display).not.toBe('none');
    });

    it('should be hidden when there are no query corrections', function() {
      Simulate.query(test.env, {
        results: FakeResults.createFakeResults(0),
        queryCorrections: []
      });

      expect(test.cmp.element.style.display).toBe('none');
    });

    it('should send an analytics event when doQueryWithCorrectedTerm is called', function() {
      var analyticsSpy = jasmine.createSpy('analyticsSpy');
      test.env.usageAnalytics.logSearchEvent = analyticsSpy;
      Simulate.query(test.env, <ISimulateQueryData>{
        queryCorrections: [fakeQueryCorrection]
      });
      test.env.queryController.deferExecuteQuery = arg => {
        arg.beforeExecuteQuery();
      };
      test.cmp.doQueryWithCorrectedTerm();
      expect(analyticsSpy).toHaveBeenCalledWith(analyticsActionCauseList.didyoumeanClick, {});
    });

    describe('exposes options', function() {
      describe('enableAutoCorrection', function() {
        it('set to true should autocorrect the query when no results are found', function() {
          test = Mock.optionsComponentSetup<DidYouMean, IDidYouMeanOptions>(DidYouMean, <IDidYouMeanOptions>{
            enableAutoCorrection: true
          });
          test.env.queryStateModel.get = () => 'foobar';
          var qsmSpy = jasmine.createSpy('queryStateModelSpy');
          test.env.queryStateModel.set = qsmSpy;

          Simulate.query(test.env, {
            results: FakeResults.createFakeResults(0),
            queryCorrections: [fakeQueryCorrection]
          });

          expect(qsmSpy).toHaveBeenCalledWith(QueryStateModel.attributesEnum.q, 'this is the corrected query');
        });

        it('set to true should send an analytics event when query is autocorrected', function() {
          test = Mock.optionsComponentSetup<DidYouMean, IDidYouMeanOptions>(DidYouMean, <IDidYouMeanOptions>{
            enableAutoCorrection: true
          });
          test.env.queryStateModel.get = () => 'foobar';
          var analyticsSpy = jasmine.createSpy('analyticsSpy');
          test.cmp.usageAnalytics.logSearchEvent = analyticsSpy;

          Simulate.query(test.env, {
            results: FakeResults.createFakeResults(0),
            queryCorrections: [fakeQueryCorrection]
          });

          expect(analyticsSpy).toHaveBeenCalledWith(analyticsActionCauseList.didyoumeanAutomatic, {});
          expect(analyticsSpy.calls.count()).toBe(1);
        });

        it('set to false should not autocorrect the query when no results are found', function() {
          test = Mock.optionsComponentSetup<DidYouMean, IDidYouMeanOptions>(DidYouMean, <IDidYouMeanOptions>{
            enableAutoCorrection: false
          });
          test.env.queryStateModel.get = () => 'foobar';
          var qsmSpy = jasmine.createSpy('queryStateModelSpy');
          test.env.queryStateModel.set = qsmSpy;

          Simulate.query(test.env, {
            results: FakeResults.createFakeResults(0),
            queryCorrections: [fakeQueryCorrection]
          });

          expect(qsmSpy).not.toHaveBeenCalled();
        });
      });
    });

    it('should not autocorrect search-as-you-type queries', function() {
      var qsmSpy = jasmine.createSpy('queryStateModelSpy');
      test.env.queryStateModel.set = qsmSpy;

      Simulate.query(test.env, {
        results: FakeResults.createFakeResults(0),
        searchAsYouType: true,
        queryCorrections: [fakeQueryCorrection]
      });

      expect(qsmSpy).not.toHaveBeenCalled();
    });

    it('correctedTerm should be null before a query', function() {
      expect(test.cmp.correctedTerm).toBeNull();
    });

    it('correctedTerm should be initialized properly from the queryCorrections', function() {
      Simulate.query(test.env, {
        queryCorrections: [fakeQueryCorrection]
      });

      expect(test.cmp.correctedTerm).toBe(fakeQueryCorrection.correctedQuery);
    });

    describe('doQueryWithCorrectedTerm', function() {
      it('should throw an exception if no query was made', function() {
        expect(() => test.cmp.doQueryWithCorrectedTerm()).toThrow();
      });

      it('should throw an exception if no corrections were available', function() {
        Simulate.query(test.env, {
          queryCorrections: []
        });

        expect(() => test.cmp.doQueryWithCorrectedTerm()).toThrow();
      });

      it('should execute a query when corrections were available', function() {
        Simulate.query(test.env, {
          queryCorrections: [fakeQueryCorrection]
        });

        var qsmSpy = jasmine.createSpy('queryStateModelSpy');
        test.env.queryStateModel.set = qsmSpy;
        test.cmp.doQueryWithCorrectedTerm();

        expect(qsmSpy).toHaveBeenCalledWith(QueryStateModel.attributesEnum.q, fakeQueryCorrection.correctedQuery);
        expect(qsmSpy.calls.count()).toBe(1);
      });
    });

    describe('escape the HTML against XSS', function() {
      beforeEach(function() {});

      it('when there are results', function() {
        Simulate.query(test.env, {
          queryCorrections: [
            <IQueryCorrection>{
              correctedQuery: '<script>alert("hack the internet")</script>'
            }
          ]
        });
        expect($$(test.cmp.element).find('.coveo-did-you-mean-suggestion a').innerHTML).toBe(
          '&lt;script&gt;alert("hack the internet")&lt;/script&gt;'
        );
      });

      it('when query is autocorrected', function() {
        Simulate.query(test.env, {
          results: FakeResults.createFakeResults(10),
          queryCorrections: [
            <IQueryCorrection>{
              correctedQuery: '<script>alert("thou shalt surely die")</script>'
            }
          ]
        });
        expect($$(test.cmp.element).find('.coveo-did-you-mean-suggestion a').innerHTML).toBe(
          '&lt;script&gt;alert("thou shalt surely die")&lt;/script&gt;'
        );
      });
    });
  });
}
