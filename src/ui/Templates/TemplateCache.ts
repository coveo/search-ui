import { Template } from './Template';
import { Assert } from '../../misc/Assert';
import { UnderscoreTemplate } from './UnderscoreTemplate';
import { HtmlTemplate } from './HtmlTemplate';
import * as _ from 'underscore';

/**
 * Holds a reference to all template available in the framework
 */
export class TemplateCache {
  private static templates: { [templateName: string]: Template } = {};
  private static templateNames: string[] = [];
  private static resultListTemplateNames: string[] = [];
  private static defaultTemplates: { [templateName: string]: Template } = {};

  public static registerTemplate(
    name: string,
    template: Template,
    publicTemplate?: boolean,
    defaultTemplate?: boolean,
    pageTemplate?: boolean
  );
  public static registerTemplate(
    name: string,
    template: (data: {}) => string,
    publicTemplate?: boolean,
    defaultTemplate?: boolean,
    pageTemplate?: boolean
  );
  /**
   * Register a new template in the framework, which will be available to render any results.
   * @param name
   * @param template
   * @param publicTemplate
   * @param defaultTemplate
   * @param pageTemplate
   */
  public static registerTemplate(
    name: string,
    template: any,
    publicTemplate: boolean = true,
    defaultTemplate: boolean = false,
    resultListTemplate: boolean = false
  ) {
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

    if (resultListTemplate && !_.contains(TemplateCache.resultListTemplateNames, name)) {
      TemplateCache.resultListTemplateNames.push(name);
    }

    if (defaultTemplate) {
      TemplateCache.defaultTemplates[name] = template;
    }
  }

  /**
   * Remove the given template from the cache.
   * @param name
   * @param string
   */
  public static unregisterTemplate(name) {
    Assert.isNonEmptyString(name);
    if (TemplateCache.templates[name] != undefined) {
      delete TemplateCache.templates[name];
    }
    if (TemplateCache.defaultTemplates[name] != undefined) {
      delete TemplateCache.defaultTemplates[name];
    }
  }

  /**
   * Return a template by its name/FacID.
   * @param name
   * @returns {Template}
   */
  public static getTemplate(name: string): Template {
    // In some scenarios, the template we're trying to load might be somewhere in the page
    // but we could not load it "normally" on page load (eg : UI was loaded with require js)
    // Try a last ditch effort to scan the needed templates.
    if (!TemplateCache.templates[name]) {
      TemplateCache.scanAndRegisterTemplates();
    }
    Assert.exists(TemplateCache.templates[name]);
    return TemplateCache.templates[name];
  }

  /**
   * Get all templates currently registered in the framework.
   * @returns {{}}
   */
  public static getTemplates(): { [templateName: string]: Template } {
    return TemplateCache.templates;
  }

  /**
   * Get all templates name currently registered in the framework.
   * @returns {string[]}
   */
  public static getTemplateNames(): string[] {
    return TemplateCache.templateNames;
  }

  /**
   * Get all page templates name currently registered in the framework.
   * @returns {string[]}
   */
  public static getResultListTemplateNames(): string[] {
    return TemplateCache.resultListTemplateNames;
  }

  /**
   * Get all the "default" templates in the framework.
   * @returns {string[]}
   */
  public static getDefaultTemplates(): string[] {
    return _.keys(TemplateCache.defaultTemplates);
  }

  /**
   * Get a default template by name.
   * @param name The name of the queried template
   */
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
    _.each(UnderscoreTemplate.mimeTypes, type => {
      let scriptList = document.querySelectorAll(`script[id][type='${type}']`);
      let i = scriptList.length;
      let arr: HTMLElement[] = new Array(i);
      while (i--) {
        arr[i] = <HTMLElement>scriptList.item(i);
      }
      _.each(arr, (elem: HTMLElement) => {
        let template = new UnderscoreTemplate(elem);
        TemplateCache.registerTemplate(elem.getAttribute('id'), template);
      });
    });
  }

  private static scanAndRegisterHtmlTemplates() {
    _.each(HtmlTemplate.mimeTypes, type => {
      let scriptList = document.querySelectorAll(`script[id][type='${type}']`);
      let i = scriptList.length;
      let arr: HTMLElement[] = new Array(i);
      while (i--) {
        arr[i] = <HTMLElement>scriptList.item(i);
      }

      _.each(arr, (elem: HTMLElement) => {
        let template = new HtmlTemplate(elem);
        TemplateCache.registerTemplate(elem.getAttribute('id'), template);
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  TemplateCache.scanAndRegisterTemplates();
});
