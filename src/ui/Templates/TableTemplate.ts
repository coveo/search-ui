import { Template, TemplateRole } from './Template';
import { HtmlTemplate } from './HtmlTemplate';
import { TemplateList } from './TemplateList';
import { DefaultResultTemplate } from './DefaultResultTemplate';
import { $$ } from '../../utils/Dom';
import _ = require('underscore');

export class TableTemplate extends TemplateList {
  instantiateRoletoString(role: TemplateRole) {
    const roledTemplate = _.find(this.templates, t => t.role === role);
    if (roledTemplate) {
      return roledTemplate.instantiateToString({}, {});
    } else {
      return this.defaultRoledTemplates[role];
    }
  }
  instantiateRoleToElement(role: TemplateRole) {
    const roledTemplate = _.find(this.templates, t => t.role === role);
    if (roledTemplate) {
      return roledTemplate.instantiateToElement({}, {});
    } else {
      const tmpl = new Template(() => this.defaultRoledTemplates[role]);
      tmpl.layout = 'table';
      return tmpl.instantiateToElement({});
    }
  }

  private defaultTemplate = `<td><a class="CoveoResultLink"></a></td>
                             <td><span class="CoveoExcerpt"></span></td>
                             <td><span class="CoveoFieldValue" data-field="@date" data-helper="date"></span></td>`;

  private defaultRoledTemplates = {
    'table-header': `<th style="width: 40%">Link</th>
                     <th>Excerpt</th>
                     <th style="width: 20%"
                         class="CoveoSort coveo-table-header-sort"
                         data-sort-criteria="date ascending,date descending"
                         data-display-unselected-icon="false">Date</th>`,
    'table-footer': `<th>Link</th>
                     <th>Excerpt</th>
                     <th>Date</th>`
  };

  protected getFallbackTemplate(): Template {
    return new Template(() => this.defaultTemplate);
  }
}
