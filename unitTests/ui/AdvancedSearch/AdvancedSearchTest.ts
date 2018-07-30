import { AdvancedSearch, IAdvancedSearchOptions } from '../../../src/ui/AdvancedSearch/AdvancedSearch';
import { AdvancedSearchEvents, IBuildingAdvancedSearchEventArgs } from '../../../src/events/AdvancedSearchEvents';
import { QueryBuilder } from '../../../src/ui/Base/QueryBuilder';
import { Simulate } from '../../Simulate';
import { $$ } from '../../../src/utils/Dom';
import { l } from '../../../src/strings/Strings';
import * as Mock from '../../MockEnvironment';
import { TextInput } from '../../../src/ui/FormWidgets/TextInput';
import { NumericSpinner } from '../../../src/ui/FormWidgets/NumericSpinner';
import { DatePicker } from '../../../src/ui/FormWidgets/DatePicker';
import { BaseFormTypes } from '../../../src/ui/AdvancedSearch/AdvancedSearchInput';
import { AdvancedComponentSetupOptions } from '../../MockEnvironment';
import { MockEnvironmentBuilder } from '../../MockEnvironment';
import { analyticsActionCauseList } from '../../../src/ui/Analytics/AnalyticsActionListMeta';
import _ = require('underscore');
import { BreadcrumbEvents, IPopulateBreadcrumbEventArgs } from '../../../src/events/BreadcrumbEvents';

