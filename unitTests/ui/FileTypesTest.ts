import { FileTypes } from '../../src/ui/Misc/FileTypes';
import { escape } from 'underscore';

export function FileTypesTest() {
  describe('FileTypes', () => {
    it('safelyBuildFileTypeInfo should prevent XSS attacks by espacing inputs', () => {
      const unsafeInput = 'Foo><img src=y onerror=alert(document.cookie)>';
      const info = FileTypes.safelyBuildFileTypeInfo('objecttype', unsafeInput, unsafeInput);

      expect(info.icon).toEqual(`coveo-icon objecttype ${escape(unsafeInput.replace(' ', '-'))}`);
      expect(info.caption).toBe(escape(unsafeInput));
    });
  });
}
