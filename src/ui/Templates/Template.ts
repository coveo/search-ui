import {Logger} from '../../misc/Logger';
import {StringUtils} from '../../utils/StringUtils';
import {Initialization} from '../Base/Initialization';
import {htmlToDom} from '../../utils/Dom';
import {BaseComponent} from '../Base/BaseComponent';

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

  constructor(public dataToString?: (object?: any) => string, public condition?: Function) {
  }

  instantiateToString(object?: any, checkCondition = true): string {
    if (this.dataToString && (!checkCondition || this.condition == null || this.condition(object))) {
      return this.dataToString(object);
    }
    return null;
  }

  instantiateToElement(object?: any, checkCondition = true): HTMLElement {
    var html = this.instantiateToString(object, checkCondition);
    if (html != null) {
      var element = <HTMLElement>htmlToDom(html);
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
    return 'Template'
  }
}
