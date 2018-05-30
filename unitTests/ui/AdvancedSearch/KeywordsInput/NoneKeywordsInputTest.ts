import { NoneKeywordsInput } from '../../../../src/ui/AdvancedSearch/KeywordsInput/NoneKeywordsInput';
import { $$ } from '../../../../src/utils/Dom';

export function NoneKeywordsInputTest() {
  describe('NoneKeywordsInput', () => {
    let input: NoneKeywordsInput;

    beforeEach(function() {
      input = new NoneKeywordsInput($$('div').el);
      input.build();
    });

    afterEach(function() {
      input = null;
    });

    describe('getValue', () => {
      it('should add NOT before each value', () => {
        let value = 'starcraft starwars startrek';
        input.setValue(value);
        expect(input.getValue()).toEqual('NOT starcraft NOT starwars NOT startrek');
      });
    });
  });
}
