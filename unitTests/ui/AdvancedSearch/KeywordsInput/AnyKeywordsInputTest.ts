import { AnyKeywordsInput } from '../../../../src/ui/AdvancedSearch/KeywordsInput/AnyKeywordsInput';
import { $$ } from '../../../../src/utils/Dom';

export function AnyKeywordsInputTest() {
  describe('AnyKeywordsInput', () => {
    let input: AnyKeywordsInput;

    beforeEach(function() {
      input = new AnyKeywordsInput($$('div').el);
      input.build();
    });

    afterEach(function() {
      input = null;
    });

    describe('getValue', () => {
      it('should return the values separated by OR', () => {
        let value = 'starcraft starwars startrek';
        input.setValue(value);
        expect(input.getValue()).toEqual('starcraft OR starwars OR startrek');
      });
    });
  });
}
