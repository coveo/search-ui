import { ExactKeywordsInput } from '../../../../src/ui/AdvancedSearch/KeywordsInput/ExactKeywordsInput';
import { $$ } from '../../../../src/utils/Dom';

export function ExactKeywordsInputTest() {
  describe('ExactKeywordsInput', () => {
    let input: ExactKeywordsInput;

    beforeEach(function() {
      input = new ExactKeywordsInput($$('div').el);
      input.build();
    });

    afterEach(function() {
      input = null;
    });

    describe('getValue', () => {
      it('should return the values in quotes', () => {
        let value = 'starcraft starwars startrek';
        input.setValue(value);
        expect(input.getValue()).toEqual('"starcraft starwars startrek"');
      });
    });
  });
}
