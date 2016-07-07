/// <reference path="../Test.ts" />
module Coveo {
  describe('HierarchicalFacet', function () {
    let test: Mock.IBasicComponentSetup<HierarchicalFacet>;
    let results: IGroupByResult;

    beforeEach(function () {
      test = Mock.optionsComponentSetup<HierarchicalFacet, IHierarchicalFacetOptions>(HierarchicalFacet, {
        field: '@foobar'
      })
      results = FakeResults.createFakeHierarchicalGroupByResult('@foobar', 'foo', 2, 3, '|', false, true);
    })

    afterEach(function () {
      test = null;
      results = null;
    })

    function getFacetValue(parentNumber, childNumber?, token = 'foo', delimitingCharacter = '|'): FacetValue {
      if (childNumber == undefined) {
        return test.cmp.values.get(token + parentNumber)
      } else {
        return test.cmp.values.get(token + parentNumber + delimitingCharacter + token + parentNumber + '-' + childNumber)
      }
    }

    function getFacetValueElement(facetValue: string): HTMLElement {
      return $$(_.find<HTMLElement>($$(test.cmp.element).findAll('.coveo-facet-value'), (value) => {
        return $$($$(value).find('.coveo-facet-value-caption')).text().toLowerCase() == facetValue.toLowerCase();
      })).el;
    }

    function doQuery() {
      Simulate.query(test.env, {
        groupByResults: [results]
      })
    }

    it('should flag the parent value when a child value is selected or deselected', function () {
      doQuery();
      expect(getFacetValue(0).selected).toBe(false);
      expect(getFacetValue(0, 0).selected).toBe(false);

      test.cmp.selectValue('foo0|foo0-0');
      doQuery();
      expect(getFacetValue(0, 0).selected).toBe(true);
      expect($$(getFacetValueElement('foo0')).hasClass('coveo-has-childs-selected')).toBe(true);

      test.cmp.deselectValue('foo0|foo0-0');
      doQuery();
      expect(getFacetValue(0, 0).selected).toBe(false);
      expect($$(getFacetValueElement('foo0')).hasClass('coveo-has-childs-selected')).toBe(false);
    })

    it('should hide child value by default', function () {
      doQuery();
      expect($$(getFacetValueElement('foo0-0')).hasClass('coveo-inactive')).toBe(true);
    })

    it('should show and hide the children if you open/close the parent', function () {
      doQuery();
      test.cmp.open('foo0');
      expect($$(getFacetValueElement('foo0-0')).hasClass('coveo-inactive')).toBe(false);
      test.cmp.close('foo0');
      expect($$(getFacetValueElement('foo0-0')).hasClass('coveo-inactive')).toBe(true);
    })

    it('should keep a value opened after a query', function () {
      doQuery();
      test.cmp.open('foo0');
      expect($$(getFacetValueElement('foo0-0')).hasClass('coveo-inactive')).toBe(false);
      doQuery();
      expect($$(getFacetValueElement('foo0-0')).hasClass('coveo-inactive')).toBe(false);
    })

    it('should reset correctly (selection)', function () {
      doQuery();
      test.cmp.selectValue('foo0');
      var simulation = Simulate.query(test.env, {
        groupByResults: [results]
      })
      expect(simulation.queryBuilder.build().aq).toEqual(jasmine.stringMatching('@foobar'))


      test.cmp.reset();
      simulation = Simulate.query(test.env, {
        groupByResults: [results]
      })
      expect(simulation.queryBuilder.build().aq).not.toEqual(jasmine.stringMatching('@foobar'))
    })

    it('should set the correct css class for a value with childs', function () {
      doQuery();
      expect($$(getFacetValueElement('foo0')).hasClass('coveo-has-childs')).toBe(true);
    })

    it('should set the correct css class for a value with childs selected', function () {
      doQuery();
      test.cmp.selectValue('foo0|foo0-0');
      doQuery();
      expect($$(getFacetValueElement('foo0')).hasClass('coveo-has-childs-selected')).toBe(true);
      test.cmp.deselectValue('foo0|foo0-0');
      doQuery();
      expect($$(getFacetValueElement('foo0')).hasClass('coveo-has-childs-selected')).toBe(false);
    })

    it('should set the correct css class for a value with multiple child selected', function () {
      doQuery();
      test.cmp.selectValue('foo0|foo0-0');
      test.cmp.selectValue('foo0|foo0-1');
      doQuery();
      expect($$(getFacetValueElement('foo0')).hasClass('coveo-has-childs-selected')).toBe(true);
      test.cmp.deselectValue('foo0|foo0-0');
      doQuery();
      expect($$(getFacetValueElement('foo0')).hasClass('coveo-has-childs-selected')).toBe(true);
      test.cmp.deselectValue('foo0|foo0-1');
      doQuery();
      expect($$(getFacetValueElement('foo0')).hasClass('coveo-has-childs-selected')).toBe(false);
    })

    it('should set the correct css class for a value with no child', function () {
      doQuery();
      expect($$(getFacetValueElement('foo0-0')).hasClass('coveo-no-childs')).toBe(true);
    })

    it('should request 10000 values but displays only as much as requested', function () {

      expect(test.cmp.numberOfValues).toBe(10000);
      expect(test.cmp.numberOfValuesToShow).toBe(5);
      FakeResults.createFakeHierarchicalGroupByResult('@foo', 'foo', 50);
      var simulation = Simulate.query(test.env, {
        groupByResults: [results]
      })

      expect(simulation.queryBuilder.build().groupBy).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
        maximumNumberOfValues: 10000 + 1 // +1 for more functionnality
      })]))
    })

    it('should treat orphan values accordingly', () => {
      doQuery();
      // open the paren, the child should not be inactive
      test.cmp.open('foo0');
      expect($$(getFacetValueElement('foo0-0')).hasClass('coveo-inactive')).toBe(false);
      results = FakeResults.createFakeHierarchicalGroupByResult('@foobar', 'foo', 2, 3, '|', false, true);
      // values[0] is foo0 : a parent
      results.values[0] = undefined;
      results.values = _.compact(results.values);
      doQuery();
      // foo0-0 is a child of the value we just deleted
      // it should be hidden
      test.cmp.open('foo0');
      expect($$(getFacetValueElement('foo0-0')).hasClass('coveo-inactive')).toBe(true);
    })

    it('should populate breadcrumb', () => {
      doQuery();
      test.cmp.selectValue('foo0|foo0-0');
      var breadcrumb = Simulate.breadcrumb(test.env);
      expect(breadcrumb[0].element.innerText).toContain('foo0');
    })

    it('should not exec script in breadcrumb', () => {
      doQuery();
      test.cmp.selectValue('<script>alert(\'foo\')</script>');
      var breadcrumb = Simulate.breadcrumb(test.env);
      expect(breadcrumb[0].element.innerHTML).toContain('&lt;script&gt;');
    })

    it('should be able to collapse', () => {
      doQuery();
      let facetValues = $$(test.cmp.element).findAll('.coveo-facet-value');
      expect(facetValues[0].style.display).toEqual('');
      expect($$(facetValues[0]).hasClass('coveo-inactive')).toBe(false);
      expect(facetValues[1].style.display).toEqual('');
      expect($$(facetValues[1]).hasClass('coveo-inactive')).toBe(true);
    })

    it('should show the correct number of results', () => {
      test.cmp.numberOfValuesToShow = 1;
      doQuery();
      let facetValues = $$(test.cmp.element).findAll('.coveo-facet-value');
      expect($$(facetValues[0]).hasClass('coveo-inactive')).toBe(false);
      expect($$(facetValues[1]).hasClass('coveo-inactive')).toBe(true);
      expect($$(facetValues[4]).hasClass('coveo-has-childs')).toBe(true);
      expect($$(facetValues[4]).hasClass('coveo-inactive')).toBe(true);
      expect($$(facetValues[5]).hasClass('coveo-inactive')).toBe(true);
    })
  })
}
