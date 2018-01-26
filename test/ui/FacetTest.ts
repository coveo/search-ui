/// <reference path="../../lib/jasmine/index.d.ts" />
import * as Mock from '../MockEnvironment';
import { Facet, IFacetOptions } from '../../src/ui/Facet/Facet';
import { $$ } from '../../src/utils/Dom';
import { FacetValue } from '../../src/ui/Facet/FacetValues';
import { Simulate } from '../Simulate';
import { FakeResults } from '../Fake';
import { OmniboxEvents } from '../../src/events/OmniboxEvents';
import { BreadcrumbEvents } from '../../src/events/BreadcrumbEvents';
import { IPopulateBreadcrumbEventArgs } from '../../src/events/BreadcrumbEvents';
import { IPopulateOmniboxEventArgs } from '../../src/events/OmniboxEvents';

export function FacetTest() {
  describe('Facet', () => {
    let test: Mock.IBasicComponentSetup<Facet>;

    beforeEach(() => {
      test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, <IFacetOptions>{
        field: '@field'
      });
    });

    afterEach(() => {
      test = null;
    });

    it('allows to select a value', () => {
      expect(test.cmp.getDisplayedFacetValues()).not.toContain('foobar');
      test.cmp.selectValue('foobar');
      expect(test.cmp.getDisplayedValues()).toContain('foobar');
      expect(test.cmp.values.get('foobar').selected).toBe(true);
    });

    it('allows to select multiple value', () => {
      expect(test.cmp.getDisplayedFacetValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      test.cmp.selectMultipleValues(['foo', 'bar', 'baz']);
      expect(test.cmp.getDisplayedValues()).toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      expect(test.cmp.values.get('foo').selected).toBe(true);
    });

    it('allows to deselect a value', () => {
      expect(test.cmp.getDisplayedFacetValues()).not.toContain('foobar');
      test.cmp.selectValue('foobar');
      expect(test.cmp.getDisplayedValues()).toContain('foobar');
      expect(test.cmp.values.get('foobar').selected).toBe(true);
      test.cmp.deselectValue('foobar');
      expect(test.cmp.getDisplayedFacetValues()).not.toContain('foobar');
      expect(test.cmp.values.get('foobar').selected).not.toBe(true);
    });

    it('allows to deselect multiple values', () => {
      expect(test.cmp.getDisplayedFacetValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      test.cmp.selectMultipleValues(['foo', 'bar', 'baz']);
      expect(test.cmp.getDisplayedValues()).toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      expect(test.cmp.values.get('foo').selected).toBe(true);
      test.cmp.deselectMultipleValues(['foo', 'bar', 'baz']);
      expect(test.cmp.getDisplayedFacetValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      expect(test.cmp.values.get('foo').selected).not.toBe(true);
    });

    it('allows to exclude a value', () => {
      expect(test.cmp.getDisplayedFacetValues()).not.toContain('foobar');
      test.cmp.excludeValue('foobar');
      expect(test.cmp.getDisplayedValues()).toContain('foobar');
      expect(test.cmp.values.get('foobar').excluded).toBe(true);
    });

    it('allows to exclude multiple value', () => {
      expect(test.cmp.getDisplayedFacetValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      test.cmp.excludeMultipleValues(['foo', 'bar', 'baz']);
      expect(test.cmp.getDisplayedValues()).toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      expect(test.cmp.values.get('foo').excluded).toBe(true);
    });

    it('allows to unexclude a value', () => {
      expect(test.cmp.getDisplayedFacetValues()).not.toContain('foobar');
      test.cmp.excludeValue('foobar');
      expect(test.cmp.getDisplayedValues()).toContain('foobar');
      expect(test.cmp.values.get('foobar').excluded).toBe(true);
      test.cmp.unexcludeValue('foobar');
      expect(test.cmp.getDisplayedFacetValues()).not.toContain('foobar');
      expect(test.cmp.values.get('foobar').excluded).not.toBe(true);
    });

    it('allows to unexclude multiple values', () => {
      expect(test.cmp.getDisplayedFacetValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      test.cmp.excludeMultipleValues(['foo', 'bar', 'baz']);
      expect(test.cmp.getDisplayedValues()).toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      expect(test.cmp.values.get('foo').excluded).toBe(true);
      test.cmp.unexcludeMultipleValues(['foo', 'bar', 'baz']);
      expect(test.cmp.getDisplayedFacetValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      expect(test.cmp.values.get('foo').excluded).not.toBe(true);
    });

    it('allows to toggleSelectValue', () => {
      expect(test.cmp.getDisplayedFacetValues()).not.toContain('foobar');
      test.cmp.toggleSelectValue('foobar');
      expect(test.cmp.getDisplayedValues()).toContain('foobar');
      expect(test.cmp.values.get('foobar').selected).toBe(true);
      test.cmp.toggleSelectValue('foobar');
      expect(test.cmp.values.get('foobar').selected).toBe(false);
    });

    it('allows to toggleExcludeValue', () => {
      expect(test.cmp.getDisplayedFacetValues()).not.toContain('foobar');
      test.cmp.toggleExcludeValue('foobar');
      expect(test.cmp.getDisplayedValues()).toContain('foobar');
      expect(test.cmp.values.get('foobar').excluded).toBe(true);
      test.cmp.toggleExcludeValue('foobar');
      expect(test.cmp.values.get('foobar').excluded).toBe(false);
    });

    it('allows to getSelectedValues', () => {
      expect(test.cmp.getSelectedValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar']));
      test.cmp.selectMultipleValues(['foo', 'bar']);
      expect(test.cmp.getSelectedValues()).toEqual(jasmine.arrayContaining(['foo', 'bar']));
    });

    it('allows to getExcludedValues', () => {
      expect(test.cmp.getExcludedValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar']));
      test.cmp.excludeMultipleValues(['foo', 'bar']);
      expect(test.cmp.getExcludedValues()).toEqual(jasmine.arrayContaining(['foo', 'bar']));
    });

    it('allows to reset', () => {
      test.cmp.selectMultipleValues(['foo', 'bar']);
      test.cmp.excludeMultipleValues(['a', 'b']);
      expect(test.cmp.getSelectedValues()).toEqual(jasmine.arrayContaining(['foo', 'bar']));
      expect(test.cmp.getExcludedValues()).toEqual(jasmine.arrayContaining(['a', 'b']));
      test.cmp.reset();
      expect(test.cmp.getSelectedValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar']));
      expect(test.cmp.getExcludedValues()).not.toEqual(jasmine.arrayContaining(['a', 'b']));
    });

    it('allows to update sort', () => {
      expect(test.cmp.options.sortCriteria).not.toBe('score');
      test.cmp.updateSort('score');
      expect(test.cmp.options.sortCriteria).toBe('score');
      expect(test.env.queryController.executeQuery).toHaveBeenCalled();
    });

    it('allows to collapse', () => {
      let spy = jasmine.createSpy('collapse');
      test.cmp.ensureDom();
      test.cmp.facetHeader.collapseFacet = spy;
      test.cmp.collapse();
      expect(spy).toHaveBeenCalled();
    });

    it('allows to expand', () => {
      let spy = jasmine.createSpy('expand');
      test.cmp.ensureDom();
      test.cmp.facetHeader.expandFacet = spy;
      test.cmp.expand();
      expect(spy).toHaveBeenCalled();
    });

    it('allows to showWaitingAnimation and hideWaitingAnimation', () => {
      test.cmp.showWaitingAnimation();
      expect($$(test.cmp.element).find('.coveo-facet-header-wait-animation').style.visibility).toBe('visible');
      test.cmp.hideWaitingAnimation();
      expect($$(test.cmp.element).find('.coveo-facet-header-wait-animation').style.visibility).toBe('hidden');
    });

    it('allows to getValueCaption', () => {
      test.cmp.options.field = '@filetype';
      expect(test.cmp.getValueCaption(FacetValue.createFromValue('foo'))).toBe('foo');
      expect(test.cmp.getValueCaption(FacetValue.createFromValue('txt'))).toBe('Text');
    });

    describe('with a live query state model', () => {
      beforeEach(() => {
        test = Mock.advancedComponentSetup<Facet>(Facet, <Mock.AdvancedComponentSetupOptions>{
          modifyBuilder: builder => {
            return builder.withLiveQueryStateModel();
          },
          cmpOptions: {
            field: '@field'
          }
        });
        test.env.queryStateModel.registerNewAttribute('f:@field', []);
        test.env.queryStateModel.registerNewAttribute('f:@field:not', []);
        test.env.queryStateModel.registerNewAttribute('f:@field:operator', 'or');
      });

      it('should select the needed values', () => {
        test.env.queryStateModel.set('f:@field', ['a', 'b', 'c']);
        expect(test.cmp.getSelectedValues()).toEqual(['a', 'b', 'c']);
      });

      it('should exclude the needed values', () => {
        test.env.queryStateModel.set('f:@field:not', ['a', 'b', 'c']);
        expect(test.cmp.getExcludedValues()).toEqual(['a', 'b', 'c']);
      });

      it('should update the operator', () => {
        test.env.queryStateModel.set('f:@field:operator', 'and');
        expect(test.cmp.options.useAnd).toBeTruthy();
        test.env.queryStateModel.set('f:@field:operator', 'or');
        expect(test.cmp.options.useAnd).toBeFalsy();
      });

      it('should trim values from the query state model for selected values', () => {
        test.env.queryStateModel.set('f:@field', ['a     ', '     b', '    c    ']);
        expect(test.cmp.getSelectedValues()).toEqual(['a', 'b', 'c']);
      });

      it('should trim values from the query state model for excluded values', () => {
        test.env.queryStateModel.set('f:@field:not', ['a     ', '     b', '    c    ']);
        expect(test.cmp.getExcludedValues()).toEqual(['a', 'b', 'c']);
      });
    });

    describe('on a query error', () => {
      it('should hide the waiting animation', () => {
        spyOn(test.cmp, 'hideWaitingAnimation');
        Simulate.queryError(test.env);
        expect(test.cmp.hideWaitingAnimation).toHaveBeenCalledTimes(1);
      });

      it('should update the appearance based on the new empty values', () => {
        Simulate.queryError(test.env);
        expect($$(test.cmp.element).hasClass('coveo-facet-empty')).toBeTruthy();
        expect(test.cmp.getDisplayedFacetValues().length).toBe(0);
      });
    });

    describe('exposes options', () => {
      it('title should set the title', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          title: 'My cool facet'
        });
        test.cmp.ensureDom();
        expect(test.cmp.facetHeader.options.title).toBe('My cool facet');
      });

      it('field should set the field in the query', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@myfield'
        });
        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.groupByRequests).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              field: '@myfield'
            })
          ])
        );
      });

      it('headerIcon should allow to set an icon in the header', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          headerIcon: 'my cool icon'
        });

        test.cmp.ensureDom();
        expect(test.cmp.facetHeader.options.icon).toBe('my cool icon');
      });

      it('id should be the field by default, or specified manually', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@mycoolfield'
        });
        expect(test.cmp.options.id).toBe('@mycoolfield');

        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@mycoolfield2',
          id: 'something else'
        });

        expect(test.cmp.options.id).toBe('something else');
      });

      it('isMultiValueField should trigger another query to update delta', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          isMultiValueField: false
        });
        test.cmp.selectValue('foo1');

        var results = FakeResults.createFakeResults();
        results.groupByResults = [FakeResults.createFakeGroupByResult('@field', 'foo', 10)];

        Simulate.query(test.env, {
          results: results
        });

        expect(test.cmp.getEndpoint().search).not.toHaveBeenCalled();

        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          isMultiValueField: true
        });
        test.cmp.selectValue('foo1');

        Simulate.query(test.env, {
          results: results
        });

        expect(test.cmp.getEndpoint().search).toHaveBeenCalled();
      });

      it('numberOfValues should specify the number of value requested in the query', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          numberOfValues: 13
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              maximumNumberOfValues: 13 + 1 // one more for the more less function
            })
          ])
        );
      });

      it('pageSize should specify the number of values for the more option', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          pageSize: 13
        });
        test.cmp.showMore();
        expect(test.cmp.getEndpoint().search).toHaveBeenCalledWith(
          jasmine.objectContaining({
            groupBy: jasmine.arrayContaining([
              jasmine.objectContaining({
                maximumNumberOfValues: 13 + test.cmp.options.numberOfValues + 1 // 13 + already displayed at start + 1 more for next more
              })
            ])
          })
        );
      });

      it('lookupField should specify the lookupfield to use in the query', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          lookupField: '@lookupfield'
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              lookupField: '@lookupfield'
            })
          ])
        );
      });

      it('enableSettings should specify if the setting component is initialized', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          enableSettings: false
        });
        test.cmp.ensureDom();
        expect(test.cmp.facetSettings).toBeUndefined();

        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          enableSettings: true
        });
        test.cmp.ensureDom();
        expect(test.cmp.facetSettings).toBeDefined();
      });

      it('enableSettingsFacetState should specify if the option is passed to the setting component', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          enableSettingsFacetState: false
        });

        test.cmp.ensureDom();
        expect($$(test.cmp.facetSettings.build()).find('.coveo-facet-settings-section-save-state')).toBeNull();

        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          enableSettingsFacetState: true
        });

        test.cmp.ensureDom();
        expect($$(test.cmp.facetSettings.build()).find('.coveo-facet-settings-section-save-state')).toBeDefined();
      });

      it('availableSorts should specify the available criteria in the setting component', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          availableSorts: ['ChiSquare', 'NoSort']
        });
        test.cmp.ensureDom();
        expect(test.cmp.facetSettings.sorts).toEqual(jasmine.arrayContaining(['ChiSquare', 'NoSort']));
      });

      it('sortCriteria should specify the first available sort if not specified', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          availableSorts: ['ChiSquare', 'NoSort']
        });
        test.cmp.ensureDom();
        expect(test.cmp.facetSort.activeSort.name.toLowerCase()).toBe('chisquare');
      });

      it('available sort with only no sorts should still work', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          availableSorts: ['nosort']
        });
        test.cmp.ensureDom();
        expect(test.cmp.facetSort.activeSort.name.toLowerCase()).toBe('nosort');
      });

      it('sortCriteria should specify the sort group by request', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          sortCriteria: 'score'
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              sortCriteria: 'score'
            })
          ])
        );
      });

      it('customSort should specify the sort of values when rendered', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          customSort: ['foo3', 'foo1']
        });
        var results = FakeResults.createFakeResults();
        results.groupByResults = [FakeResults.createFakeGroupByResult('@field', 'foo', 10)];
        Simulate.query(test.env, {
          results: results
        });
        expect(test.cmp.getDisplayedFacetValues()[0].value).toBe('foo3');
        expect(test.cmp.getDisplayedFacetValues()[1].value).toBe('foo1');
        expect(test.cmp.getDisplayedFacetValues()[2].value).toBe('foo0');
      });

      it('customSort should request the correct number of values in the group by', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          customSort: ['foo1', 'foo2', 'foo3', 'foo4', 'foo5', 'foo6', 'foo7', 'foo8']
        });
        test.cmp.selectValue('foo9');
        let simulation = Simulate.query(test.env);
        // expect to be custom sort + selection + 1 for "more values"
        expect(simulation.queryBuilder.build().groupBy[0].maximumNumberOfValues).toBe(10);

        test.cmp.excludeValue('foo10');
        simulation = Simulate.query(test.env);
        // expect to be custom sort + selection + exclude + 1 for "more values"
        expect(simulation.queryBuilder.build().groupBy[0].maximumNumberOfValues).toBe(11);

        test.cmp.selectValue('foo1');
        simulation = Simulate.query(test.env);
        // expect to be custom sort + selection + exclude + 1 for "more values"
        // and foo1 is not duplicated since it's already in the custom value
        expect(simulation.queryBuilder.build().groupBy[0].maximumNumberOfValues).toBe(11);
      });

      it("custom sort should not request more values then the default if it's not needed", () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          customSort: ['foo1', 'foo2']
        });
        test.cmp.selectValue('foo3');
        let simulation = Simulate.query(test.env);
        // expect to be 5 (default number of values in facet) + 1 for "more values"
        expect(simulation.queryBuilder.build().groupBy[0].maximumNumberOfValues).toBe(6);
      });

      it('injectionDepth should specify the injection depth in a group by', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          injectionDepth: 9999
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              injectionDepth: 9999
            })
          ])
        );
      });

      it('useAnd should specify the filter generated by a facet', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          useAnd: true
        });
        test.cmp.selectMultipleValues(['foo', 'bar']);
        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().aq).toBe('(@field==foo) (@field==bar)');

        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          useAnd: false
        });
        test.cmp.selectMultipleValues(['foo', 'bar']);
        simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().aq).toBe('@field==(foo,bar)');
      });

      it('allowTogglingOperator should specify if the toggle is rendered in header ', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          enableTogglingOperator: true
        });
        test.cmp.ensureDom();
        expect(test.cmp.facetHeader.operatorElement.style.display).not.toBe('none');

        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          enableTogglingOperator: false
        });
        test.cmp.ensureDom();
        expect(test.cmp.facetHeader.operatorElement.style.display).toBe('none');
      });

      it('enableFacetSearch should specify if the facet search is rendered', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          enableFacetSearch: true
        });

        test.cmp.ensureDom();
        expect(test.cmp.facetSearch).toBeDefined();

        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          enableFacetSearch: false
        });

        test.cmp.ensureDom();
        expect(test.cmp.facetSearch).toBeUndefined();
      });

      it('facetSearchDelay should be passed to the facet search component', function(done) {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          facetSearchDelay: 5
        });
        test.cmp.ensureDom();
        test.cmp.facetSearch.focus();
        setTimeout(() => {
          expect(test.cmp.getEndpoint().search).toHaveBeenCalled();
          done();
        }, 6); // one more ms then facetSearchDelay
      });

      it('numberOfValuesInFacetSearch should be passed to the facet search component', function(done) {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          numberOfValuesInFacetSearch: 13
        });
        test.cmp.ensureDom();
        test.cmp.facetSearch.focus();
        setTimeout(() => {
          expect(test.cmp.getEndpoint().search).toHaveBeenCalledWith(
            jasmine.objectContaining({
              groupBy: jasmine.arrayContaining([
                jasmine.objectContaining({
                  maximumNumberOfValues: 13
                })
              ])
            })
          );
          done();
        }, test.cmp.options.facetSearchDelay + 10);
      });

      it('includeInBreadcrumb should specify if the facet listen to breadcrumb events', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          includeInBreadcrumb: true
        });
        test.cmp.selectValue('foo');
        var args: IPopulateBreadcrumbEventArgs = {
          breadcrumbs: []
        };
        $$(test.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, args);
        expect(args.breadcrumbs.length).toBe(1);

        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          includeInBreadcrumb: false
        });
        test.cmp.selectValue('foo');
        args = {
          breadcrumbs: []
        };
        $$(test.env.root).trigger(BreadcrumbEvents.populateBreadcrumb, args);
        expect(args.breadcrumbs.length).toBe(0);
      });

      it('includeInOmnibox should specify if the facet listen to omnibox events', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          includeInOmnibox: false
        });

        Simulate.query(test.env);
        var args: IPopulateOmniboxEventArgs = FakeResults.createPopulateOmniboxEventArgs('foo', 1);
        $$(test.env.root).trigger(OmniboxEvents.populateOmnibox, args);
        expect(args.rows.length).toBe(0);

        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          includeInOmnibox: true
        });

        Simulate.query(test.env);
        args = FakeResults.createPopulateOmniboxEventArgs('foo', 1);
        $$(test.env.root).trigger(OmniboxEvents.populateOmnibox, args);
        expect(args.rows.length).toBe(1);
      });

      it('computedField should specify the computed field to use in the query', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          computedField: '@computedField'
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              computedFields: jasmine.arrayContaining([
                jasmine.objectContaining({
                  field: '@computedField'
                })
              ])
            })
          ])
        );
      });

      it('computedFieldOperation should specify the computed field to use in the query', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          computedField: '@computedField',
          computedFieldOperation: 'qwerty'
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              computedFields: jasmine.arrayContaining([
                jasmine.objectContaining({
                  operation: 'qwerty'
                })
              ])
            })
          ])
        );
      });

      it('enableMoreLess should specify that the moreLess element should be rendered', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          enableMoreLess: true
        });
        var results = FakeResults.createFakeResults();
        results.groupByResults = [FakeResults.createFakeGroupByResult('@field', 'foo', 15)];
        Simulate.query(test.env, {
          results: results
        });

        var more = $$(test.cmp.element).find('.coveo-facet-more');
        var less = $$(test.cmp.element).find('.coveo-facet-less');
        expect(more).toBeDefined();
        expect(less).toBeDefined();

        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          enableMoreLess: false
        });
        more = $$(test.cmp.element).find('.coveo-facet-more');
        less = $$(test.cmp.element).find('.coveo-facet-less');
        expect(more).toBeNull();
        expect(less).toBeNull();
      });

      it('allowedValues should specify the value in the group by request', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          allowedValues: ['a', 'b', 'c']
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              allowedValues: jasmine.arrayContaining(['a', 'b', 'c'])
            })
          ])
        );
      });

      it('additionalFilter should specify a query override in the group by request', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          additionalFilter: '@qwerty==foobar'
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(
          jasmine.arrayContaining([
            jasmine.objectContaining({
              constantQueryOverride: '@qwerty==foobar'
            })
          ])
        );
      });

      it('dependsOn should specify a facet to depend on another one', () => {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          dependsOn: '@masterFacet'
        });

        var masterFacet = Mock.advancedComponentSetup<Facet>(
          Facet,
          new Mock.AdvancedComponentSetupOptions(
            undefined,
            {
              field: '@masterFacet'
            },
            (builder: Mock.MockEnvironmentBuilder) => {
              return builder.withRoot(test.env.root);
            }
          )
        );

        var results = FakeResults.createFakeResults();
        results.groupByResults = [
          FakeResults.createFakeGroupByResult('@field', 'foo', 15),
          FakeResults.createFakeGroupByResult('@masterFacet', 'foo', 15)
        ];

        Simulate.query(test.env, {
          results: results
        });

        expect($$(test.cmp.element).hasClass('coveo-facet-dependent')).toBe(true);
        expect($$(masterFacet.cmp.element).hasClass('coveo-facet-dependent')).toBe(false);
      });

      it('padding container should default to coveo-facet-column', () => {
        const facetColumn = $$('div', { className: 'coveo-facet-column' });
        const dummyDivParent = $$('div');
        test = Mock.advancedComponentSetup<Facet>(
          Facet,
          new Mock.AdvancedComponentSetupOptions(undefined, {}, (builder: Mock.MockEnvironmentBuilder) => {
            facetColumn.append(builder.element);
            dummyDivParent.append(builder.element);
            facetColumn.append(dummyDivParent.el);
            return builder;
          })
        );

        expect(test.cmp.options.paddingContainer).toBe(facetColumn.el);
      });

      it('padding container should default to the parent container if there is no coveo-facet-column', () => {
        const dummyDivParent = $$('div');
        test = Mock.advancedComponentSetup<Facet>(
          Facet,
          new Mock.AdvancedComponentSetupOptions(undefined, {}, (builder: Mock.MockEnvironmentBuilder) => {
            dummyDivParent.append(builder.element);
            return builder;
          })
        );
        expect(test.cmp.options.paddingContainer).toBe(dummyDivParent.el);
      });
    });
  });
}
