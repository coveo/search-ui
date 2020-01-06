import { compact, indexOf } from 'underscore';
import { Assert } from '../../misc/Assert';
import { Utils } from '../../utils/Utils';
import { HtmlTemplate } from '../Templates/HtmlTemplate';
import { Template } from '../Templates/Template';
import { TemplateCache } from '../Templates/TemplateCache';
import { TemplateList } from '../Templates/TemplateList';
import { UnderscoreTemplate } from '../Templates/UnderscoreTemplate';
import { ComponentOptions } from './ComponentOptions';
import { ComponentOptionsType, IComponentOptions, IComponentOptionsOption } from './IComponentOptions';

export interface IComponentOptionsTemplateOptionArgs extends IComponentOptions<Template> {
  /**
   * Specifies the CSS selector the template must match. The first matching element in the page is used as the template
   * option value, if this element is a valid template.
   *
   * If specified, this parameter takes precedence over [`idAttr`]{@link IComponentOptionsTemplateOptionArgs.idAttr}.
   */
  selectorAttr?: string;

  /**
   * Specifies the CSS selector the templates must match. The list of all matching, valid elements in the page is used
   * as the template option value.
   *
   * Default value is `.`, followed by the hyphened name of the template option being configured (e.g.,
   * `.content-template`, `.result-template`, `.sub-result-template`, `.preview-template`, etc.).
   */
  childSelector?: string;

  /**
   * Specifies the HTML `id` attribute the template must match. The corresponding template must be registered in
   * the [`TemplateCache`]{@link TemplateCache} to be usable as the template option value.
   *
   * If specified, this parameter takes precedence over
   * [`childSelector`]{@link IComponentOptionsTemplateOptionArgs.childSelector}.
   */
  idAttr?: string;
}

export interface IComponentOptionsTemplateOption extends IComponentOptionsOption<Template>, IComponentOptionsTemplateOptionArgs {}

export class TemplateComponentOptions {
  /**
   * Builds a template option.
   *
   * The option accepts a CSS selector matching a valid template. This selector can either be a class, or an ID
   * selector.
   *
   * When building a template option using an ID selector, the matching template must be registered in the
   * [`TemplateCache`]{@link TemplateCache}, however.
   *
   * **Markup Examples:**
   *
   * > `data-foo-id="#bar"`
   *
   * > `data-foo-selector=".bar"`
   *
   * @param optionArgs The arguments to apply when building the option.
   * @returns {Template} The resulting option value.
   */
  static buildTemplateOption(optionArgs?: IComponentOptionsTemplateOptionArgs): Template {
    return ComponentOptions.buildOption<Template>(ComponentOptionsType.TEMPLATE, TemplateComponentOptions.loadTemplateOption, optionArgs);
  }

  static loadTemplateOption(
    element: HTMLElement,
    name: string,
    option: IComponentOptionsTemplateOption,
    doc: Document = document
  ): Template {
    let template: Template;

    // Attribute: template selector
    const selectorAttr = option.selectorAttr || ComponentOptions.attrNameFromName(name, option) + '-selector';
    const selector = element.getAttribute(selectorAttr) || ComponentOptions.getAttributeFromAlias(element, option);
    if (selector != null) {
      const templateElement = <HTMLElement>doc.querySelector(selector);
      if (templateElement != null) {
        template = TemplateComponentOptions.createResultTemplateFromElement(templateElement);
      }
    }
    // Attribute: template id
    if (template == null) {
      const idAttr = option.idAttr || ComponentOptions.attrNameFromName(name, option) + '-id';
      const id = element.getAttribute(idAttr) || ComponentOptions.getAttributeFromAlias(element, option);
      if (id != null) {
        template = TemplateComponentOptions.loadResultTemplateFromId(id);
      }
    }
    // Child
    if (template == null) {
      let childSelector = option.childSelector;
      if (childSelector == null) {
        childSelector = '.' + name.replace(/([A-Z])/g, '-$1').toLowerCase();
      }
      template = TemplateComponentOptions.loadChildrenResultTemplateFromSelector(element, childSelector);
    }
    return template;
  }

  static createResultTemplateFromElement(element: HTMLElement): Template {
    Assert.exists(element);
    const type = element.getAttribute('type');
    const mimeTypes =
      'You must specify the type of template. Valid values are:' +
      ' ' +
      UnderscoreTemplate.mimeTypes.toString() +
      ' ' +
      HtmlTemplate.mimeTypes.toString();
    Assert.check(Utils.isNonEmptyString(type), mimeTypes);

    if (indexOf(UnderscoreTemplate.mimeTypes, type.toLowerCase()) != -1) {
      return UnderscoreTemplate.create(element);
    } else if (indexOf(HtmlTemplate.mimeTypes, type.toLowerCase()) != -1) {
      return new HtmlTemplate(element);
    } else {
      Assert.fail('Cannot guess template type from attribute: ' + type + '. Valid values are ' + mimeTypes);
      return undefined;
    }
  }

  static loadResultTemplateFromId(templateId: string): Template {
    return Utils.isNonEmptyString(templateId) ? TemplateCache.getTemplate(templateId) : null;
  }

  static loadChildrenResultTemplateFromSelector(element: HTMLElement, selector: string): Template {
    const foundElements = ComponentOptions.loadChildrenHtmlElementFromSelector(element, selector);
    if (foundElements.length > 0) {
      return new TemplateList(compact(foundElements.map(element => TemplateComponentOptions.createResultTemplateFromElement(element))));
    }
    return null;
  }
}
