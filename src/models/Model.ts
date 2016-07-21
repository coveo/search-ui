import {$$} from '../utils/Dom';
import {Assert} from '../misc/Assert';
import {Utils} from '../utils/Utils';
import {BaseComponent} from '../ui/Base/BaseComponent';

export const MODEL_EVENTS = {
  PREPROCESS: 'preprocess',
  CHANGE_ONE: 'change:',
  CHANGE: 'change',
  RESET: 'reset',
  ALL: 'all'
}

export interface IModelSetOptions {
  silent?: boolean;
  customAttribute?: boolean;
  validateType?: boolean;
}

export interface IAttributeChangedEventArg {
  attribute: string;
  value: any;
}

export interface IAttributesChangedEventArg {
  attributes: {};
}

export interface IModelChangedEventArg {
  model: Model;
}

/**
 * A model is basically a key -> value store that trigger letious javascript event when one of the value for each of it's key changes.<br/>
 * This is a class that is meant to be extended : the most important one probably being the {@link QueryStateModel}<br/>
 * Component set values in this key -> value store, and listen to event triggered to react accordingly.<br/>
 */
export class Model extends BaseComponent {
  /**
   * The attributes contained in this model. Normally, you should not set attribute directly on this property, as this will not cause the required events to be triggered.
   */
  public attributes: { [key: string]: any };
  public defaultAttributes: { [key: string]: any };
  private eventNameSpace;

  // changeOne: is when one specific attribute change, change is when any attribute change
  /**
   * The event type that can be triggered :<br/>
   * -- preprocess -> triggered before a value is set on an attribute, to allow to modify it before it's set.<br/>
   * -- changeOne -> triggered when a single value change.
   * @type {{preprocess: string, changeOne: string, change: string, reset: string, all: string}}
   */
  public static eventTypes = {
    preprocess: 'preprocess',
    changeOne: 'change:',
    change: 'change',
    reset: 'reset',
    all: 'all'
  };

  constructor(element: HTMLElement, id: string, attributes: { [key: string]: any }) {
    super(element, id);
    this.eventNameSpace = id;

    this.defaultAttributes = Utils.extendDeep(this.defaultAttributes, attributes);
    this.attributes = attributes;
    this.logger.debug('Creating model');
  }

  public set(attribute: string, value: any, options?: IModelSetOptions) {
    let toSet: { [key: string]: any } = {};
    toSet[attribute] = value;
    this.setMultiple(toSet, options);
  }

  public getAttributes() {
    let attributes: { [key: string]: any } = {};
    _.each(this.attributes, (attribute, key) => {
      if (_.isObject(attribute)) {
        if (!Utils.objectEqual(attribute, this.defaultAttributes[key])) {
          attributes[key] = attribute
        }
      } else if (attribute != this.defaultAttributes[key]) {
        attributes[key] = attribute
      }
    })
    return attributes;
  }

  public setMultiple(toSet: { [key: string]: any }, options?: IModelSetOptions) {
    let anythingChanged = false;
    this.preprocessEvent(toSet);
    _.each(<_.Dictionary<any>>toSet, (value, attribute?) => {
      if (!options || !options.customAttribute) {
        this.checkIfAttributeExists(attribute);
      }
      value = this.parseToCorrectType(attribute, value);
      if (!options || options.validateType) {
        this.validateType(attribute, value);
      }
      if (this.checkIfAttributeChanged(attribute, value)) {
        this.attributes[attribute] = value;
        anythingChanged = true;
        if (options == null || !options.silent) {
          this.attributeHasChangedEvent(attribute);
        }
      }
    });
    if (anythingChanged && (options == null || !options.silent)) {
      this.attributesHasChangedEvent();
      this.anyEvent();
    }
  }

  public setNewDefault(attribute: string, value: any, options?: IModelSetOptions) {
    if (!options || !options.customAttribute) {
      this.checkIfAttributeExists(attribute);
    }
    this.defaultAttributes[attribute] = value;
  }

