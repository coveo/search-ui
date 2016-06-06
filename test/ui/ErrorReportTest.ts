/// <reference path="../Test.ts" />

module Coveo {
  describe('ErrorReport', function () {
    var test: Mock.IBasicComponentSetup<ErrorReport>;

    beforeEach(function () {
      test = Mock.basicComponentSetup<ErrorReport>(ErrorReport);
    })

    afterEach(function () {
      test = null;
    })

    describe('exposes options', function () {
      it('showDetailedError allow to show the json of the error', function () {
        test = Mock.optionsComponentSetup<ErrorReport, IErrorReportOptions>(ErrorReport, {
          showDetailedError: false
        })
        Simulate.query(test.env, {
          error: new QueryError({
            statusCode: 401,
            data: {
              message: 'the message',
              type: 'the type'
            }
          })
        });
        expect($$(test.cmp.element).text()).not.toEqual(jasmine.stringMatching('More Information'));

        test = Mock.optionsComponentSetup<ErrorReport, IErrorReportOptions>(ErrorReport, {
          showDetailedError: true
        })
        Simulate.query(test.env, {
          error: new QueryError({
            statusCode: 401,
            data: {
              message: 'the message',
              type: 'the type'
            }
          })
        });
        expect($$(test.cmp.element).text()).toEqual(jasmine.stringMatching('More Information'));
      })
    })

    it('should hide by default', function () {
      expect(test.cmp.element.style.display).toBe('none');
    })

    it('should show on query error', function () {
      Simulate.query(test.env, {
        error: new QueryError({
          statusCode: 401,
          data: {
            message: 'the message',
            type: 'the type'
          }
        })
      });
      expect($$(test.cmp.element).text()).toEqual(jasmine.stringMatching('Something went wrong.'));
    })

    it('should send analytics event on retry', function () {
      Simulate.query(test.env, {
        error: new QueryError({
          statusCode: 401,
          data: {
            message: 'the message',
            type: 'the type'
          }
        })
      });
      test.cmp.retry();
      expect(test.cmp.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.errorRetry, {});
    })

    it('should send analytics event on reset', function () {
      Simulate.query(test.env, {
        error: new QueryError({
          statusCode: 401,
          data: {
            message: 'the message',
            type: 'the type'
          }
        })
      });
      test.cmp.reset();
      expect(test.cmp.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.errorClearQuery, {});
    })
  })
}