import { Logger } from '../../misc/Logger';
import { ValidLayout } from '../ResultLayout/ResultLayout';
import { $$ } from '../../utils/Dom';
import { TemplateConditionEvaluator } from './TemplateConditionEvaluator';
import { TemplateFieldsEvaluator } from './TemplateFieldsEvaluator';
import { IQueryResult } from '../../rest/QueryResult';
import { ResponsiveComponents } from '../ResponsiveComponents/ResponsiveComponents';
import * as _ from 'underscore';
import { Initialization, LazyInitialization } from '../Base/Initialization';
import { Utils } from '../../utils/Utils';

export type TemplateRole = 'table-header' | 'table-footer';

export interface ITemplateProperties {
  condition?: Function;
  conditionToParse?: string;
  layout?: ValidLayout;
  mobile?: boolean;
  tablet?: boolean;
  desktop?: boolean;
  fieldsToMatch?: IFieldsToMatch[];
  role?: TemplateRole;
}

export interface IFieldsToMatch {
  values?: string[];
  field: string;
}

export interface IInstantiateTemplateOptions {
  currentLayout?: ValidLayout;
  checkCondition?: boolean;
  wrapInDiv?: boolean;
  responsiveComponents?: ResponsiveComponents;
}

export class DefaultInstantiateTemplateOptions implements IInstantiateTemplateOptions {
  public currentLayout: ValidLayout;
  public checkCondition: boolean;
  public wrapInDiv: boolean;
  public responsiveComponents: ResponsiveComponents;

  constructor() {
    this.currentLayout = null;
    this.checkCondition = true;
    this.wrapInDiv = true;
    this.responsiveComponents = new ResponsiveComponents();
  }

  get(): IInstantiateTemplateOptions {
    return {
      currentLayout: this.currentLayout,
      checkCondition: this.checkCondition,
      wrapInDiv: this.wrapInDiv,
      responsiveComponents: this.responsiveComponents
    };
  }

  merge(other: IInstantiateTemplateOptions): IInstantiateTemplateOptions {
    if (other) {
      return _.extend(this.get(), other);
    }
    return this.get();
  }
}

export class Template implements ITemplateProperties {
  private logger: Logger = new Logger(this);
  public condition: Function;
  public conditionToParse: string;
  public fieldsToMatch: IFieldsToMatch[];
  public mobile: boolean;
  public tablet: boolean;
  public desktop: boolean;
  public fields: string[] = [];
  public layout: ValidLayout;
  public role: TemplateRole;

  constructor(public dataToString?: (object?: any) => string) {}

  instantiateToString(
    object: IQueryResult,
    instantiateOptions: IInstantiateTemplateOptions = new DefaultInstantiateTemplateOptions()
  ): string {
    if (this.dataToString) {
      if (instantiateOptions.checkCondition === false) {
        return this.dataToString(object);
      }

      // Should not happen but...
      // Normally, top level call from sub-class will have already created a
      // DefaultInstantiateTemplateOptions and merged down
      if (instantiateOptions.responsiveComponents == null) {
        instantiateOptions.responsiveComponents = new ResponsiveComponents();
      }

      // Mobile/tablet/desktop checks are only for "hard" set value (triple equal)
      // If it's undefined, we skip those checks, and we assume the template works correctly for any given screen size
      if (this.mobile === true && !instantiateOptions.responsiveComponents.isSmallScreenWidth()) {
        this.logger.trace('Template was skipped because it is optimized for small screen width', this);
        return null;
      } else if (this.mobile === false && instantiateOptions.responsiveComponents.isSmallScreenWidth()) {
        this.logger.trace('Template was skipped because it is not optimized for small screen width', this);
        return null;
      }

      if (this.tablet === true && !instantiateOptions.responsiveComponents.isMediumScreenWidth()) {
        this.logger.trace('Template was skipped because it is optimized for medium screen width', this);
        return null;
      } else if (this.tablet === false && instantiateOptions.responsiveComponents.isMediumScreenWidth()) {
        this.logger.trace('Template was skipped because it is not optimized for medium screen width', this);
        return null;
      }

      if (this.desktop === true && !instantiateOptions.responsiveComponents.isLargeScreenWidth()) {
        this.logger.trace('Template was skipped because it is optimized for large screen width', this);
        return null;
      } else if (this.desktop === false && instantiateOptions.responsiveComponents.isLargeScreenWidth()) {
        this.logger.trace('Template was skipped because it is not optimized for large screen width', this);
        return null;
      }

      if (this.layout != null && instantiateOptions.currentLayout != null && instantiateOptions.currentLayout !== this.layout) {
        this.logger.trace('Template was skipped because layout does not match', this, this.layout);
        return null;
      }
      try {
        this.logger.trace('Evaluating template ...');
        // Condition (as a function) is eval'ed, first
        if (this.condition != null && this.condition(object)) {
          this.logger.trace('Template was loaded because condition was :', this.condition, object);
          return this.dataToString(object);
        }
        // Condition (as a string) is parsed, if available.
        if (
          this.conditionToParse != null &&
          TemplateConditionEvaluator.evaluateCondition(this.conditionToParse, object, instantiateOptions.responsiveComponents)
        ) {
          this.logger.trace('Template was loaded because condition was :', this.conditionToParse, object);
          return this.dataToString(object);
        }
        // fieldsToMatch is yet another fallback that allows to specify if a template should be loaded.
        if (this.fieldsToMatch != null && TemplateFieldsEvaluator.evaluateFieldsToMatch(this.fieldsToMatch, object)) {
          this.logger.trace('Template was loaded because condition was :', this.fieldsToMatch, object);
          return this.dataToString(object);
        }
        // If there is no condition at all, this means "true"
        if (this.condition == null && this.conditionToParse == null && this.fieldsToMatch == null) {
          this.logger.trace('Template was loaded because there was *NO* condition', this.condition, object);
          return this.dataToString(object);
        }
      } catch (e) {
        new Logger(this).error('Cannot instantiate template', e.message, this.getTemplateInfo());
        new Logger(this).warn('A default template was used');
        return null;
      }
    }
    this.logger.trace('Template was skipped because it did not match any condition', this);
    return null;
  }