  public setDefault(attribute: string, options?: IModelSetOptions) {
    this.set(attribute, this.defaultAttributes[attribute]);
  }

  public get(attribute?: string): any {
    if (attribute == undefined) {
      return this.attributes
    } else {
      return this.attributes[attribute];
    }
  }

  public getDefault(attribute?: string): any {
    if (attribute == undefined) {
      return this.defaultAttributes;
    } else {
      return this.defaultAttributes[attribute];
    }
  }

  public reset() {
    this.setMultiple(this.defaultAttributes);
    this.modelWasResetEvent();
  }

  public registerNewAttribute(attribute: string, defaultValue: any) {
    this.defaultAttributes[attribute] = defaultValue;
    this.attributes[attribute] = defaultValue;
  }

  public getEventName(event: string) {
    return this.eventNameSpace + ':' + event;
  }

  private attributesHasChangedEvent() {
    $$(this.element).trigger(this.getEventName(Model.eventTypes.change), this.createAttributesChangedArgument());
  }

  private attributeHasChangedEvent(attr: string) {
    $$(this.element).trigger(this.getEventName(Model.eventTypes.changeOne) + attr, this.createAttributeChangedArgument(attr));
  }

  private preprocessEvent(attributes: { [key: string]: any }) {
    $$(this.element).trigger(this.getEventName(Model.eventTypes.preprocess), attributes);
  }

  private modelWasResetEvent() {
    $$(this.element).trigger(this.getEventName(Model.eventTypes.reset), this.createModelChangedArgument());
  }

  private anyEvent() {
    $$(this.element).trigger(this.getEventName(Model.eventTypes.all), this.createModelChangedArgument());
  }

  private createAttributeChangedArgument(attribute: string): IAttributeChangedEventArg {
    return { attribute: attribute, value: this.attributes[attribute] };
  }

  private createAttributesChangedArgument(): IAttributesChangedEventArg {
    return { attributes: this.attributes };
  }

  private createModelChangedArgument(): IModelChangedEventArg {
    return { model: this };
  }

  private checkIfAttributeExists(attribute: string) {
    Assert.check(_.has(this.attributes, attribute));
  }

  private validateType(attribute: string, value: any) {
    if (!Utils.isNullOrUndefined(this.attributes[attribute]) && !Utils.isUndefined(value)) {
      if (_.isNumber(this.attributes[attribute])) {
        Assert.check(_.isNumber(value) && !isNaN(value), 'Non-matching type')
      } else if (_.isBoolean(this.attributes[attribute])) {
        Assert.check(_.isBoolean(value) || Utils.parseBooleanIfNotUndefined(value) !== undefined, 'Non-matching type');
      } else {
        if (!Utils.isNullOrUndefined(this.defaultAttributes[attribute])) {
          Assert.check(typeof value === typeof this.defaultAttributes[attribute], 'Non-matching type');
        }
      }
    }
  }

  private parseToCorrectType(attribute: string, value: any): any {
    if (_.isNumber(this.attributes[attribute])) {
      return parseInt(value, 10);
    } else if (_.isBoolean(this.attributes[attribute])) {
      if (_.isBoolean(value)) {
        return value;
      } else {
        return Utils.parseBooleanIfNotUndefined(value);
      }
    }
    return value;
  }

  private checkIfAttributeChanged(attribute: string, newValue: any): boolean {
    let oldValue = this.attributes[attribute];
    if (_.isNumber(oldValue) || _.isString(oldValue) || _.isBoolean(oldValue)) {
      return oldValue !== newValue
    }
    if (_.isArray(oldValue)) {
      return !Utils.arrayEqual(oldValue, newValue);
    }
    if (_.isObject(oldValue)) {
      return !Utils.objectEqual(oldValue, newValue);
    }
    return true;
  }

  public debugInfo() {
    return null;
  }
}
