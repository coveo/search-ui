import { Template } from './Template';
import { ITemplateHelperFunction } from './TemplateHelpers';
import { Assert } from '../../misc/Assert';
import { Utils } from '../../utils/Utils';
import { Logger } from '../../misc/Logger';
import { TemplateFromAScriptTag, ITemplateFromStringProperties } from './TemplateFromAScriptTag';
import { DefaultResultTemplate } from './DefaultResultTemplate';
import _ = require('underscore');

_.templateSettings = {
  evaluate: /(?:<%|{{)([\s\S]+?)(?:%>|}})/g,
  interpolate: /(?:<%|{{)=([\s\S]+?)(?:%>|}})/g,
  escape: /(?:<%|{{)-([\s\S]+?)(?:%>|}})/g
};

export class UnderscoreTemplate extends Template {
  private template: (data: any) => string;
  private templateFromAScriptTag: TemplateFromAScriptTag;
  public static templateHelpers: { [templateName: string]: ITemplateHelperFunction; } = {};


  public static mimeTypes = [
    'text/underscore',
    'text/underscore-template',
    'text/x-underscore',
    'text/x-underscore-template'
  ];

  constructor(public element: HTMLElement) {
    super();
    Assert.exists(element);
    var templateString = element.innerHTML;
    try {
      this.template = _.template(templateString);
    } catch (e) {
      new Logger(this).error('Cannot instantiate underscore template. Might be caused by strict Content-Security-Policy. Will fallback on a default template...', e);
    }
    this.templateFromAScriptTag = new TemplateFromAScriptTag(this, this.element);
    this.dataToString = (object) => {
      var extended = _.extend({}, object, UnderscoreTemplate.templateHelpers);
      if (this.template) {
        return this.template(extended);
      } else {
        return new DefaultResultTemplate().getFallbackTemplate();
      }

    };
  }

  toHtmlElement(): HTMLElement {
    let script = this.templateFromAScriptTag.toHtmlElement();
    script.setAttribute('type', _.first(UnderscoreTemplate.mimeTypes));
    return script;
  }

  getType() {
    return 'UnderscoreTemplate';
  }

  getFields() {
    return this.fields;
  }

  static registerTemplateHelper(helperName: string, helper: ITemplateHelperFunction) {
    UnderscoreTemplate.templateHelpers[helperName] = helper;
  }

  static isLibraryAvailable(): boolean {
    return Utils.exists(window['_']);
  }

  static fromString(template: string, properties: ITemplateFromStringProperties): UnderscoreTemplate {
    let script = TemplateFromAScriptTag.fromString(template, properties);
    script.setAttribute('type', UnderscoreTemplate.mimeTypes[0]);

    return new UnderscoreTemplate(script);
  }

  static create(element: HTMLElement): UnderscoreTemplate {
    Assert.exists(element);
    return new UnderscoreTemplate(element);
  }
}
