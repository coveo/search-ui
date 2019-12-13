import * as underscore from 'underscore';

declare const _;

export function EnvironmentTest() {
  describe('Environment', () => {
    it(`the '_' global variable holds underscore (note: importing lodash will overwrite the global)`, () => {
      const globalUnderscore = _;
      expect(globalUnderscore).toEqual(underscore);
    });
  });
}