export function AdvancedSearchTest() {
  describe('AdvancedSearch', () => {
    var test: Mock.IBasicComponentSetupWithModalBox<AdvancedSearch>;

    beforeEach(function() {
      test = Mock.basicComponentSetupWithModalBox<AdvancedSearch>(AdvancedSearch);
    });

    afterEach(function() {
      test = null;
    });

    it('shoud allow to customize inputs', () => {
      let root = $$('div').el;
      let textInput = new TextInput(() => {}, 'MyTextInput');
      let numericInput = new NumericSpinner(() => {}, 0, 10);
      let dpicker = new DatePicker(() => {});

      let sectionElement = $$('div');

      sectionElement.append(textInput.build());
      sectionElement.append(numericInput.build());
      sectionElement.append(dpicker.build());

      $$(root).on(AdvancedSearchEvents.buildingAdvancedSearch, (e: Event, args: IBuildingAdvancedSearchEventArgs) => {
        expect(args.executeQuery).toBeDefined();
        args.sections.push({
          content: sectionElement.el,
          name: 'My section',
          updateQuery: (inputs: BaseFormTypes[], queryBuilder: QueryBuilder) => {
            expect(inputs).toEqual(jasmine.arrayContaining([textInput, numericInput, dpicker]));
            expect(queryBuilder).toBeDefined();
          },
          inputs: <any[]>[textInput, numericInput, dpicker]
        });
      });

      test = Mock.advancedComponentSetupWithModalBox<AdvancedSearch>(
        AdvancedSearch,
        new AdvancedComponentSetupOptions(undefined, undefined, (builder: MockEnvironmentBuilder) => {
          builder.root = root;
          return builder;
        })
      );

      Simulate.query(test.env);
    });

    it('should open the modal box on open', () => {
      test.cmp.open();
      expect(test.modalBox.open).toHaveBeenCalled();
    });

    it('should close the modal box on close', () => {
      test.cmp.open();
      test.cmp.close();
      expect(test.modalBox.close).toHaveBeenCalled();
    });

    describe('exposes includeKeywords', () => {
      it('should include the keywords section by default', () => {
        expect(getSection(l('Keywords'))).not.toBeUndefined();
      });
      it('should not include the keywords section if false', () => {
        test = Mock.optionsComponentSetupWithModalBox<AdvancedSearch, IAdvancedSearchOptions>(AdvancedSearch, { includeKeywords: false });
        expect(getSection(l('Keywords'))).toBeUndefined();
      });
    });

    describe('exposes includeDate', () => {
      it('should include the date section by default', () => {
        expect(getSection(l('Date'))).not.toBeUndefined();
      });
      it('should not include the date section if false', () => {
        test = Mock.optionsComponentSetupWithModalBox<AdvancedSearch, IAdvancedSearchOptions>(AdvancedSearch, { includeDate: false });
        expect(getSection(l('Date'))).toBeUndefined();
      });
    });

    describe('exposes includeDocument', () => {
      it('should include the document section by default', () => {
        expect(getSection(l('Document'))).not.toBeUndefined();
      });
      it('should not include the document section if false', () => {
        test = Mock.optionsComponentSetupWithModalBox<AdvancedSearch, IAdvancedSearchOptions>(AdvancedSearch, { includeDocument: false });
        expect(getSection(l('Document'))).toBeUndefined();
      });
    });

    describe('executeAdvancedSearch', () => {
      beforeEach(() => {
        test.cmp.inputs = [jasmine.createSpyObj('input', ['build', 'updateQueryState'])];
      });

      it('should execute a query', () => {
        test.cmp.executeAdvancedSearch();
        expect(test.cmp.queryController.executeQuery).toHaveBeenCalled();
      });

      it('should log an analytics event', () => {
        test.cmp.executeAdvancedSearch();
        expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
          analyticsActionCauseList.advancedSearch,
          jasmine.objectContaining({})
        );
      });

      describe('on a new query event', () => {
        let updateQuerySpy: jasmine.Spy;
        let resetSpy: jasmine.Spy;
        beforeEach(() => {
          updateQuerySpy = jasmine.createSpy('updateQuery');
          resetSpy = jasmine.createSpy('reset');
          updateQuerySpy.and.callFake((queryBuilder: QueryBuilder) => {
            queryBuilder.advancedExpression.add('foo');
          });
          test.cmp.inputs[0].updateQuery = updateQuerySpy;
          test.cmp.inputs[0].reset = resetSpy;
        });

        afterEach(() => {
          updateQuerySpy = null;
          resetSpy = null;
        });

        it('should call updateQuery on each input', () => {
          const simulation = Simulate.query(test.env);
          expect(updateQuerySpy).toHaveBeenCalled();
          expect(simulation.queryBuilder.build().aq).toEqual('foo');
        });

        it('should populate breadcrumb if the query is modified by any input', done => {
          $$(test.env.root).on(BreadcrumbEvents.populateBreadcrumb, (e, args: IPopulateBreadcrumbEventArgs) => {
            expect(args.breadcrumbs.length).toEqual(1);
            done();
          });
          Simulate.query(test.env);
          expect(updateQuerySpy).toHaveBeenCalled();
          Simulate.breadcrumb(test.env);
        });

        it('should not populate breadcrumb if the query is not modified by any input', done => {
          $$(test.env.root).on(BreadcrumbEvents.populateBreadcrumb, (e, args: IPopulateBreadcrumbEventArgs) => {
            expect(args.breadcrumbs.length).toEqual(0);
            done();
          });
          updateQuerySpy.and.callFake((queryBuilder: QueryBuilder) => {
            // do nothing
          });
          Simulate.query(test.env);
          expect(updateQuerySpy).toHaveBeenCalled();
          Simulate.breadcrumb(test.env);
        });

        it('should call reset on each inputs when the breadcrumb is cleared', () => {
          Simulate.query(test.env);
          $$(test.env.root).trigger(BreadcrumbEvents.clearBreadcrumb);
          expect(resetSpy).toHaveBeenCalled();
        });

        it('should call reset on each inputs when only this part of the breadcrumb is cleared', done => {
          $$(test.env.root).on(BreadcrumbEvents.populateBreadcrumb, (e, args: IPopulateBreadcrumbEventArgs) => {
            expect(args.breadcrumbs.length).toEqual(1);

            const clear = $$(args.breadcrumbs[0].element).find('.coveo-advanced-search-breadcrumb-clear');
            $$(clear).trigger('click');
            expect(test.env.queryController.executeQuery).toHaveBeenCalled();
            expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(
              analyticsActionCauseList.breadcrumbAdvancedSearch,
              jasmine.any(Object)
            );
            done();
          });
          Simulate.query(test.env);
          Simulate.breadcrumb(test.env);
        });
      });
    });

    function getSection(section: string) {
      let sectionsTitle = $$(test.cmp.content).findAll('.coveo-advanced-search-section-title');
      let title = _.find(sectionsTitle, title => {
        return title.innerText == section;
      });
      return title ? title.parentElement : undefined;
    }
  });
}
