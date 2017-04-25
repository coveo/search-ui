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
    if (this.resultListOptions.resultTemplate instanceof TableTemplate) {
      if (this.resultListOptions.resultTemplate.hasTemplateWithRole('table-footer')) {
        this.shouldDisplayFooter = true;
      }
      // If custom templates are defined but no header template, do not display it.
      if (this.resultListOptions.resultTemplate.templates.length !== 0 && !this.resultListOptions.resultTemplate.hasTemplateWithRole('table-header')) {
        this.shouldDisplayHeader = false;
      }
    }
  }

  beforeRenderingResults(container: Node, resultElements: HTMLElement[], append: boolean) {
    if (!append && !_.isEmpty(resultElements) && this.shouldDisplayHeader) {
      this.renderRoledTemplate('table-header').then(tpl => container.appendChild(tpl));
    }
  }

  afterRenderingResults(container: Node, resultElements: HTMLElement[], append: boolean) {
    if (!append && !_.isEmpty(resultElements) && this.shouldDisplayFooter) {
      this.renderRoledTemplate('table-footer').then(tpl => container.appendChild(tpl));
    }
  }

  private async renderRoledTemplate(role: TemplateRole) {
    const elem = await (<TableTemplate>this.resultListOptions.resultTemplate).instantiateRoleToElement(role);
    $$(elem).addClass(`coveo-result-list-${role}`);
    this.autoCreateComponentsFn(elem, undefined);
    return elem;
  }
}
