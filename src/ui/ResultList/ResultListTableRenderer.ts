import { IResultListOptions } from './ResultList';
import { ResultListRenderer } from './ResultListRenderer';
import { IQueryResult } from '../../rest/QueryResult';
import { Template, TemplateRole } from '../Templates/Template';
import { TemplateList } from '../Templates/TemplateList';
import { TableTemplate } from '../Templates/TableTemplate';
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

  beforeRenderingResults(resultElements: HTMLElement[]) {
    if (!_.isEmpty(resultElements) && this.shouldDisplayHeader) {
      this.resultListOptions.resultContainer.appendChild(this.renderRoledTemplate('table-header'));
    }
  }

  afterRenderingResults(resultElements: HTMLElement[]) {
    if (!_.isEmpty(resultElements) && this.shouldDisplayFooter) {
      this.resultListOptions.resultContainer.appendChild(this.renderRoledTemplate('table-footer'));
    }
  }

  private renderRoledTemplate(role: TemplateRole): HTMLElement {
    const elem = (<TableTemplate>this.resultListOptions.resultTemplate).instantiateRoleToElement(role);
    $$(elem).addClass(`coveo-result-list-${role}`);
    this.autoCreateComponentsFn(elem, undefined);
    return elem;
  }
}
