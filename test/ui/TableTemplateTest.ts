import * as Mock from '../MockEnvironment';
import { Template } from '../../src/ui/Templates/Template';
import { TableTemplate } from '../../src/ui/Templates/TableTemplate';
import { $$ } from '../../src/utils/Dom';

export function TableTemplateTest() {
  describe('TableTemplate', () => {
    let tableTemplate: TableTemplate;

    beforeEach(() => {
      tableTemplate = new TableTemplate([new Template(() => 'test')]);
    });

    afterEach(() => {
      tableTemplate = null;
    });

    it('instantiateRoleToString should render a roled template to string', () => {
      const roledTemplate = new Template(() => 'header');
      roledTemplate.role = 'table-header';
      tableTemplate = new TableTemplate([roledTemplate]);
      const instantiatedString = tableTemplate.instantiateRoleToString('table-header');
      expect(instantiatedString).toBe('header');
    });

    it('instantiateRoleToString should render a default roled template if it doesn\'t have one available', () => {
      const instantiatedString = tableTemplate.instantiateRoleToString('table-header');
      expect(instantiatedString).not.toBeFalsy();
    });

    it('instantiateRoleToElement should render a roled template to element', () => {
      const roledTemplate = new Template(() => 'header');
      roledTemplate.role = 'table-header';
      tableTemplate = new TableTemplate([roledTemplate]);
      const instantiatedElement = tableTemplate.instantiateRoleToElement('table-header');
      expect(instantiatedElement.innerHTML).toBe('header');
    });

    it('instantiateRoleToElement should render a default roled template if it doesn\'t have one available', () => {
      const instantiatedElement = tableTemplate.instantiateRoleToElement('table-header');
      expect(instantiatedElement.childElementCount).toBe(3);
    });
  });
}
