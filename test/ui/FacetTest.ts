import * as Mock from '../MockEnvironment';
import {Facet, IFacetOptions} from '../../src/ui/Facet/Facet';
import {$$} from '../../src/utils/Dom';
import {FacetValue} from '../../src/ui/Facet/FacetValues';
import {Simulate} from '../Simulate';
import {FakeResults} from '../Fake';
import {OmniboxEvents} from '../../src/events/OmniboxEvents';
import {BreadcrumbEvents} from '../../src/events/BreadcrumbEvents';
import {IPopulateBreadcrumbEventArgs} from '../../src/events/BreadcrumbEvents';
import {IPopulateOmniboxEventArgs} from '../../src/events/OmniboxEvents';

export function FacetTest() {
  describe('Facet', function () {
    var test: Mock.IBasicComponentSetup<Facet>;

    beforeEach(function () {
      test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
        field: '@field'
      });
      test.cmp.searchInterface.isNewDesign = () => {
        return true;
      };
    });

    afterEach(function () {
      test = null;
    });

    it('allows to select a value', function () {
      expect(test.cmp.getDisplayedFacetValues()).not.toContain('foobar');
      test.cmp.selectValue('foobar');
      expect(test.cmp.getDisplayedValues()).toContain('foobar');
      expect(test.cmp.values.get('foobar').selected).toBe(true);
    });

    it('allows to select multiple value', function () {
      expect(test.cmp.getDisplayedFacetValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      test.cmp.selectMultipleValues(['foo', 'bar', 'baz']);
      expect(test.cmp.getDisplayedValues()).toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      expect(test.cmp.values.get('foo').selected).toBe(true);
    });

    it('allows to deselect a value', function () {
      expect(test.cmp.getDisplayedFacetValues()).not.toContain('foobar');
      test.cmp.selectValue('foobar');
      expect(test.cmp.getDisplayedValues()).toContain('foobar');
      expect(test.cmp.values.get('foobar').selected).toBe(true);
      test.cmp.deselectValue('foobar');
      expect(test.cmp.getDisplayedFacetValues()).not.toContain('foobar');
      expect(test.cmp.values.get('foobar').selected).not.toBe(true);
    });

    it('allows to deselect multiple values', function () {
      expect(test.cmp.getDisplayedFacetValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      test.cmp.selectMultipleValues(['foo', 'bar', 'baz']);
      expect(test.cmp.getDisplayedValues()).toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      expect(test.cmp.values.get('foo').selected).toBe(true);
      test.cmp.deselectMultipleValues(['foo', 'bar', 'baz']);
      expect(test.cmp.getDisplayedFacetValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      expect(test.cmp.values.get('foo').selected).not.toBe(true);
    });

    it('allows to exclude a value', function () {
      expect(test.cmp.getDisplayedFacetValues()).not.toContain('foobar');
      test.cmp.excludeValue('foobar');
      expect(test.cmp.getDisplayedValues()).toContain('foobar');
      expect(test.cmp.values.get('foobar').excluded).toBe(true);
    });

    it('allows to exclude multiple value', function () {
      expect(test.cmp.getDisplayedFacetValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      test.cmp.excludeMultipleValues(['foo', 'bar', 'baz']);
      expect(test.cmp.getDisplayedValues()).toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      expect(test.cmp.values.get('foo').excluded).toBe(true);
    });

    it('allows to unexclude a value', function () {
      expect(test.cmp.getDisplayedFacetValues()).not.toContain('foobar');
      test.cmp.excludeValue('foobar');
      expect(test.cmp.getDisplayedValues()).toContain('foobar');
      expect(test.cmp.values.get('foobar').excluded).toBe(true);
      test.cmp.unexcludeValue('foobar');
      expect(test.cmp.getDisplayedFacetValues()).not.toContain('foobar');
      expect(test.cmp.values.get('foobar').excluded).not.toBe(true);
    });

    it('allows to unexclude multiple values', function () {
      expect(test.cmp.getDisplayedFacetValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      test.cmp.excludeMultipleValues(['foo', 'bar', 'baz']);
      expect(test.cmp.getDisplayedValues()).toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      expect(test.cmp.values.get('foo').excluded).toBe(true);
      test.cmp.unexcludeMultipleValues(['foo', 'bar', 'baz']);
      expect(test.cmp.getDisplayedFacetValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar', 'baz']));
      expect(test.cmp.values.get('foo').excluded).not.toBe(true);
    });

    it('allows to toggleSelectValue', function () {
      expect(test.cmp.getDisplayedFacetValues()).not.toContain('foobar');
      test.cmp.toggleSelectValue('foobar');
      expect(test.cmp.getDisplayedValues()).toContain('foobar');
      expect(test.cmp.values.get('foobar').selected).toBe(true);
      test.cmp.toggleSelectValue('foobar');
      expect(test.cmp.values.get('foobar').selected).toBe(false);
    });

    it('allows to toggleExcludeValue', function () {
      expect(test.cmp.getDisplayedFacetValues()).not.toContain('foobar');
      test.cmp.toggleExcludeValue('foobar');
      expect(test.cmp.getDisplayedValues()).toContain('foobar');
      expect(test.cmp.values.get('foobar').excluded).toBe(true);
      test.cmp.toggleExcludeValue('foobar');
      expect(test.cmp.values.get('foobar').excluded).toBe(false);
    });

    it('allows to getSelectedValues', function () {
      expect(test.cmp.getSelectedValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar']));
      test.cmp.selectMultipleValues(['foo', 'bar']);
      expect(test.cmp.getSelectedValues()).toEqual(jasmine.arrayContaining(['foo', 'bar']));
    });

    it('allows to getExcludedValues', function () {
      expect(test.cmp.getExcludedValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar']));
      test.cmp.excludeMultipleValues(['foo', 'bar']);
      expect(test.cmp.getExcludedValues()).toEqual(jasmine.arrayContaining(['foo', 'bar']));
    });

    it('allows to reset', function () {
      test.cmp.selectMultipleValues(['foo', 'bar']);
      test.cmp.excludeMultipleValues(['a', 'b']);
      expect(test.cmp.getSelectedValues()).toEqual(jasmine.arrayContaining(['foo', 'bar']));
      expect(test.cmp.getExcludedValues()).toEqual(jasmine.arrayContaining(['a', 'b']));
      test.cmp.reset();
      expect(test.cmp.getSelectedValues()).not.toEqual(jasmine.arrayContaining(['foo', 'bar']));
      expect(test.cmp.getExcludedValues()).not.toEqual(jasmine.arrayContaining(['a', 'b']));
    });

    it('allows to update sort', function () {
      expect(test.cmp.options.sortCriteria).not.toBe('score');
      test.cmp.updateSort('score');
      expect(test.cmp.options.sortCriteria).toBe('score');
      expect(test.env.queryController.executeQuery).toHaveBeenCalled();
    });

    it('allows to showWaitingAnimation and hideWaitingAnimation', function () {
      test.cmp.showWaitingAnimation();
      expect($$(test.cmp.element).find('.coveo-facet-header-wait-animation').style.display).not.toBe('none');
      test.cmp.hideWaitingAnimation();
      expect($$(test.cmp.element).find('.coveo-facet-header-wait-animation').style.display).toBe('none');
    });

    it('allows to getValueCaption', function () {
      test.cmp.options.field = '@filetype';
      expect(test.cmp.getValueCaption(FacetValue.createFromValue('foo'))).toBe('foo');
      expect(test.cmp.getValueCaption(FacetValue.createFromValue('txt'))).toBe('Text');
    });

    describe('exposes options', function () {
      it('title should set the title', function () {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          title: 'My cool facet'
        });
        test.cmp.ensureDom();
        expect(test.cmp.facetHeader.options.title).toBe('My cool facet');
      });

      it('field should set the field in the query', function () {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@myfield'
        });
        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.groupByRequests).toEqual(jasmine.arrayContaining([
          jasmine.objectContaining({
            field: '@myfield'
          })
        ]));
      });

      it('headerIcon should allow to set an icon in the header', function () {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          headerIcon: 'my cool icon'
        });

        test.cmp.ensureDom();
        expect(test.cmp.facetHeader.options.icon).toBe('my cool icon');
      });

      it('id should be the field by default, or specified manually', function () {
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

      it('isMultiValueField should trigger another query to update delta', function () {
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

      it('numberOfValues should specify the number of value requested in the query', function () {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          numberOfValues: 13
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
          maximumNumberOfValues: 13 + 1 // one more for the more less function
        })]));
      });

      it('pageSize should specify the number of values for the more option', function () {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          pageSize: 13
        });
        test.cmp.showMore();
        expect(test.cmp.getEndpoint().search).toHaveBeenCalledWith(jasmine.objectContaining({
          groupBy: jasmine.arrayContaining([jasmine.objectContaining({
            maximumNumberOfValues: 13 + test.cmp.options.numberOfValues + 1 // 13 + already displayed at start + 1 more for next more
          })])
        }));
      });

      it('lookupField should specify the lookupfield to use in the query', function () {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          lookupField: '@lookupfield'
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
          lookupField: '@lookupfield'
        })]));
      });

      it('enableSettings should specify if the setting component is initialized', function () {
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

      it('enableSettingsFacetState should specify if the option is passed to the setting component', function () {
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

      it('availableSorts should specify the available criteria in the setting component', function () {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          availableSorts: ['ChiSquare', 'NoSort']
        });
        test.cmp.ensureDom();
        expect(test.cmp.facetSettings.sorts).toEqual(jasmine.arrayContaining(['ChiSquare', 'NoSort']));
      });

      it('sortCriteria should specify the first available sort if not specified', function () {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          availableSorts: ['ChiSquare', 'NoSort']
        });

        expect(test.cmp.options.sortCriteria).toBe('ChiSquare');
      });

      it('sortCriteria should specify the sort group by request', function () {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          sortCriteria: 'score'
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
          sortCriteria: 'score'
        })]));
      });

      it('customSort should specify the sort of values when rendered', function () {
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

      it('injectionDepth should specify the injection depth in a group by', function () {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          injectionDepth: 9999
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
          injectionDepth: 9999
        })]));
      });

      it('showIcon should specify if the icon is displayed near each values', function () {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          showIcon: true
        });
        test.env.searchInterface.isNewDesign = () => false; // necessary since showIcon is a legacy option
        test.cmp.ensureDom();
        expect(test.cmp.facetValuesList.get('foo').renderer.icon).toBeDefined();

        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          showIcon: false
        });
        test.cmp.ensureDom();
        expect(test.cmp.facetValuesList.get('foo').renderer.icon).toBeUndefined();
      });

      it('useAnd should specify the filter generated by a facet', function () {
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

      it('allowTogglingOperator should specify if the toggle is rendered in header ', function () {
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

      it('enableFacetSearch should specify if the facet search is rendered', function () {
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

      it('facetSearchDelay should be passed to the facet search component', function (done) {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          facetSearchDelay: 5
        });
        test.cmp.searchInterface.isNewDesign = () => true;
        test.cmp.ensureDom();
        test.cmp.facetSearch.focus();
        setTimeout(() => {
          expect(test.cmp.getEndpoint().search).toHaveBeenCalled();
          done();
        }, 6); // one more ms then facetSearchDelay
      });

      it('numberOfValuesInFacetSearch should be passed to the facet search component', function (done) {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          numberOfValuesInFacetSearch: 13
        });
        test.cmp.searchInterface.isNewDesign = () => true;
        test.cmp.ensureDom();
        test.cmp.facetSearch.focus();
        setTimeout(() => {
          expect(test.cmp.getEndpoint().search).toHaveBeenCalledWith(jasmine.objectContaining({
            groupBy: jasmine.arrayContaining([jasmine.objectContaining({
              maximumNumberOfValues: 13
            })])
          }));
          done();
        }, test.cmp.options.facetSearchDelay + 10);
      });

      it('includeInBreadcrumb should specify if the facet listen to breadcrumb events', function () {
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

      it('includeInOmnibox should specify if the facet listen to omnibox events', function () {
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

      it('computedField should specify the computed field to use in the query', function () {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          computedField: '@computedField'
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
          computedFields: jasmine.arrayContaining([jasmine.objectContaining({
            field: '@computedField'
          })])
        })]));
      });

      it('computedFieldOperation should specify the computed field to use in the query', function () {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          computedField: '@computedField',
          computedFieldOperation: 'qwerty'
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
          computedFields: jasmine.arrayContaining([jasmine.objectContaining({
            operation: 'qwerty'
          })])
        })]));
      });

      it('enableMoreLess should specify that the moreLess element should be rendered', function () {
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

      it('allowedValues should specify the value in the group by request', function () {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          allowedValues: ['a', 'b', 'c']
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
          allowedValues: jasmine.arrayContaining(['a', 'b', 'c'])
        })]));
      });

      it('additionalFilter should specify a query override in the group by request', function () {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          additionalFilter: '@qwerty==foobar'
        });

        var simulation = Simulate.query(test.env);
        expect(simulation.queryBuilder.build().groupBy).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
          constantQueryOverride: '@qwerty==foobar'
        })]));
      });

      it('dependsOn should specify a facet to depend on another one', function () {
        test = Mock.optionsComponentSetup<Facet, IFacetOptions>(Facet, {
          field: '@field',
          dependsOn: '@masterFacet'
        });

        var masterFacet = Mock.advancedComponentSetup<Facet>(Facet, new Mock.AdvancedComponentSetupOptions(undefined, {
          field: '@masterFacet'
        }, (builder: Mock.MockEnvironmentBuilder) => {
          return builder.withRoot(test.env.root);
        }));

        var results = FakeResults.createFakeResults();
        results.groupByResults = [FakeResults.createFakeGroupByResult('@field', 'foo', 15), FakeResults.createFakeGroupByResult('@masterFacet', 'foo', 15)];

        Simulate.query(test.env, {
          results: results
        });

        expect($$(test.cmp.element).hasClass('coveo-facet-dependent')).toBe(true);
        expect($$(masterFacet.cmp.element).hasClass('coveo-facet-dependent')).toBe(false);
      });
    });
  });
}