  addField(field: string) {
    if (!_.contains(this.fields, field)) {
      this.fields.push(field);
    }
  }

  addFields(fields: string[]) {
    if (Utils.isNonEmptyArray(fields)) {
      this.fields = Utils.concatWithoutDuplicate(this.fields, fields);
    }
  }

  getComponentsInside(tmplString: string): string[] {
    let allComponentsInsideCurrentTemplate = _.map(Initialization.getListOfRegisteredComponents(), (componentId: string) => {
      let regex = new RegExp(`Coveo${componentId}`, 'g');
      if (regex.exec(tmplString)) {
        return componentId;
      } else {
        return null;
      }
    });

    return _.compact(allComponentsInsideCurrentTemplate);
  }

  instantiateToElement(object: IQueryResult, instantiateTemplateOptions: IInstantiateTemplateOptions = {}): Promise<HTMLElement> {
    let mergedOptions = new DefaultInstantiateTemplateOptions().merge(instantiateTemplateOptions);

    var html = this.instantiateToString(object, mergedOptions);
    if (html == null) {
      return null;
    }

    let allComponentsLazyLoaded = _.map(this.getComponentsInside(html), (component: string) => {
      return LazyInitialization.getLazyRegisteredComponent(component).then(lazyLoadedComponent => {
        return lazyLoadedComponent;
      });
    });

    return Promise.all(allComponentsLazyLoaded).then(() => {
      const layout = this.layout || mergedOptions.currentLayout;
      const elemType = layout === 'table' ? 'tr' : 'div';
      var element = $$(elemType, {}, html).el;
      if (!mergedOptions.wrapInDiv && element.children.length === 1) {
        element = <HTMLElement>element.children.item(0);
      }
      if (layout) {
        $$(element).addClass(`coveo-${layout}-layout`);
      }
      this.logger.trace('Instantiated result template', object, element);
      element['template'] = this;
      return element;
    });
  }

  toHtmlElement(): HTMLElement {
    return null;
  }

  getFields(): string[] {
    return this.fields;
  }

  getType() {
    return 'Template';
  }

  setConditionWithFallback(condition: string) {
    // In some circumstances (eg: locker service in SF), with strict Content-Security-Policy, eval / new Function are not allowed by the browser.
    // Try to use the eval method, if possible. Otherwise fallback to a mechanism where we will try to parse/evaluate the condition as a simple string.
    try {
      this.condition = new Function('obj', 'with(obj||{}){return ' + condition + '}');
    } catch (e) {
      this.conditionToParse = condition;
    }
  }

  protected getTemplateInfo(): any {
    // Try to get info on the template by returning the first parameter found that is not undefined.
    return this.conditionToParse != undefined ? this.conditionToParse : this.condition != undefined ? this.condition : this.fieldsToMatch;
  }
}
