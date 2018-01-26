import * as Mock from '../MockEnvironment';
import { FieldValue } from '../../src/ui/FieldValue/FieldValue';
import { FakeResults } from '../Fake';
import { IFieldValueOptions } from '../../src/ui/FieldValue/FieldValue';
import { $$ } from '../../src/utils/Dom';
import { TemplateHelpers } from '../../src/ui/Templates/TemplateHelpers';
import { Facet } from '../../src/ui/Facet/Facet';
import { FacetValues } from '../../src/ui/Facet/FacetValues';
import { FacetValue } from '../../src/ui/Facet/FacetValues';
import { IDateToStringOptions } from '../../src/utils/DateUtils';
import { DateUtils } from '../../src/utils/DateUtils';
import * as _ from 'underscore';

export function FieldValueTest() {
  describe('FieldValue', () => {
    let test: Mock.IBasicComponentSetup<FieldValue>;
    let element: HTMLElement;

    beforeEach(() => {
      test = Mock.advancedResultComponentSetup<FieldValue>(FieldValue, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
        element: $$('span').el,
        cmpOptions: <IFieldValueOptions>{
          field: '@string'
        }
      });
      element = $$('span').el;
    });

    afterEach(() => {
      test = null;
      element = null;
    });

    describe('exposes options', () => {
      it('field not specified should default to @field', () => {
        test = Mock.optionsResultComponentSetup<FieldValue, IFieldValueOptions>(
          FieldValue,
          <IFieldValueOptions>{
            field: undefined
          },
          FakeResults.createFakeResult()
        );
        expect(test.cmp.options.field).toBe('@field');
      });

      it('facet should use the field value by default', () => {
        test = Mock.optionsResultComponentSetup<FieldValue, IFieldValueOptions>(
          FieldValue,
          <IFieldValueOptions>{
            field: '@foobarde'
          },
          FakeResults.createFakeResult()
        );
        expect(test.cmp.options.facet).toBe('@foobarde');
      });

      it("htmlValue set to true should set the element's innerHTML value properly", () => {
        test = Mock.advancedResultComponentSetup<FieldValue>(
          FieldValue,
          FakeResults.createFakeResult(),
          <Mock.AdvancedComponentSetupOptions>{
            element: element,
            cmpOptions: <IFieldValueOptions>{
              field: '@foobarde',
              htmlValue: true
            }
          }
        );
        expect(test.cmp.renderOneValue('<em>patatefrietz</em>').innerHTML).toBe('<em>patatefrietz</em>');
      });

      it('htmlValue set to false should set the value in text node', () => {
        test = Mock.advancedResultComponentSetup<FieldValue>(
          FieldValue,
          FakeResults.createFakeResult(),
          <Mock.AdvancedComponentSetupOptions>{
            element: element,
            cmpOptions: <IFieldValueOptions>{
              field: '@foobarde',
              htmlValue: false
            }
          }
        );

        expect(test.cmp.renderOneValue('<em>patatefrietz</em>').textContent).toBe('<em>patatefrietz</em>');
      });

      it('splitValues should display the array of values separated by commas when the input values are semi-colon separated', () => {
        const result = FakeResults.createFakeResult();
        result.raw.foobarde = 'this;is;sparta';

        test = Mock.advancedResultComponentSetup<FieldValue>(FieldValue, result, <Mock.AdvancedComponentSetupOptions>{
          element: element,
          cmpOptions: <IFieldValueOptions>{
            field: '@foobarde',
            splitValues: true,
            separator: ';'
          }
        });
        expect(test.cmp.element.textContent).toBe('this, is, sparta');
      });

      it('displaySeparator should modify the string displayed between values of a multi-value field', () => {
        const result = FakeResults.createFakeResult();
        result.raw.foobarde = 'this;is;sparta';

        test = Mock.advancedResultComponentSetup<FieldValue>(FieldValue, result, <Mock.AdvancedComponentSetupOptions>{
          element: element,
          cmpOptions: <IFieldValueOptions>{
            field: '@foobarde',
            splitValues: true,
            separator: ';',
            displaySeparator: '<->'
          }
        });
        expect(test.cmp.element.textContent).toBe('this<->is<->sparta');
      });

      it('separator should specify the string used to split a multi-value field from the index', () => {
        const result = FakeResults.createFakeResult();
        result.raw.foobarde = 'this,is,sparta';

        test = Mock.advancedResultComponentSetup<FieldValue>(FieldValue, result, <Mock.AdvancedComponentSetupOptions>{
          element: element,
          cmpOptions: <IFieldValueOptions>{
            field: '@foobarde',
            splitValues: true,
            separator: ','
          }
        });
        expect(test.cmp.element.textContent).toBe('this, is, sparta');
      });

      it('separator default value must be ;', () => {
        const result = FakeResults.createFakeResult();
        result.raw.foobarde = 'this;is;sparta';

        test = Mock.advancedResultComponentSetup<FieldValue>(FieldValue, result, <Mock.AdvancedComponentSetupOptions>{
          element: element,
          cmpOptions: <IFieldValueOptions>{
            field: '@foobarde',
            splitValues: true
          }
        });
        expect(test.cmp.element.textContent).toBe('this, is, sparta');
      });

      it('splitValues should display the array of values separated by commas when the input values are in an array', () => {
        const result = FakeResults.createFakeResult();
        result.raw.foobarde = ['this', 'is', 'sparta'];

        test = Mock.advancedResultComponentSetup<FieldValue>(FieldValue, result, <Mock.AdvancedComponentSetupOptions>{
          element: element,
          cmpOptions: <IFieldValueOptions>{
            field: '@foobarde',
            splitValues: true
          }
        });
        expect(test.cmp.element.textContent).toBe('this, is, sparta');
      });

      it('helper should render using the specified helper', () => {
        test = Mock.advancedResultComponentSetup<FieldValue>(
          FieldValue,
          FakeResults.createFakeResult(),
          <Mock.AdvancedComponentSetupOptions>{
            element: element,
            cmpOptions: <IFieldValueOptions>{
              field: '@foobarde',
              helper: 'hamburgerHelper'
            }
          }
        );
        TemplateHelpers.registerFieldHelper('hamburgerHelper', value => 'ham' + value + 'burger');
        expect(test.cmp.renderOneValue('1337').textContent).toEqual('ham1337burger');
      });

      it('helper should eliminate helperOptions that do not match the current helper', () => {
        test = Mock.advancedResultComponentSetup<FieldValue>(
          FieldValue,
          FakeResults.createFakeResult(),
          <Mock.AdvancedComponentSetupOptions>{
            element: element,
            cmpOptions: <IFieldValueOptions>{
              field: '@author',
              helper: 'anchor',
              htmlValue: true
            }
          }
        );

        const anchor = $$(test.cmp.element).find('a');

        expect(anchor.outerHTML).toEqual('<a href="o.o">o.o</a>');
      });

      it('helper should try and execute a version 2 of the helper if found', () => {
        test = Mock.advancedResultComponentSetup<FieldValue>(
          FieldValue,
          FakeResults.createFakeResult(),
          <Mock.AdvancedComponentSetupOptions>{
            element: element,
            cmpOptions: <IFieldValueOptions>{
              field: '@foo',
              helper: 'somehelper'
            }
          }
        );
        TemplateHelpers.registerFieldHelper('somehelper', value => 'version1');
        TemplateHelpers.registerFieldHelper('somehelperv2', value => 'version2');
        expect(test.cmp.renderOneValue('somevalue').textContent).toEqual('version2');
      });

      it('should not crash and render the default value if the helper does not exist', () => {
        test = Mock.advancedResultComponentSetup<FieldValue>(
          FieldValue,
          FakeResults.createFakeResult(),
          <Mock.AdvancedComponentSetupOptions>{
            element: element,
            cmpOptions: <IFieldValueOptions>{
              field: '@foo',
              helper: 'somehelperwhichdoesnotexist'
            }
          }
        );

        expect(test.cmp.renderOneValue('somevalue').textContent).toEqual('somevalue');
      });

      it('should support shorten helper', () => {
        test = Mock.advancedResultComponentSetup<FieldValue>(
          FieldValue,
          FakeResults.createFakeResult(),
          <Mock.AdvancedComponentSetupOptions>{
            element: element,
            cmpOptions: <IFieldValueOptions>{
              field: '@longfieldvalue',
              helper: 'shorten'
            }
          }
        );

        expect(test.cmp.renderOneValue(_.range(0, 1000).join('-')).textContent.length).toBe(200);
      });

      it('textCaption should render a text value', () => {
        test = Mock.advancedResultComponentSetup<FieldValue>(
          FieldValue,
          FakeResults.createFakeResult(),
          <Mock.AdvancedComponentSetupOptions>{
            element: element,
            cmpOptions: <IFieldValueOptions>{
              field: '@title',
              textCaption: '<script>alert("Potatoes")</script>'
            }
          }
        );

        expect($$(test.cmp.element).text()).toContain('<script>alert("Potatoes")</script>');
      });

      it('textCaption should render in front of the fieldValue', () => {
        test = Mock.advancedResultComponentSetup<FieldValue>(
          FieldValue,
          FakeResults.createFakeResult(),
          <Mock.AdvancedComponentSetupOptions>{
            element: element,
            cmpOptions: <IFieldValueOptions>{
              field: '@title',
              textCaption: 'this is a test'
            }
          }
        );
        expect($$($$(test.cmp.element).children()[0]).hasClass('coveo-field-caption')).toBe(true);
      });

      it('textCaption option should add the class coveo-with-label to the CoveoFieldValue', () => {
        test = Mock.advancedResultComponentSetup<FieldValue>(
          FieldValue,
          FakeResults.createFakeResult(),
          <Mock.AdvancedComponentSetupOptions>{
            element: element,
            cmpOptions: <IFieldValueOptions>{
              field: '@title',
              textCaption: 'this is a test'
            }
          }
        );
        expect($$(test.cmp.element).hasClass('coveo-with-label')).toBe(true);
      });
    });

    it('should display the proper field value', () => {
      expect($$(test.cmp.element).find('span').textContent).toBe('string value');
    });

    describe('with a related facet', () => {
      let facet: Facet;

      beforeEach(() => {
        facet = Mock.mock<Facet>(Facet);

        facet.values = Mock.mock<FacetValues>(FacetValues);
        facet.values.get = () => {
          const value = Mock.mock<FacetValue>(FacetValue);
          value.selected = true;
          return value;
        };
      });

      afterEach(() => {
        facet = null;
      });

      it('should display the field value as clickable when its facet is enabled', () => {
        facet.disabled = false;
        test = Mock.advancedResultComponentSetup<FieldValue>(
          FieldValue,
          FakeResults.createFakeResult(),
          <Mock.AdvancedComponentSetupOptions>{
            element: element,
            modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
              builder.componentStateModel.get = () => [facet];
              builder.queryStateModel.get = () => [];
              return builder;
            },
            cmpOptions: {
              field: '@string'
            }
          }
        );
        expect($$($$(test.cmp.element).find('span')).hasClass('coveo-clickable')).toBe(true);
      });

      it('should not display the field value as clickable when its facet is disabled', () => {
        facet.disabled = true;
        test = Mock.advancedResultComponentSetup<FieldValue>(
          FieldValue,
          FakeResults.createFakeResult(),
          <Mock.AdvancedComponentSetupOptions>{
            element: element,
            modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
              builder.componentStateModel.get = () => [facet];
              builder.queryStateModel.get = () => [];
              return builder;
            },
            cmpOptions: {
              field: '@string'
            }
          }
        );
        expect($$($$(test.cmp.element).find('span')).hasClass('coveo-clickable')).toBe(false);
      });
    });

    it('should show a full date tooltip when it has a date, dateTime or emailDateTime helper', () => {
      const fakeResult = FakeResults.createFakeResult();
      const options = {
        field: '@date',
        helper: 'date'
      };

      const fullDateOptions: IDateToStringOptions = {
        useLongDateFormat: true,
        useTodayYesterdayAndTomorrow: false,
        useWeekdayIfThisWeek: false,
        omitYearIfCurrentOne: false
      };

      const dateString = DateUtils.dateToString(new Date(parseInt(fakeResult.raw.date)), fullDateOptions);
      const dateTimeString = DateUtils.dateTimeToString(new Date(parseInt(fakeResult.raw.date)), fullDateOptions);

      test = Mock.optionsResultComponentSetup<FieldValue, IFieldValueOptions>(FieldValue, options, fakeResult);
      expect(
        $$(test.cmp.element)
          .find('span')
          .getAttribute('title')
      ).toEqual(dateString);

      options.helper = 'dateTime';
      test = Mock.optionsResultComponentSetup<FieldValue, IFieldValueOptions>(FieldValue, options, fakeResult);
      expect(
        $$(test.cmp.element)
          .find('span')
          .getAttribute('title')
      ).toEqual(dateTimeString);

      options.helper = 'emailDateTime';
      test = Mock.optionsResultComponentSetup<FieldValue, IFieldValueOptions>(FieldValue, options, fakeResult);
      expect(
        $$(test.cmp.element)
          .find('span')
          .getAttribute('title')
      ).toEqual(dateTimeString);
    });

    it("should not show a full date tooltip if it doesn't have the helper is not a date", () => {
      test = Mock.optionsResultComponentSetup<FieldValue, IFieldValueOptions>(
        FieldValue,
        <IFieldValueOptions>{
          field: '@string'
        },
        FakeResults.createFakeResult()
      );
      expect(
        $$(test.cmp.element)
          .find('span')
          .hasAttribute('title')
      ).toBe(false);
    });
  });
}
