import {Template} from './Template';
import {UnderscoreTemplate} from './UnderscoreTemplate';
import {TemplateCache} from './TemplateCache';
import {IQueryResult} from '../../rest/QueryResult';
import {Assert} from '../../misc/Assert';
import {TemplateHelpers} from './templateHelpers';



export class DefaultResultTemplate extends Template {

  constructor() {
    super();
  }

  instantiateToString(queryResult?: IQueryResult): string {
    Assert.exists(queryResult);
    queryResult = _.extend({}, queryResult, UnderscoreTemplate.templateHelpers);

    var defaultTemplates = _.map(TemplateCache.getDefaultTemplates(), (name) => TemplateCache.getTemplate(name));

    // We want to put templates with conditions first
    defaultTemplates.sort((a, b) => {
      if (a.condition == null && b.condition != null) {
        return 1;
      } else if (a.condition != null && b.condition == null) {
        return -1;
      }
      return 0;
    });

    for (var i = 0; i < defaultTemplates.length; i++) {
      var result = defaultTemplates[i].instantiateToString(queryResult);
      if (result != null) {
        return result;
      }
    }


    return function (obj) {
      var __t, __p = '', __j = Array.prototype.join, print = function () { __p += __j.call(arguments, ''); };
      var obj = (obj || {});
      __p += '<div><div class="coveo-title"><a class="CoveoResultLink">' +
        ((__t = (obj.title ? TemplateHelpers.getHelper("highlight").call(obj.title, obj.titleHighlights) : obj.clickUri)) == null ? '' : __t) +
        '</a></div>';
      if (obj.excerpt) {
        __p += '<div class="coveo-excerpt">' +
          ((__t = (TemplateHelpers.getHelper("highlight").call(obj.excerpt, obj.excerptHighlights))) == null ? '' : __t) +
          '</div>';
      }
      __p += '<table class="CoveoFieldTable">' +
        ((__t = (TemplateHelpers.getHelper("highlight").call(null))) == null ? '' : __t) +
        '</table></div>';

      return __p;
    } (queryResult);
  }

  instantiateToElement(queryResult?: IQueryResult): HTMLElement {
    var div = document.createElement('div');
    div.innerHTML = this.instantiateToString(queryResult);
    return div;
  }


  getFields() {
    var defaultTemplates = _.map(TemplateCache.getDefaultTemplates(), (name) => TemplateCache.getTemplate(name));
    return _.flatten(_.map(defaultTemplates, (template: Template) => template.getFields()));
  }

  getType() {
    return 'DefaultResultTemplate';
  }
}
