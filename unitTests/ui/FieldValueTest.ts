import * as Mock from '../MockEnvironment';
import { FieldValue } from '../../src/ui/FieldValue/FieldValue';
import { FakeResults } from '../Fake';
import { IFieldValueOptions } from '../../src/ui/FieldValue/FieldValue';
import { $$ } from '../../src/utils/Dom';
import { TemplateHelpers } from '../../src/ui/Templates/TemplateHelpers';
import { Facet } from '../../src/ui/Facet/Facet';
import { FacetValues } from '../../src/ui/Facet/FacetValues';
import { FacetValue } from '../../src/ui/Facet/FacetValue';
import { IDateToStringOptions } from '../../src/utils/DateUtils';
import { DateUtils } from '../../src/utils/DateUtils';
import * as _ from 'underscore';
import { l } from '../../src/Core';
import { DynamicFacet } from '../../src/ui/DynamicFacet/DynamicFacet';
import { DynamicFacetTestUtils } from './DynamicFacet/DynamicFacetTestUtils';

export function FieldValueTest() {
  describe('FieldValue', () => {
    let test: Mock.IBasicComponentSetup<FieldValue>;

    const getText = () => {
      return $$(test.cmp.element).find('span').textContent;
    };

    const getTitle = () => {
      return $$(test.cmp.element)
        .find('span')
        .getAttribute('title');
    };

    beforeEach(() => {
      initializeFieldValueComponent({ field: '@string' });
    });

    function initializeFieldValueComponent(
      options: IFieldValueOptions,
      result = FakeResults.createFakeResult(),
      facet?: Facet | DynamicFacet
    ) {
      result.raw.filetype = 'unknown';
      test = Mock.advancedResultComponentSetup<FieldValue>(FieldValue, result, <Mock.AdvancedComponentSetupOptions>{
        element: $$('span').el,
        cmpOptions: options,
        modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
          if (facet) {
            builder.componentStateModel.get = () => [facet];
            builder.queryStateModel.get = () => [];
          }
          return builder;
        }
      });
    }

    describe('exposes options', () => {
      it('field not specified should default to @field', () => {
        initializeFieldValueComponent({});
        expect(test.cmp.options.field).toBe('@field');
      });

      it('facet should use the field value by default', () => {
        initializeFieldValueComponent({ field: '@foobarde' });
        expect(test.cmp.options.facet).toBe('@foobarde');
      });

      it("htmlValue set to true should set the element's innerHTML value properly", () => {
        initializeFieldValueComponent({ field: '@foobarde', htmlValue: true });
        expect(test.cmp.renderOneValue('<em>patatefrietz</em>').innerHTML).toBe('<em>patatefrietz</em>');
      });

      it('htmlValue set to false should set the value in text node', () => {
        initializeFieldValueComponent({ field: '@foobarde', htmlValue: false });

        expect(test.cmp.renderOneValue('<em>patatefrietz</em>').textContent).toBe('<em>patatefrietz</em>');
      });

      it('splitValues should display the array of values separated by commas when the input values are semi-colon separated', () => {
        const result = FakeResults.createFakeResult();
        result.raw.foobarde = 'this;is;sparta';

        initializeFieldValueComponent(
          {
            field: '@foobarde',
            splitValues: true,
            separator: ';'
          },
          result
        );

        expect(test.cmp.element.textContent).toBe('this, is, sparta');
      });

      it('displaySeparator should modify the string displayed between values of a multi-value field', () => {
        const result = FakeResults.createFakeResult();
        result.raw.foobarde = 'this;is;sparta';

        initializeFieldValueComponent(
          {
            field: '@foobarde',
            splitValues: true,
            separator: ';',
            displaySeparator: '<->'
          },
          result
        );

        expect(test.cmp.element.textContent).toBe('this<->is<->sparta');
      });

      it('separator should specify the string used to split a multi-value field from the index', () => {
        const result = FakeResults.createFakeResult();
        result.raw.foobarde = 'this,is,sparta';

        initializeFieldValueComponent(
          {
            field: '@foobarde',
            splitValues: true,
            separator: ','
          },
          result
        );

        expect(test.cmp.element.textContent).toBe('this, is, sparta');
      });

      it('separator default value must be ;', () => {
        const result = FakeResults.createFakeResult();
        result.raw.foobarde = 'this;is;sparta';

        initializeFieldValueComponent(
          {
            field: '@foobarde',
            splitValues: true
          },
          result
        );

        expect(test.cmp.element.textContent).toBe('this, is, sparta');
      });

      it('splitValues should display the array of values separated by commas when the input values are in an array', () => {
        const result = FakeResults.createFakeResult();
        result.raw.foobarde = ['this', 'is', 'sparta'];

        initializeFieldValueComponent(
          {
            field: '@foobarde',
            splitValues: true
          },
          result
        );

        expect(test.cmp.element.textContent).toBe('this, is, sparta');
      });

      it('helper should render using the specified helper', () => {
        initializeFieldValueComponent({
          field: '@foobarde',
          helper: 'hamburgerHelper'
        });

        TemplateHelpers.registerFieldHelper('hamburgerHelper', value => 'ham' + value + 'burger');
        expect(test.cmp.renderOneValue('1337').textContent).toEqual('ham1337burger');
      });

      it('helper should eliminate helperOptions that do not match the current helper', () => {
        initializeFieldValueComponent({
          field: '@author',
          helper: 'anchor',
          htmlValue: true
        });

        const anchor = $$(test.cmp.element).find('a');

        expect(anchor.outerHTML).toEqual('<a href="o.o">o.o</a>');
      });

      it('helper should try and execute a version 2 of the helper if found', () => {
        initializeFieldValueComponent({
          field: '@foo',
          helper: 'somehelper'
        });

        TemplateHelpers.registerFieldHelper('somehelper', value => 'version1');
        TemplateHelpers.registerFieldHelper('somehelperv2', value => 'version2');
        expect(test.cmp.renderOneValue('somevalue').textContent).toEqual('version2');
      });

      it('should not crash and render the default value if the helper does not exist', () => {
        initializeFieldValueComponent({
          field: '@foo',
          helper: 'somehelperwhichdoesnotexist'
        });

        expect(test.cmp.renderOneValue('somevalue').textContent).toEqual('somevalue');
      });

      it('should support shorten helper', () => {
        initializeFieldValueComponent({
          field: '@longfieldvalue',
          helper: 'shorten'
        });

        expect(test.cmp.renderOneValue(_.range(0, 1000).join('-')).textContent.length).toBe(200);
      });

      it('textCaption should render a text value', () => {
        initializeFieldValueComponent({
          field: '@title',
          textCaption: '<script>alert("Potatoes")</script>'
        });

        expect($$(test.cmp.element).text()).toContain('<script>alert("Potatoes")</script>');
      });

      it('textCaption should render in front of the fieldValue', () => {
        initializeFieldValueComponent({
          field: '@title',
          textCaption: 'this is a test'
        });
        expect($$($$(test.cmp.element).children()[0]).hasClass('coveo-field-caption')).toBe(true);
      });

      it('textCaption option should add the class coveo-with-label to the CoveoFieldValue', () => {
        initializeFieldValueComponent({
          field: '@title',
          textCaption: 'this is a test'
        });
        expect($$(test.cmp.element).hasClass('coveo-with-label')).toBe(true);
      });

      it('matching condition should let the component render within its parent', () => {
        initializeFieldValueComponent({
          field: '@title',
          conditions: [{ field: 'filetype', values: ['unknown'] }]
        });
        expect(test.cmp.element.parentElement).toBeDefined();
      });

      it('not matching condition should detach the component from its parent', () => {
        initializeFieldValueComponent({
          field: '@title',
          conditions: [{ field: 'filetype', values: ['abc'] }]
        });
        expect(test.cmp.element.parentElement).toBeNull();
      });

      it('not matching reversed condition should let the component render within its parent', () => {
        initializeFieldValueComponent({
          field: '@title',
          conditions: [{ field: 'filetype', values: ['abc'], reverseCondition: true }]
        });
        expect(test.cmp.element.parentElement).toBeDefined();
      });

      it('matching reversed condition should detach the component from its parent', () => {
        initializeFieldValueComponent({
          field: '@title',
          conditions: [{ field: 'filetype', values: ['unknown'], reverseCondition: true }]
        });
        expect(test.cmp.element.parentElement).toBeNull();
      });
    });

    it('should display the proper field value', () => {
      expect(getText()).toBe('string value');
    });

    describe('with a related facet', () => {
      let facet: Facet;

      beforeEach(() => {
        facet = Mock.mockComponent<Facet>(Facet);

        facet.values = Mock.mock<FacetValues>(FacetValues);
        facet.values.get = () => {
          const value = Mock.mock<FacetValue>(FacetValue);
          value.selected = true;
          return value;
        };
      });

      describe('when translating standard field values', () => {
        beforeEach(() => {
          const fakeResult = FakeResults.createFakeResult();
          fakeResult.raw['objecttype'] = 'opportunityproduct';

          initializeFieldValueComponent({ field: '@objecttype' }, fakeResult, facet);
        });

        it('should use the translated value', () => {
          expect(getText()).toBe(l('opportunityproduct'));
        });

        it('should use the translated value for the title', () => {
          expect(getTitle()).toContain(l('opportunityproduct'));
        });
      });

      it('should display the field value as clickable when its facet is enabled', () => {
        facet.disabled = false;
        initializeFieldValueComponent({ field: '@string' }, FakeResults.createFakeResult(), facet);
        expect($$($$(test.cmp.element).find('span')).hasClass('coveo-clickable')).toBe(true);
      });

      it('should not display the field value as clickable when its facet is disabled', () => {
        facet.disabled = true;
        initializeFieldValueComponent({ field: '@string' }, FakeResults.createFakeResult(), facet);
        expect($$($$(test.cmp.element).find('span')).hasClass('coveo-clickable')).toBe(false);
      });
    });

    describe('with a related dynamic facet', () => {
      let facet: DynamicFacet;

      beforeEach(() => {
        facet = DynamicFacetTestUtils.createFakeFacet();
        facet.values.hasSelectedValue = () => true;
      });

      describe('when translating standard field values', () => {
        beforeEach(() => {
          const fakeResult = FakeResults.createFakeResult();
          fakeResult.raw['objecttype'] = 'opportunityproduct';

          initializeFieldValueComponent({ field: '@objecttype' }, fakeResult, facet);
        });

        it('should use the translated value', () => {
          expect(getText()).toBe(l('opportunityproduct'));
        });

        it('should use the translated value for the title', () => {
          expect(getTitle()).toContain(l('opportunityproduct'));
        });
      });

      it('should display the field value as clickable when its facet is enabled', () => {
        facet.disabled = false;
        initializeFieldValueComponent({ field: '@string' }, FakeResults.createFakeResult(), facet);
        expect($$($$(test.cmp.element).find('span')).hasClass('coveo-clickable')).toBe(true);
      });

      it('should not display the field value as clickable when its facet is disabled', () => {
        facet.disabled = true;
        initializeFieldValueComponent({ field: '@string' }, FakeResults.createFakeResult(), facet);
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

      initializeFieldValueComponent(options, fakeResult);
      expect(
        $$(test.cmp.element)
          .find('span')
          .getAttribute('title')
      ).toEqual(dateString);

      options.helper = 'dateTime';
      initializeFieldValueComponent(options, fakeResult);
      expect(
        $$(test.cmp.element)
          .find('span')
          .getAttribute('title')
      ).toEqual(dateTimeString);

      options.helper = 'emailDateTime';
      initializeFieldValueComponent(options, fakeResult);
      expect(
        $$(test.cmp.element)
          .find('span')
          .getAttribute('title')
      ).toEqual(dateTimeString);
    });

    it("should not show a full date tooltip if it doesn't have the helper is not a date", () => {
      initializeFieldValueComponent({ field: '@string' });

      expect(
        $$(test.cmp.element)
          .find('span')
          .hasAttribute('title')
      ).toBe(false);
    });
  });
}
