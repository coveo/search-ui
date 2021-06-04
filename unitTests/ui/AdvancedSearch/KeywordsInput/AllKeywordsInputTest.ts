import { AllKeywordsInput } from '../../../../src/ui/AdvancedSearch/KeywordsInput/AllKeywordsInput';
import { $$ } from '../../../../src/utils/Dom';

export function AnyKeywordsInputTest() {
  describe('AllKeywordsInput', () => {
    let input: AllKeywordsInput;

    beforeEach(function () {
      input = new AllKeywordsInput($$('div').el);
      input.build();
    });

    afterEach(function () {
      input = null;
    });

    describe('getValue', () => {
      it('should return the values surrounded by a no syntax block', () => {
        let value = 'starcraft starwars startrek';
        input.setValue(value);
        expect(input.getValue()).toEqual('<@-starcraft starwars startrek-@>');
      });
    });
  });
}
