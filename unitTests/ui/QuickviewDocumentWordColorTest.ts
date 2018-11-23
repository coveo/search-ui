import { QuickviewDocumentWordColor } from '../../src/ui/Quickview/QuickviewDocumentWordColor';

export function QuickviewDocumentWordColorTest() {
  describe('QuickviewDocumentWordColor', () => {
    it('should be able to parse html RGB color', () => {
      const color = new QuickviewDocumentWordColor('rgb(1,2,3)');
      expect(color.r).toBe(1);
      expect(color.g).toBe(2);
      expect(color.b).toBe(3);
    });

    it('should allow to invert the color', () => {
      const color = new QuickviewDocumentWordColor('rgb(0,0,0)');
      expect(color.invert()).toBe('rgb(255, 255, 255)');
    });

    it('should allow to saturate the color', () => {
      const color = new QuickviewDocumentWordColor('rgb(1,100,100)');
      expect(color.saturate()).toBe('rgb(0, 100, 100)');
    });
  });
}
