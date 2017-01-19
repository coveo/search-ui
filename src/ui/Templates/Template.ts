import {Logger} from '../../misc/Logger';
import {StringUtils} from '../../utils/StringUtils';
import {Initialization} from '../Base/Initialization';
import {BaseComponent} from '../Base/BaseComponent';
import {ValidLayout} from '../ResultLayout/ResultLayout';
import {$$} from '../../utils/Dom';

export interface ITemplateOptions {
  layout: ValidLayout;
}

export class Template {
  static getFieldFromString(text: string) {
    var fields: string[] = _.map(StringUtils.match(text, /(?:(?!\b@)@([a-z0-9]+(?:\.[a-z0-9]+)*\b))|\braw.([a-z0-9]+)|\braw\['([^']+)'\]|\braw\['([^']+)'\]/gi), (field) => {
      return field[1] || field[2] || field[3] || field[4] || null;
    });

    _.each(Initialization.getListOfRegisteredComponents(), (componentId: string) => {
      var componentFields = (<any>Initialization.getRegisteredComponent(componentId)).fields;
      if (componentFields != null && text.indexOf(BaseComponent.computeCssClassNameForType(componentId)) != -1) {
        fields = fields.concat(componentFields);
      }
    });

    return fields;
  }

  private logger: Logger = new Logger(this);
  public condition: Function;
  public conditionToParse: string;

  constructor(public dataToString?: (object?: any) => string) {
  }

 
  /*
   * Instantiate the template to a string if the condition matches
   */
  instantiateToString(object?: any, checkCondition = true, options?: ITemplateOptions): string {
    if (this.dataToString) {
      if (!checkCondition) {
        return this.dataToString(object);
      }
      // Condition (as a function) is eval'ed, first
      if (this.condition != null && this.condition(object)) {
        return this.dataToString(object);
      }
      // Condition (as a string) is parsed, if available.
      if (this.conditionToParse != null && this.evaluateCondition(this.conditionToParse, object)) {
        return this.dataToString(object);
      }
      // If there is no condition at all, this means "true"
      if (this.condition == null && this.conditionToParse == null) {
        return this.dataToString(object);
      }
    }
    return null;

  }

  instantiateToElement(object?: any, checkCondition = true, wrapInDiv = true, options?: ITemplateOptions): HTMLElement {
    var html = this.instantiateToString(object, checkCondition, options);
    if (html != null) {
      var element = $$('div', {}, html).el;
      if (!wrapInDiv && element.children.length === 1) {
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

  evaluateCondition(condition: string, result: IQueryResult): Boolean {
    let templateShouldBeLoaded = true;

    let fieldsInCondition = Template.getFieldFromString(condition);
    _.each(fieldsInCondition, (fieldInCondition: string) => {
      let matchingFieldValues = this.evaluateMatchingFieldValues(fieldInCondition, condition);
      let fieldShouldNotBeNull = matchingFieldValues.length != 0 || this.evaluateFieldShouldNotBeNull(fieldInCondition, condition);

      if (fieldShouldNotBeNull) {
        templateShouldBeLoaded = templateShouldBeLoaded && result.raw[fieldInCondition] != null;
      }
      if (templateShouldBeLoaded) {
        _.each(matchingFieldValues, (fieldValue: string) => {
          templateShouldBeLoaded = templateShouldBeLoaded && result.raw[fieldInCondition].toLowerCase() == fieldValue.toLowerCase();
        });
      }
    });

    if (templateShouldBeLoaded) {
      if (this.evaluateShouldUseSmallScreen(condition)) {
        templateShouldBeLoaded = templateShouldBeLoaded && DeviceUtils.isSmallScreenWidth();
      }
    }
    return templateShouldBeLoaded;
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

  private evaluateMatchingFieldValues(field: string, condition: string) {
    let foundForCurrentField = [];
    // try to get the field value in the format raw.filetype == "YouTubeVideo"
    let firstRegexToGetValue = new RegExp(`raw\.${field}\\s*=+\\s*["|']([a-zA-Z]+)["|']`, 'gi');
    // try to get the field value in the format raw['filetype'] == "YouTubeVideo"
    let secondRegexToGetValue = new RegExp(`raw\[["|']${field}["|']\]\\s*=+\\s*["|']([a-zA-Z]+)["|']`, 'gi');


    let matches = StringUtils.match(condition, firstRegexToGetValue).concat(StringUtils.match(condition, secondRegexToGetValue));
    matches.forEach((match) => {
      foundForCurrentField = foundForCurrentField.concat(match[1]);
    });
    return _.unique(foundForCurrentField);
  }

  private evaluateFieldShouldNotBeNull(field: string, condition: string): boolean {
    let firstRegexToMatchNonNull = new RegExp(`raw\.${field}\\s*!=\\s*(?=null|undefined)`, 'gi');
    let secondRegexToMatchNonNull = new RegExp(`raw\[["|']${field}["|']\]\\s*!=\\s*(?=null|undefined)`, 'gi');
    return condition.match(firstRegexToMatchNonNull) != null || condition.match(secondRegexToMatchNonNull) != null;
  }

  private evaluateShouldUseSmallScreen(condition: string) {
    return condition.match(/Coveo\.DeviceUtils\.isSmallScreenWidth/gi);
  }
}
