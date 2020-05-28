import { FileTypes } from '../../src/ui/Misc/FileTypes';

export function FileTypesTest() {
  describe('FileTypes', () => {
    it('safelyBuildFileTypeInfo should prevent XSS attacks by espacing inputs', () => {
      const unsafeInput = 'Foo><img src=y onerror=alert(document.cookie)>';
      const info = FileTypes.safelyBuildFileTypeInfo('objecttype', unsafeInput, unsafeInput);

      expect(info.icon).toBe('coveo-icon objecttype Foo&gt;&lt;img-src=y onerror=alert(document.cookie)&gt;');
      expect(info.caption).toBe('Foo&gt;&lt;img src=y onerror=alert(document.cookie)&gt;');
    });
  });
}
