import { FormGroup } from '../../src/ui/FormWidgets/FormGroup';
import { Checkbox } from '../../src/ui/FormWidgets/Checkbox';

export function FormGroupTest() {
  describe('FormGroup', () => {
    it('should allow to contain multiple form elements', () => {
      expect(new FormGroup([new Checkbox(() => {}, '1'), new Checkbox(() => {}, '2')], 'Form group').build().tagName.toLowerCase()).toEqual(
        'fieldset'
      );
    });
  });
}
