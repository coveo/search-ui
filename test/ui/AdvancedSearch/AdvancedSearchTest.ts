import {AdvancedSearch, IAdvancedSearchOptions} from '../../../src/ui/AdvancedSearch/AdvancedSearch';
import {IAdvancedSearchInput, IAdvancedSearchPrebuiltInput} from '../../../src/ui/AdvancedSearch/AdvancedSearchInput';
import {AdvancedSearchEvents, IBuildingAdvancedSearchEventArgs} from '../../../src/events/AdvancedSearchEvents';
import {SizeInput} from '../../../src/ui/AdvancedSearch/DocumentInput/SizeInput';
import {QueryBuilder} from '../../../src/ui/Base/QueryBuilder';
import {ExpressionBuilder} from '../../../src/ui/Base/ExpressionBuilder';
import {SimpleFieldInput} from '../../../src/ui/AdvancedSearch/DocumentInput/SimpleFieldInput';
import {Simulate} from '../../Simulate';
import {$$} from '../../../src/utils/Dom';
import {l} from '../../../src/strings/Strings';
import * as Mock from '../../MockEnvironment';

export function AdvancedSearchTest() {
  describe('AdvancedSearch', () => {
    var test: Mock.IBasicComponentSetup<AdvancedSearch>;

    beforeEach(function () {
      test = Mock.basicComponentSetup<AdvancedSearch>(AdvancedSearch);
    });

    afterEach(function () {
      test = null;
    });

    it('should allow to customize inputs', () => {
      let customInput = {
        build: () => {
          return $$('div').el;
        },
        updateQuery: (queryBuilder) => {
          queryBuilder.advancedExpression.add('test');
        }
      }

      onBuildingSearch(customInput);

      $$(test.env.element).empty();
      test = Mock.advancedComponentSetup<AdvancedSearch>(AdvancedSearch, new Mock.AdvancedComponentSetupOptions(test.env.element));

      let simulate = Simulate.query(test.env);
      expect(simulate.queryBuilder.advancedExpression.build()).toEqual('test');
    })

    it('should be able to add a custom input to an existing section', () => {
      let customInput = {
        build: () => {
          return $$('div', { className: 'coveo-test' }).el;
        },
        updateQuery: (queryBuilder) => {
          queryBuilder.advancedExpression.add('test');
        }
      }

      $$(test.env.element).on(AdvancedSearchEvents.buildingAdvancedSearch, (e: Event, data: IBuildingAdvancedSearchEventArgs) => {
        data.sections[0].inputs.push(customInput);
      })

      $$(test.env.element).empty();
      test = Mock.advancedComponentSetup<AdvancedSearch>(AdvancedSearch, new Mock.AdvancedComponentSetupOptions(test.env.element));

      let section = getSection(l('Keywords'));
      expect($$(section).find('.coveo-test')).toBeTruthy();
    })

    it('should be able to remove a specific input from default section', () => {
      $$(test.env.element).on(AdvancedSearchEvents.buildingAdvancedSearch, (e: Event, data: IBuildingAdvancedSearchEventArgs) => {
        data.sections[2].inputs = _.filter(data.sections[2].inputs, (input) => {
          return !(input instanceof SizeInput);
        })
      })

      $$(test.env.element).empty();
      test = Mock.advancedComponentSetup<AdvancedSearch>(AdvancedSearch, new Mock.AdvancedComponentSetupOptions(test.env.element));

      let sizeInput = _.filter(test.cmp.inputs, (input) => {
        return input instanceof SizeInput;
      })

      expect(sizeInput).toBeTruthy();
    })

    it('can create default inputs for custom sections', () => {
      let customInput = {
        name: 'document_size'
      }

      onBuildingSearch(customInput);

      $$(test.env.element).empty();
      test = Mock.advancedComponentSetup<AdvancedSearch>(AdvancedSearch, new Mock.AdvancedComponentSetupOptions(test.env.element, {
        includeKeywords: false,
        includeDate: false,
        includeDocument: false
      }));

      let sizeInput = _.find(test.cmp.inputs, (input) => {
        return input instanceof SizeInput;
      })
      expect(sizeInput).toBeTruthy();
    })

    it('can create default inputs with options', () => {
      let customInput = {
        name: 'document_field',
        parameters: {
          name: 'test',
          field: '@test'
        }
      }

      onBuildingSearch(customInput);

      $$(test.env.element).empty();
      test = Mock.advancedComponentSetup<AdvancedSearch>(AdvancedSearch, new Mock.AdvancedComponentSetupOptions(test.env.element, {
        includeKeywords: false,
        includeDate: false,
        includeDocument: false
      }));

      let simpleFieldInput = <SimpleFieldInput>_.find(test.cmp.inputs, (input) => {
        return input instanceof SimpleFieldInput;
      })
      let queryBuilder = Mock.mock<QueryBuilder>(QueryBuilder);
      queryBuilder.advancedExpression = Mock.mock<ExpressionBuilder>(ExpressionBuilder);
      expect(simpleFieldInput.fieldName).toEqual('@test');
    })

    describe('exposes includeKeywords', () => {
      it('should include the keywords section by default', () => {
        expect(getSection(l('Keywords'))).not.toBeUndefined();
      })
      it('should not include the keywords section if false', () => {
        test = Mock.optionsComponentSetup<AdvancedSearch, IAdvancedSearchOptions>(AdvancedSearch, { includeKeywords: false });
        expect(getSection(l('Keywords'))).toBeUndefined();
      })
    })

    describe('exposes includeDate', () => {
      it('should include the date section by default', () => {
        expect(getSection(l('Date'))).not.toBeUndefined();
      })
      it('should not include the date section if false', () => {
        test = Mock.optionsComponentSetup<AdvancedSearch, IAdvancedSearchOptions>(AdvancedSearch, { includeDate: false });
        expect(getSection(l('Date'))).toBeUndefined();
      })
    })

    describe('exposes includeDocument', () => {
      it('should include the document section by default', () => {
        expect(getSection(l('Document'))).not.toBeUndefined();
      })
      it('should not include the document section if false', () => {
        test = Mock.optionsComponentSetup<AdvancedSearch, IAdvancedSearchOptions>(AdvancedSearch, { includeDocument: false });
        expect(getSection(l('Document'))).toBeUndefined();
      })
    })

    describe('executeAdvancedSearch', () => {

      beforeEach(() => {
        test.cmp.inputs = [jasmine.createSpyObj('input', ['build', 'updateQueryState'])]
      })
      it('should execute a query', () => {
        test.cmp.executeAdvancedSearch();
        expect(test.cmp.queryController.executeQuery).toHaveBeenCalled();
      })
    })

    function getSection(section: string) {
      let sectionsTitle = $$(test.cmp.element).findAll('.coveo-advanced-search-section-title');
      let title = _.find(sectionsTitle, (title) => {
        return title.innerText == section
      })
      return title ? title.parentElement : undefined;
    }

    function onBuildingSearch(input: IAdvancedSearchInput | IAdvancedSearchPrebuiltInput) {
      $$(test.env.element).on(AdvancedSearchEvents.buildingAdvancedSearch, (e: Event, data: IBuildingAdvancedSearchEventArgs) => {
        data.sections.push({
          name: 'custom',
          inputs: [input]
        });
      })
    }
  })
}
