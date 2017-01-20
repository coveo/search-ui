import {Logger} from '../../misc/Logger';
import {ValidLayout} from '../ResultLayout/ResultLayout';
import {$$} from '../../utils/Dom';
import {TemplateConditionEvaluator} from './TemplateConditionEvaluator';
import {TemplateFieldsEvaluator} from './TemplateFieldsEvaluator';
import {DeviceUtils} from '../../utils/DeviceUtils';
import {IQueryResult} from '../../rest/QueryResult';

export interface ITemplateProperties {
  condition?: Function;
  conditionToParse?: string;
  layout?: ValidLayout
  mobile?: boolean;
  fieldsToMatch?: IFieldsToMatch[];
}

export interface IFieldsToMatch {
  values: string[];
  field: string;
}

export interface IInstantiateTemplateOptions {
  currentLayout?: ValidLayout;
  checkCondition?: boolean;
  wrapInDiv?: boolean;
}

export class DefaultInstantiateTemplateOptions implements IInstantiateTemplateOptions {
  public currentLayout: ValidLayout;
  public checkCondition: boolean;
  public wrapInDiv: boolean;

  constructor() {
    this.currentLayout = null;
    this.checkCondition = true;
    this.wrapInDiv = true;
  }

  get(): IInstantiateTemplateOptions {
    return {
      currentLayout: this.currentLayout,
      checkCondition: this.checkCondition,
      wrapInDiv: this.wrapInDiv
    }
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
  public fields: string[];
  public layout: ValidLayout;

  constructor(public dataToString?: (object?: any) => string) {
  }

  instantiateToString(object: IQueryResult, instantiateOptions: IInstantiateTemplateOptions = {}): string {
    if (this.dataToString) {
      if (instantiateOptions.checkCondition === false) {
        return this.dataToString(object);
      }

      if (this.layout != null && instantiateOptions.currentLayout !== this.layout) {
        this.logger.trace('Template was skipped because layout does not match', this, this.layout);
        return null;
      }

      if (this.mobile && !DeviceUtils.isSmallScreenWidth()) {
        this.logger.trace('Template was skipped because it is optimized for small screen', this);
        return null;
      }

      this.logger.trace('Evaluating template ...')
      // Condition (as a function) is eval'ed, first
      if (this.condition != null && this.condition(object)) {
        this.logger.trace('Template was loaded because condition was :', this.condition, object);
        return this.dataToString(object);
      }
      // Condition (as a string) is parsed, if available.
      if (this.conditionToParse != null && TemplateConditionEvaluator.evaluateCondition(this.conditionToParse, object)) {
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
    }

    this.logger.trace('Template was skipped because it did not match any condition', this);
    return null;
  }

  instantiateToElement(object: IQueryResult, instantiateTemplateOptions: IInstantiateTemplateOptions = {}): HTMLElement {
    let merged = new DefaultInstantiateTemplateOptions().merge(instantiateTemplateOptions);

    var html = this.instantiateToString(object, merged);
    if (html != null) {
      var element = $$('div', {}, html).el;
      if (!merged.wrapInDiv && element.children.length === 1) {
        element = <HTMLElement>element.firstChild;
      }
      this.logger.trace('Instantiated result template', object, element);
      element['template'] = this;
      return element;
    }
    return null;
  }

  toHtmlElement(): HTMLElement {
    return null;
  }

  getFields(): string[] {
    return [];
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
}
