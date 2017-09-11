import { SimpleFieldInput } from '../../../../src/ui/AdvancedSearch/DocumentInput/SimpleFieldInput';
import { SearchEndpoint } from '../../../../src/rest/SearchEndpoint';
import * as Mock from '../../../MockEnvironment';
import { $$ } from '../../../../src/utils/Dom';

export function SimpleFieldInputTest() {
  describe('SimpleFieldInput', () => {
    let input: SimpleFieldInput;
    let endpoint: SearchEndpoint;

    beforeEach(function() {
      endpoint = Mock.mock<SearchEndpoint>(SearchEndpoint);
      mockListFieldValues();
      input = new SimpleFieldInput('test', '@test', endpoint, $$('div').el);
      input.build();
    });

    afterEach(function() {
      input = null;
      endpoint = null;
    });

    describe('getValue', () => {
      it('should return fieldName == the value', () => {
        input.dropDown.setValue('what');
        expect(input.getValue()).toEqual('@test==what');
      });
    });

    function mockListFieldValues() {
      (<jasmine.Spy>endpoint.listFieldValues).and.callFake(() => {
        return {
          then: callback => {
            callback([{ value: 'what', numberOfResults: 100 }, { value: 'how', numberOfResults: 50 }]);
            return {
              then: callback => {
                callback();
              }
            };
          }
        };
      });
    }
  });
}
