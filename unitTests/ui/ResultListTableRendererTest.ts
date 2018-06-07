import { ResultListTableRenderer } from '../../src/ui/ResultList/ResultListTableRenderer';
import { Template } from '../../src/ui/Templates/Template';
import { TableTemplate } from '../../src/ui/Templates/TableTemplate';
import { $$ } from '../../src/utils/Dom';

export function ResultListTableRendererTest() {
  describe('ResultListTableRenderer', () => {
    let renderer: ResultListTableRenderer;
    let resultContainer: HTMLElement;
    beforeEach(() => {
      resultContainer = $$('table').el;
      renderer = new ResultListTableRenderer({ resultContainer: resultContainer }, () => null);
    });
    afterEach(() => {
      renderer = null;
    });

    it('should only instantiate table-header by default', done => {
      const fakeTemplateList = new TableTemplate([]);
      renderer = new ResultListTableRenderer({ resultTemplate: fakeTemplateList, resultContainer: resultContainer }, () => null);
      renderer.renderResults([$$('div', { className: 'CoveoResult' }).el], false, () => null).then(() => {
        expect($$(resultContainer).find('.coveo-result-list-table-header')).not.toBeNull();
        done();
      });
    });

    it('should render a table footer if one is present in an embedded TemplateList', done => {
      const fakeTemplateList = new TableTemplate([]);
      spyOn(fakeTemplateList, 'hasTemplateWithRole').and.callFake(a => {
        if (a == 'table-footer') {
          return true;
        }
      });
      renderer = new ResultListTableRenderer({ resultTemplate: fakeTemplateList, resultContainer: resultContainer }, () => null);
      renderer.renderResults([$$('div', { className: 'CoveoResult' }).el], false, () => null).then(() => {
        expect($$(resultContainer).find('.coveo-result-list-table-footer')).not.toBeNull();
        done();
      });
    });

    it('should not render a table header if custom templates are specified but no header template', () => {
      const fakeTemplateList = new TableTemplate([new Template()]);
      spyOn(fakeTemplateList, 'hasTemplateWithRole').and.callFake(a => {
        if (a == 'table-header') {
          return false;
        }
      });
      renderer = new ResultListTableRenderer({ resultTemplate: fakeTemplateList, resultContainer: resultContainer }, () => null);
      renderer.renderResults([$$('div', { className: 'CoveoResult' }).el], false, () => null);
      expect($$(resultContainer).find('.coveo-result-list-table-header')).toBeNull();
    });

    it('should not render a header or a footer when passed append set to true', () => {
      const fakeTemplateList = new TableTemplate([new Template()]);
      spyOn(fakeTemplateList, 'hasTemplateWithRole').and.callFake(a => {
        if (a == 'table-header') {
          return false;
        }
      });
      renderer = new ResultListTableRenderer({ resultTemplate: fakeTemplateList, resultContainer: resultContainer }, () => null);
      renderer.renderResults([$$('div', { className: 'CoveoResult' }).el], true, () => null);
      expect($$(resultContainer).find('.coveo-result-list-table-header')).toBeNull();
      expect($$(resultContainer).find('.coveo-result-list-table-footer')).toBeNull();
    });
  });
}
