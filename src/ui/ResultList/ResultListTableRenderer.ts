import { IResultListOptions } from './ResultList';
import { ResultListRenderer } from './ResultListRenderer';
import { TemplateRole } from '../Templates/Template';
import { TableTemplate } from '../Templates/TableTemplate';
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
      if (
        this.resultListOptions.resultTemplate.templates.length !== 0 &&
        !this.resultListOptions.resultTemplate.hasTemplateWithRole('table-header')
      ) {
        this.shouldDisplayHeader = false;
      }
    }
  }

  getStartFragment(resultElements: HTMLElement[], append: boolean): Promise<DocumentFragment> {
    if (!append && !_.isEmpty(resultElements) && this.shouldDisplayHeader) {
      return this.renderRoledTemplate('table-header');
    }
  }

  getEndFragment(resultElements: HTMLElement[], append: boolean): Promise<DocumentFragment> {
    if (!append && !_.isEmpty(resultElements) && this.shouldDisplayFooter) {
      return this.renderRoledTemplate('table-footer');
    }
  }

  private async renderRoledTemplate(role: TemplateRole) {
    const elem = await (<TableTemplate>this.resultListOptions.resultTemplate).instantiateRoleToElement(role);
    $$(elem).addClass(`coveo-result-list-${role}`);
    this.autoCreateComponentsFn(elem, undefined);
    const frag = document.createDocumentFragment();
    frag.appendChild(elem);
    return frag;
  }
}
