import { FormGroup } from '../../src/ui/FormWidgets/FormGroup';
import { Checkbox } from '../../src/ui/FormWidgets/Checkbox';

export function FormGroupTest() {
  describe('FormGroup', () => {
    it('should allow to contain multiple form elements', () => {
      expect(new FormGroup([new Checkbox(() => {}, '1'), new Checkbox(() => {}, '2')], 'Form group').build().tagName.toLowerCase()).toEqual(
        'fieldset'
      );
    });

    it('should not allow to create a form group with stored XSS', () => {
      const group = new FormGroup([new Checkbox(() => {}, '1'), new Checkbox(() => {}, '2')], '<svg/onload=alert(document.domain)>');
      expect(group.labelElement.text()).toBe('<svg/onload=alert(document.domain)>');
    });
  });
}
