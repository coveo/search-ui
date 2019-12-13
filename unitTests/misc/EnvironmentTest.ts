import * as underscore from 'underscore';

declare const _;

export function EnvironmentTest() {
  describe('Environment', () => {
    it(`the '_' global variable should hold the underscore library`, () => {
      // If this test fails, it might be because the global variable is being
      // overwritten by lodash. Check that there are no lodash imports.
      const globalUnderscore = _;
      expect(globalUnderscore).toEqual(underscore);
    });
  });
}
