import { SizeInput } from '../../../../src/ui/AdvancedSearch/DocumentInput/SizeInput';
import { $$ } from '../../../../src/utils/Dom';

export function SizeInputTest() {
  describe('SizeInput', () => {
    let input: SizeInput;

    beforeEach(function() {
      input = new SizeInput($$('div').el);
      input.build();
    });

    afterEach(function() {
      input = null;
    });

    describe('getValue', () => {
      it('AtLeast should return @date>=', () => {
        input.modeSelect.setValue('AtLeast');
        input.sizeInput.setValue(5);
        input.sizeSelect.setValue('KB');
        expect(input.getValue()).toContain('@size>=');
      });

      it('AtMost should return @date<=', () => {
        input.modeSelect.setValue('AtMost');
        input.sizeInput.setValue(5);
        input.sizeSelect.setValue('KB');
        expect(input.getValue()).toContain('@size<=');
      });

      it('if size is KB should return size * 1024', () => {
        let size = 5;
        input.modeSelect.setValue('AtLeast');
        input.sizeInput.setValue(size);
        input.sizeSelect.setValue('KB');
        expect(input.getValue()).toContain((size * 1024).toString());
      });

      it('if size is MB should return size * 1024^2', () => {
        let size = 5;
        input.modeSelect.setValue('AtLeast');
        input.sizeInput.setValue(size);
        input.sizeSelect.setValue('MB');
        expect(input.getValue()).toContain((size * Math.pow(1024, 2)).toString());
      });

      it('if size is Bytes should return size', () => {
        let size = 5;
        input.modeSelect.setValue('AtLeast');
        input.sizeInput.setValue(size);
        input.sizeSelect.setValue('Bytes');
        expect(input.getValue()).toContain(size.toString());
      });
    });
  });
}
