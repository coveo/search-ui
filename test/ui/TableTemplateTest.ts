import { Template } from '../../src/ui/Templates/Template';
import { TableTemplate } from '../../src/ui/Templates/TableTemplate';

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

    it("instantiateRoleToString should render a default roled template if it doesn't have one available", () => {
      const instantiatedString = tableTemplate.instantiateRoleToString('table-header');
      expect(instantiatedString).not.toBeFalsy();
    });

    it('instantiateRoleToElement should render a roled template to element', done => {
      const roledTemplate = new Template(() => 'header');
      roledTemplate.role = 'table-header';
      tableTemplate = new TableTemplate([roledTemplate]);
      tableTemplate.instantiateRoleToElement('table-header').then(instantiatedElement => {
        expect(instantiatedElement.innerHTML).toBe('header');
        done();
      });
    });

    it("instantiateRoleToElement should render a default roled template if it doesn't have one available", done => {
      tableTemplate.instantiateRoleToElement('table-header').then(instantiatedElement => {
        expect(instantiatedElement.childElementCount).toBe(3);
        done();
      });
    });
  });
}
