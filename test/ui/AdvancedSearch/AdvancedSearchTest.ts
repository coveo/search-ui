import {AdvancedSearch, IAdvancedSearchOptions} from '../../../src/ui/AdvancedSearch/AdvancedSearch';
import {AdvancedSearchEvents, IBuildingAdvancedSearchEventArgs} from '../../../src/events/AdvancedSearchEvents';
import {QueryBuilder} from '../../../src/ui/Base/QueryBuilder';
import {Simulate} from '../../Simulate';
import {$$} from '../../../src/utils/Dom';
import {l} from '../../../src/strings/Strings';
import * as Mock from '../../MockEnvironment';
import {TextInput} from '../../../src/ui/AdvancedSearch/Form/TextInput';
import {NumericSpinner} from '../../../src/ui/AdvancedSearch/Form/NumericSpinner';
import {DatePicker} from '../../../src/ui/AdvancedSearch/Form/DatePicker';
import {BaseFormTypes} from '../../../src/ui/AdvancedSearch/AdvancedSearchInput';
import {AdvancedComponentSetupOptions} from '../../MockEnvironment';
import {MockEnvironmentBuilder} from '../../MockEnvironment';
import {analyticsActionCauseList} from '../../../src/ui/Analytics/AnalyticsActionListMeta';

export function AdvancedSearchTest() {
  describe('AdvancedSearch', () => {
    var test: Mock.IBasicComponentSetup<AdvancedSearch>;

    beforeEach(function () {
      test = Mock.basicComponentSetup<AdvancedSearch>(AdvancedSearch);
    });

    afterEach(function () {
      test = null;
    });

    it('shoud allow to customize inputs', () => {

      let root = $$('div').el;
      let textInput = new TextInput(() => {
      }, 'MyTextInput');
      let numericInput = new NumericSpinner(() => {
      }, 0, 10);
      let dpicker = new DatePicker(() => {
      });

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
          inputs: [textInput, numericInput, dpicker]
        });
      });

      test = Mock.advancedComponentSetup<AdvancedSearch>(AdvancedSearch, new AdvancedComponentSetupOptions(undefined, undefined, (builder: MockEnvironmentBuilder) => {
        builder.root = root;
        return builder;
      }));

      Simulate.query(test.env);

    });

    describe('exposes includeKeywords', () => {
      it('should include the keywords section by default', () => {
        expect(getSection(l('Keywords'))).not.toBeUndefined();
      });
      it('should not include the keywords section if false', () => {
        test = Mock.optionsComponentSetup<AdvancedSearch, IAdvancedSearchOptions>(AdvancedSearch, { includeKeywords: false });
        expect(getSection(l('Keywords'))).toBeUndefined();
      });
    });

    describe('exposes includeDate', () => {
      it('should include the date section by default', () => {
        expect(getSection(l('Date'))).not.toBeUndefined();
      });
      it('should not include the date section if false', () => {
        test = Mock.optionsComponentSetup<AdvancedSearch, IAdvancedSearchOptions>(AdvancedSearch, { includeDate: false });
        expect(getSection(l('Date'))).toBeUndefined();
      });
    });

    describe('exposes includeDocument', () => {
      it('should include the document section by default', () => {
        expect(getSection(l('Document'))).not.toBeUndefined();
      });
      it('should not include the document section if false', () => {
        test = Mock.optionsComponentSetup<AdvancedSearch, IAdvancedSearchOptions>(AdvancedSearch, { includeDocument: false });
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
        expect(test.env.usageAnalytics.logSearchEvent).toHaveBeenCalledWith(analyticsActionCauseList.advancedSearch, jasmine.objectContaining({}));
      });
    });

    function getSection(section: string) {
      let sectionsTitle = $$(test.cmp.element).findAll('.coveo-advanced-search-section-title');
      let title = _.find(sectionsTitle, (title) => {
        return title.innerText == section;
      });
      return title ? title.parentElement : undefined;
    }
  });
}
