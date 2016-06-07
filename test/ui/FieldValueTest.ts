/// <reference path="../Test.ts" />
module Coveo {
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
        test = Mock.optionsResultComponentSetup<FieldValue, IFieldValueOptions>(FieldValue, <IFieldValueOptions>{
          field: undefined
        }, FakeResults.createFakeResult())
        expect(test.cmp.options.field).toBe('@field');
      });

      it('facet should use the field value by default', () => {
        test = Mock.optionsResultComponentSetup<FieldValue, IFieldValueOptions>(FieldValue, <IFieldValueOptions>{
          field: '@foobarde'
        }, FakeResults.createFakeResult())
        expect(test.cmp.options.facet).toBe('@foobarde');
      });

      it('htmlValue set to true should set the element\'s innerHTML value properly', () => {
        test = Mock.advancedResultComponentSetup<FieldValue>(FieldValue, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
          element: element,
          cmpOptions: <IFieldValueOptions>{
            field: '@foobarde',
            htmlValue: true
          }
        });
        expect(test.cmp.renderOneValue('<em>patatefrietz</em>').innerHTML).toBe('<em>patatefrietz</em>');
      });

      it('htmlValue set to false should set the value in text node', () => {
        test = Mock.advancedResultComponentSetup<FieldValue>(FieldValue, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
          element: element,
          cmpOptions: <IFieldValueOptions>{
            field: '@foobarde',
            htmlValue: false
          }
        });

        expect(test.cmp.renderOneValue('<em>patatefrietz</em>').textContent).toBe('<em>patatefrietz</em>');
      });

      it('splitValues should display the array of values separated by commas when the input values are semi-colon separated', () => {
        let result = FakeResults.createFakeResult();
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
        let result = FakeResults.createFakeResult();
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
        let result = FakeResults.createFakeResult();
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
        let result = FakeResults.createFakeResult();
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
        let result = FakeResults.createFakeResult();
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
        test = Mock.advancedResultComponentSetup<FieldValue>(FieldValue, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
          element: element,
          cmpOptions: <IFieldValueOptions>{
            field: '@foobarde',
            helper: 'hamburgerHelper'
          }
        });
        TemplateHelpers.registerFieldHelper('hamburgerHelper', value => 'ham' + value + 'burger');
        expect(test.cmp.renderOneValue('1337').textContent).toEqual('ham1337burger');
      });

      describe('helperOptions', () => {
        it('should call helper with appropriate options', () => {
          test = Mock.advancedResultComponentSetup<FieldValue>(FieldValue, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
            element: element,
            cmpOptions: <IFieldValueOptions>{
              field: '@foobarde',
              helper: 'myHelper',
              helperOptions: {
                myOption: '0002raboof'
              }
            }
          });
          TemplateHelpers.registerFieldHelper('myHelper', (_, options) => {
            expect(options).toEqual(jasmine.objectContaining({
              myOption: '0002raboof'
            }));
            return '';
          });
          test.cmp.renderOneValue('someValue');
        });
      });
    });

    it('should display the proper field value', () => {
      expect($$(test.cmp.element).find('span').textContent).toBe('string value')
    });

    describe('with a related facet', () => {
      let facet: Facet;

      beforeEach(() => {
        facet = Mock.mock<Facet>(Facet);

        facet.values = Mock.mock<FacetValues>(FacetValues);
        facet.values.get = () => {
          let value = Mock.mock<FacetValue>(FacetValue);
          value.selected = true;
          return value;
        }
      })

      afterEach(() => {
        facet = null;
      });

      it('should display the field value as clickable when its facet is enabled', () => {
        facet.disabled = false;
        test = Mock.advancedResultComponentSetup<FieldValue>(FieldValue, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
          element: element,
          modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
            builder.componentStateModel.get = () => [facet];
            builder.queryStateModel.get = () => [];
            return builder;
          },
          cmpOptions: {
            field: '@string'
          }
        });
        expect($$($$(test.cmp.element).find('span')).hasClass('coveo-clickable')).toBe(true);
      });

      it('should not display the field value as clickable when its facet is disabled', () => {
        facet.disabled = true;
        test = Mock.advancedResultComponentSetup<FieldValue>(FieldValue, FakeResults.createFakeResult(), <Mock.AdvancedComponentSetupOptions>{
          element: element,
          modifyBuilder: (builder: Mock.MockEnvironmentBuilder) => {
            builder.componentStateModel.get = () => [facet];
            builder.queryStateModel.get = () => [];
            return builder;
          },
          cmpOptions: {
            field: '@string'
          }
        });
        expect($$($$(test.cmp.element).find('span')).hasClass('coveo-clickable')).toBe(false);
      });
    });

    it('should show a full date tooltip when it has a date, dateTime or emailDateTime helper', () => {
      let fakeResult = FakeResults.createFakeResult();
      let options = {
        field: '@date',
        helper: 'date'
      }

      let fullDateOptions: IDateToStringOptions = {
        useLongDateFormat: true,
        useTodayYesterdayAndTomorrow: false,
        useWeekdayIfThisWeek: false,
        omitYearIfCurrentOne: false
      };

      let dateString = DateUtils.dateToString(new Date(parseInt(fakeResult.raw.date)), fullDateOptions);
      let dateTimeString = DateUtils.dateTimeToString(new Date(parseInt(fakeResult.raw.date)), fullDateOptions);

      test = Mock.optionsResultComponentSetup<FieldValue, IFieldValueOptions>(FieldValue, options, fakeResult);
      expect($$(test.cmp.element).find('span').getAttribute('title')).toEqual(dateString);

      options.helper = 'dateTime';
      test = Mock.optionsResultComponentSetup<FieldValue, IFieldValueOptions>(FieldValue, options, fakeResult);
      expect($$(test.cmp.element).find('span').getAttribute('title')).toEqual(dateTimeString);

      options.helper = 'emailDateTime';
      test = Mock.optionsResultComponentSetup<FieldValue, IFieldValueOptions>(FieldValue, options, fakeResult);
      expect($$(test.cmp.element).find('span').getAttribute('title')).toEqual(dateTimeString);
    })

    it('should not show a full date tooltip if it doesn\'t have the helper is not a date', () => {
      test = Mock.optionsResultComponentSetup<FieldValue, IFieldValueOptions>(FieldValue, <IFieldValueOptions>{
        field: '@string'
      }, FakeResults.createFakeResult());
      expect($$(test.cmp.element).find('span').hasAttribute('title')).toBe(false);
    });
  });
}
