import {Template} from './Template';
import {Assert} from '../../misc/Assert';
import {UnderscoreTemplate} from './UnderscoreTemplate';
import {HtmlTemplate} from './HtmlTemplate';
import _ = require('underscore');

export class TemplateCache {
  private static templates: { [templateName: string]: Template; } = {};
  private static templateNames: string[] = [];
  private static defaultTemplates: { [templateName: string]: Template; } = {};

  public static registerTemplate(name: string, template: Template, publicTemplate?: boolean, defaultTemplate?: boolean);
  public static registerTemplate(name: string, template: (data: {}) => string, publicTemplate?: boolean, defaultTemplate?: boolean);
  public static registerTemplate(name: string, template: any, publicTemplate: boolean = true, defaultTemplate: boolean = false) {
    Assert.isNonEmptyString(name);
    Assert.exists(template);
    if (!(template instanceof Template)) {
      template = new Template(template);
    }
    if (template.name == null) {
      template.name = name;
    }
    TemplateCache.templates[name] = template;
    if (publicTemplate && !_.contains(TemplateCache.templateNames, name)) {
      TemplateCache.templateNames.push(name);
    }
    if (defaultTemplate) {
      TemplateCache.defaultTemplates[name] = template;
    }
  }

  public static getTemplate(name: string): Template {
    Assert.exists(TemplateCache.templates[name]);
    return TemplateCache.templates[name];
  }

  public static getTemplates(): { [templateName: string]: Template; } {
    return TemplateCache.templates;
  }

  public static getTemplateNames(): string[] {
    return TemplateCache.templateNames;
  }

  public static getDefaultTemplates(): string[] {
    return _.keys(TemplateCache.defaultTemplates);
  }

  public static getDefaultTemplate(name: string): Template {
    Assert.exists(TemplateCache.defaultTemplates[name]);
    return TemplateCache.defaultTemplates[name];
  }

  static scanAndRegisterTemplates() {
    // Here we take care not to scan for templates for which the base library
    // is not available. Case in point: someone was using the JS UI on a page
    // that was also using Handlebars, but our code was initialized before
    // the Handlebars library (loaded through AMD).
    if (UnderscoreTemplate.isLibraryAvailable()) {
      TemplateCache.scanAndRegisterUnderscoreTemplates();
    }
    TemplateCache.scanAndRegisterHtmlTemplates();
  }

  private static scanAndRegisterUnderscoreTemplates() {
    _.each(UnderscoreTemplate.mimeTypes, (type) => {
      let scriptList = document.querySelectorAll(`script[id][type='${type}']`);
      let i = scriptList.length;
      let arr: HTMLElement[] = new Array(i);
      while (i--) {
        arr[i] = <HTMLElement>scriptList.item(i);
      }
      _.each(arr, (elem: HTMLElement) => {
        let template = new UnderscoreTemplate(elem);
        TemplateCache.registerTemplate(elem.getAttribute('id'), template);
      })
    });
  }

  private static scanAndRegisterHtmlTemplates() {
    _.each(HtmlTemplate.mimeTypes, (type) => {
      let scriptList = document.querySelectorAll(`script[id][type='${type}']`);
      let i = scriptList.length;
      let arr: HTMLElement[] = new Array(i);
      while (i--) {
        arr[i] = <HTMLElement>scriptList.item(i);
      }

      _.each(arr, (elem: HTMLElement) => {
        let template = new HtmlTemplate(elem);
        TemplateCache.registerTemplate(elem.getAttribute('id'), template);
      })
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  TemplateCache.scanAndRegisterTemplates();
})
