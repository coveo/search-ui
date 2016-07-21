/// <reference path="../Test.ts" />

module Coveo {
  describe('FacetSlider', function () {
    let test: Mock.IBasicComponentSetup<FacetSlider>;

    beforeEach(function () {
      test = Mock.optionsComponentSetup<FacetSlider, IFacetSliderOptions>(FacetSlider, {
        start: 0,
        end: 100,
        field: '@foo'
      });
      (<jasmine.Spy>test.env.queryStateModel.get).and.returnValue([0, 100]);
      (<jasmine.Spy>test.env.queryStateModel.getDefault).and.returnValue([0, 100]);
    })

    afterEach(function () {
      test = null;
    })

    it('should not add a query expression if the slider is in it\'s default state', function () {
      test.cmp.setSelectedValues([0, 100]);
      let simulation = Simulate.query(test.env);
      expect(simulation.queryBuilder.build().aq).toBeUndefined();
    })

    it('should add a query expression if the slider is not in it\'s default state', function () {
      test.cmp.setSelectedValues([5, 25]);
      let simulation = Simulate.query(test.env);
      expect(simulation.queryBuilder.build().aq).toBe('@foo==5..25');
    })

    it('should request a group by', function () {
      let simulation = Simulate.query(test.env);
      expect(simulation.queryBuilder.build().groupBy).toEqual(jasmine.arrayContaining([
        jasmine.objectContaining({
          field: '@foo',
          generateAutomaticRanges: true
        })
      ]))
    })

    it('should return the correct selected values after a query, which is it\'s options', function () {
      Simulate.query(test.env);
      expect(test.cmp.getSelectedValues()).toEqual(jasmine.arrayContaining([0, 100]));
    })

    it('should return undefined values if there has not been a query yet', function () {
      expect(test.cmp.getSelectedValues()).toEqual(jasmine.arrayContaining([undefined, undefined]));
    })

    it('should return selected values from the query state if available', function () {
      let spy: jasmine.Spy = jasmine.createSpy('rangeState');
      spy.and.returnValue([60, 75]);
      test.env.queryStateModel.get = spy;
      Simulate.query(test.env);
      expect(test.cmp.getSelectedValues()).toEqual(jasmine.arrayContaining([60, 75]));
    })

    it('should populate breadcrumb only if not in default state', function () {
      let breadcrumbs = [];
      $$(test.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, <IPopulateBreadcrumbEventArgs>{ breadcrumbs: breadcrumbs })
      expect(breadcrumbs.length).toBe(0);

      breadcrumbs = [];
      test.cmp.setSelectedValues([50, 60]);
      $$(test.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, <IPopulateBreadcrumbEventArgs>{ breadcrumbs: breadcrumbs })
      expect(breadcrumbs.length).toBe(1);
    })

    describe('exposes options', function () {
      it('dateField should change the query expression to a correct date expression', function () {
        test = Mock.optionsComponentSetup<FacetSlider, IFacetSliderOptions>(FacetSlider, {
          start: '2000/01/01',
          end: '3000/01/01',
          field: '@foo',
          dateField: true
        });
        let startSelected = new Date(Date.UTC(2100, 0, 1));
        let endSelected = new Date(Date.UTC(2200, 0, 1));

        test.cmp.setSelectedValues([startSelected.getTime(), endSelected.getTime()]);
        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().aq).toBe('@foo==2100/01/01@00:00:00..2200/01/01@00:00:00');
      })

      it('queryOverride should output a query override in the group by request', function () {
        test = Mock.optionsComponentSetup<FacetSlider, IFacetSliderOptions>(FacetSlider, {
          start: 0,
          end: 100,
          field: '@foo',
          queryOverride: '@foo>50'
        });

        (<jasmine.Spy>test.env.queryStateModel.get).and.returnValue([0, 100]);
        (<jasmine.Spy>test.env.queryStateModel.getDefault).and.returnValue([0, 100]);

        let simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(jasmine.arrayContaining([
          jasmine.objectContaining({
            queryOverride: '@foo>50',
            field: '@foo'
          })
        ]));
      })

      it('title should modify the header', function () {
        test = Mock.optionsComponentSetup<FacetSlider, IFacetSliderOptions>(FacetSlider, {
          start: 0,
          end: 100,
          field: '@foo',
          title: 'nice title'
        });

        test.cmp.ensureDom();
        expect($$($$(test.cmp.facetHeader.build()).find('.coveo-facet-header-title')).text()).toBe('nice title');
      })
    })
  })
}
