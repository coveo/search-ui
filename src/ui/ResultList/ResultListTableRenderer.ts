import { IResultListOptions } from './ResultList';
import { ResultListRenderer } from './ResultListRenderer';
import { IQueryResult } from '../../rest/QueryResult';
import { Template, TemplateRole } from '../Templates/Template';
import { TemplateList } from '../Templates/TemplateList';
import { Component } from '../Base/Component';
import { $$ } from '../../utils/Dom';
import _ = require('underscore');

export class ResultListTableRenderer extends ResultListRenderer {

  private shouldDisplayHeader: boolean = true;
  private shouldDisplayFooter: boolean = false;

  constructor(protected resultListOptions: IResultListOptions, protected autoCreateComponentsFn: Function) {
    super(resultListOptions, autoCreateComponentsFn);
    if (this.resultListOptions.resultTemplate instanceof TemplateList) {
      if (this.resultListOptions.resultTemplate.hasTemplateWithRole('table-footer')) {
        this.shouldDisplayFooter = true;
      }
      // If custom templates are defined but no header template, do not display it.
      if (this.resultListOptions.resultTemplate.templates.length !== 0 && !this.resultListOptions.resultTemplate.hasTemplateWithRole('table-header')) {
        this.shouldDisplayHeader = false;
      }
    }
  }

  afterRenderingResults(resultElements: HTMLElement[]) {
    if (!_.isEmpty(resultElements)) {
      this.displayDecorations();
    }
  }

  private displayDecorations() {
    const decorationsToDisplay = {};
    if (this.shouldDisplayHeader) {
      decorationsToDisplay['tableHeader'] = 'table-header';
    }
    if (this.shouldDisplayFooter) {
      decorationsToDisplay['tableFooter'] = 'table-footer';
    }
    const renderedDecorations = _.mapObject(decorationsToDisplay, (role: TemplateRole) => {
      const elem = this.resultListOptions.resultTemplate.instantiateToElement({}, {
        role: role,
        checkCondition: false,
        currentLayout: 'table'
      });
      $$(elem).addClass(`coveo-result-list-${role}`);
      this.autoCreateComponentsFn(elem, undefined);
      return elem;
    });
    if (decorationsToDisplay['tableHeader']) {
      $$(this.resultListOptions.resultContainer).prepend(renderedDecorations['tableHeader']);
    }
    if (decorationsToDisplay['tableFooter']) {
      this.resultListOptions.resultContainer.appendChild(renderedDecorations['tableFooter']);
    }
  }
}
