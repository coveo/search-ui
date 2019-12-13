import * as underscore from 'underscore';

declare const _;

export function EnvironmentTest() {
  describe('Environment', () => {
    it(`the '_' global variable should hold the underscore library`, () => {
      const globalUnderscore = _;
      expect(globalUnderscore).toEqual(underscore);
    });
  });
}
