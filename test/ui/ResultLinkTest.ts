/// <reference path="../Test.ts" />

module Coveo {
  describe('ResultLink', function () {
    let test: Mock.IBasicComponentSetup<ResultLink>;
    let fakeResult: IQueryResult;

    beforeEach(() => {
      fakeResult = initFakeResult();
      test = Mock.advancedResultComponentSetup<ResultLink>(ResultLink, fakeResult, undefined);
      spyOn(test.cmp, 'openLink');
    });

    afterEach(function () {
      test = null;
      fakeResult = null;
    })

    it('should hightlight the result title', () => {
      expect(test.cmp.element.innerHTML).toEqual(HighlightUtils.highlightString(fakeResult.title, fakeResult.titleHighlights, null, 'coveo-highlight'));
    })

    it('should contain the clickUri if the result has no title', () => {
      fakeResult.title = undefined;
      test = Mock.advancedResultComponentSetup<ResultLink>(ResultLink, fakeResult, undefined);
      expect(test.cmp.element.innerHTML).toEqual(fakeResult.clickUri);
    })

    it('can receive an onClick option to execute', (done) => {
      test = Mock.advancedResultComponentSetup<ResultLink>(ResultLink, fakeResult, new Mock.AdvancedComponentSetupOptions($$('div').el, {
        onClick: () => {
          expect(true).toBe(true);
          done();
        }
      }));
      $$(test.cmp.element).trigger('click');
    })

    it('sends an analytic event on click', () => {
      $$(test.cmp.element).trigger('click');
      expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledTimes(1);
    })

    it('sends an analytics event on context menu', () => {
      $$(test.cmp.element).trigger('contextmenu');
      expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledTimes(1);
    })

    describe('when logging the analytic event', () => {
      it('should use the href if set', () => {
        let element = $$('a');
        let href = 'href_test'
        element.setAttribute('href', href);
        test = Mock.advancedResultComponentSetup<ResultLink>(ResultLink, fakeResult, new Mock.AdvancedComponentSetupOptions(element.el));
        spyOn(test.cmp, 'openLink');

        $$(test.cmp.element).trigger('click');

        expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledWith(analyticsActionCauseList.documentOpen, jasmine.objectContaining({ documentURL: href }), fakeResult, test.cmp.root);
      })

      it('should use the clickUri if the href is empty', () => {
        $$(test.cmp.element).trigger('click');

        expect(test.cmp.usageAnalytics.logClickEvent).toHaveBeenCalledWith(analyticsActionCauseList.documentOpen, jasmine.objectContaining({ documentURL: fakeResult.clickUri }), fakeResult, test.cmp.root);
      })
    })

    describe('when the element is an hyperlink', () => {

      beforeEach(() => {
        test = Mock.advancedResultComponentSetup<ResultLink>(ResultLink, fakeResult, new Mock.AdvancedComponentSetupOptions($$('a').el));
      });

      it('should set the href to the result click uri', () => {
        expect(test.cmp.element.getAttribute('href')).toEqual(fakeResult.clickUri);
      })

      it('should not override the href if it is set before the initialization', () => {
        let element = $$('a');
        let href = 'href_test'
        element.setAttribute('href', href);
        test = Mock.advancedResultComponentSetup<ResultLink>(ResultLink, fakeResult, new Mock.AdvancedComponentSetupOptions(element.el));

        expect(test.cmp.element.getAttribute('href')).toEqual(href);
      })

      describe('and the result has the outlookfield', () => {

        beforeEach(() => {
          fakeResult.raw['outlookuri'] = 'uri.for.outlook';
          fakeResult.raw['outlookformacuri'] = 'uri.for.outlook.for.mac';
        })

        it('should generate the correct href if the os is windows and the option is openInOutlook', () => {
          test = Mock.advancedResultComponentSetup<ResultLink>(ResultLink, fakeResult,
            new Mock.AdvancedComponentSetupOptions($$('a').el,
              { openInOutlook: true },
              (env: Mock.MockEnvironmentBuilder) => {
                return env.withOs(OS_NAME.WINDOWS);
              }));
          expect(test.cmp.element.getAttribute('href')).toEqual(fakeResult.raw['outlookuri']);
        })

        it('should generate the correct href if the os is windows and the option is not openInOutlook', () => {
          test = Mock.advancedResultComponentSetup<ResultLink>(ResultLink, fakeResult,
            new Mock.AdvancedComponentSetupOptions($$('a').el,
              { openInOutlook: false },
              (env: Mock.MockEnvironmentBuilder) => {
                return env.withOs(OS_NAME.WINDOWS);
              }));
          expect(test.cmp.element.getAttribute('href')).not.toEqual(fakeResult.raw['outlookuri']);
        })

        it('should generate the correct href if the os is mac and the option is openInOutlook', () => {
          test = Mock.advancedResultComponentSetup<ResultLink>(ResultLink, fakeResult,
            new Mock.AdvancedComponentSetupOptions($$('a').el,
              { openInOutlook: true },
              (env: Mock.MockEnvironmentBuilder) => {
                return env.withOs(OS_NAME.MACOSX);
              }));
          expect(test.cmp.element.getAttribute('href')).toEqual(fakeResult.raw['outlookformacuri']);
        })

        it('should generate the correct href if the os is mac and the option is not openInOutlook', () => {
          test = Mock.advancedResultComponentSetup<ResultLink>(ResultLink, fakeResult,
            new Mock.AdvancedComponentSetupOptions($$('a').el,
              { openInOutlook: false },
              (env: Mock.MockEnvironmentBuilder) => {
                return env.withOs(OS_NAME.MACOSX);
              }));
          expect(test.cmp.element.getAttribute('href')).not.toEqual(fakeResult.raw['outlookformacuri']);
        })

      })

    })



  })

  function initFakeResult(): IQueryResult {
    let fakeResult = FakeResults.createFakeResult();
    fakeResult.title = 'A test title';
    fakeResult.titleHighlights = [{ offset: 2, length: 4 }];
    fakeResult.clickUri = 'uri';
    return fakeResult;
  }
}
