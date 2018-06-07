import * as axe from 'axe-core';
import { $$, Component, FieldTable } from 'coveo-search-ui';
import { afterQuerySuccess, getRoot, testResultElement } from './Testing';

export const AccessibilityFieldTable = () => {
  describe('FieldTable', () => {
    const tableContent = `
    <tbody>
      <tr data-field="@objecttype" data-caption="Object type">
      </tr>
      <tr data-field="@filetype" data-caption="File type">
      </tr>
    </tbody>`;

    it('should be accessible when expanded', async done => {
      const fieldTableElement = $$(
        'table',
        {
          className: Component.computeCssClassName(FieldTable),
          'data-allow-minimization': false
        },
        tableContent
      );

      testResultElement(fieldTableElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });

    it('should be accessible when minimized', async done => {
      const fieldTableElement = $$(
        'table',
        {
          className: Component.computeCssClassName(FieldTable),
          'data-allow-minimization': true
        },
        tableContent
      );

      testResultElement(fieldTableElement.el);
      await afterQuerySuccess();
      const axeResults = await axe.run(getRoot());
      expect(axeResults).toBeAccessible();
      done();
    });
  });
};
