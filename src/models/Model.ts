import { $$ } from '../utils/Dom';
import { Assert } from '../misc/Assert';
import { Utils } from '../utils/Utils';
import { BaseComponent } from '../ui/Base/BaseComponent';
import * as _ from 'underscore';
import { IStringMap } from '../rest/GenericParam';

export const MODEL_EVENTS = {
  PREPROCESS: 'preprocess',
  CHANGE_ONE: 'change:',
  CHANGE: 'change',
  RESET: 'reset',
  ALL: 'all'
};

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
 * A *model* is a key-value store that triggers various JavaScript events when any value associated to one of its key changes.<br/>
 * This class is meant to be extended, one of the most important extension being the {@link QueryStateModel} class.<br/>
 * Components set values in this key-value store and listen to triggered events in order to update themselves accordingly.<br/>
 */
export class Model extends BaseComponent {
  /**
   * The attributes contained in this model.</br>
   * Normally, you should not set attributes directly on this property, as this would prevent required events from being triggered.
   */
  public attributes: IStringMap<any>;
  public defaultAttributes: IStringMap<any>;
  private eventNameSpace;

  /**
   * The event types that can be triggered:<br/>
   * • `preprocess`: triggered before a value is set on an attribute. This allows the value to be modified before it is set.<br/>
   * • `changeOne`: triggered when a single value changes.</br>
   * • `change`: triggered when one or many values change.</br>
   * • `reset`: triggered when all attributes are reset to their default values. </br>
   * • `all`: triggered after the `change` event.</br>
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

  /**
   * Sets the value of a single specific attribute.</br>
   * Note: this method calls the `setMultiple` method.
   * @param attribute
   * the specific attribute whose value is to be set.
   * @param value
   * the value to set the attribute to.
   * @param options
   * the options (see {@link setMultiple}).
   */
  public set(attribute: string, value: any, options?: IModelSetOptions) {
    let toSet: { [key: string]: any } = {};
    toSet[attribute] = value;
    this.setMultiple(toSet, options);
  }

  /**
   * Gets an object containing all *active* registered attribute key-values.</br>
   * An attribute is considered active when its value is not in its default state.
   * @returns {{object}}
   */
  public getAttributes() {
    let attributes: { [key: string]: any } = {};
    _.each(this.attributes, (attribute, key) => {
      if (_.isObject(attribute)) {
        if (!Utils.objectEqual(attribute, this.defaultAttributes[key])) {
          attributes[key] = attribute;
        }
      } else if (attribute != this.defaultAttributes[key]) {
        attributes[key] = attribute;
      }
    });
    return attributes;
  }

  /**
   * Sets the values of one or many attributes.</br>
   * This method may trigger the following events (in order):</br>
   * • `preprocess`</br>
   * • `changeOne`</br>
   * • `change`</br>
   * • `all`
   * @param toSet
   * the key-value list of attributes with their new intended values.
   * @param options
   * if the `customAttribute` option is set to `true`, the method will not validate whether an attribute is registered or not.</br>
   * If the `validateType` option is set to `true`, the method will ensure that each value type is correct.</br>
   * If the `silent` option is set to `true`, then the `changeOne`, `change` and `all` events will not be triggered.
   */
  public setMultiple(toSet: { [key: string]: any }, options?: IModelSetOptions) {
    let anythingChanged = false;
    this.preprocessEvent(toSet);
    _.each(<_.Dictionary<any>>toSet, (value, attribute?) => {
      if (!options || !options.customAttribute) {
        this.checkIfAttributeExists(attribute);
      }
      value = this.parseToCorrectType(attribute, value);
      if (!options || options.validateType) {
        if (!this.typeIsValid(attribute, value)) {
          return;
        }
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

  /**
   * Sets a new default value to a single specific attribute.</br>
   * Note: specifying a new attribute default value does not set the attribute to that value. This can be done using the {@link setDefault} method.
   * @param attribute
   * the specific attribute whose default value is to be changed.
   * @param value
   * the new intended default value.
   * @param options
   * if the `customAttribute` option is set to `true`, the method will not validate whether the attribute is registered or not.
   */
  public setNewDefault(attribute: string, value: any, options?: IModelSetOptions) {
    if (!options || !options.customAttribute) {
      this.checkIfAttributeExists(attribute);
    }
    this.defaultAttributes[attribute] = value;
  }

  /**
   * Sets a single specific attribute to its default value.</br>
   * Note: this method calls the {@link setMultiple} method without specifying any option.
   * @param attribute
   * the specific attribute whose value is to be set to its default value.
   */
  public setDefault(attribute: string) {
    this.set(attribute, this.defaultAttributes[attribute]);
  }

  /**
   * Gets the value of a single specific attribute.</br>
   * If no attribute is specified, the method instead returns an object containing all registered attribute key-values.
   * @param attribute
   * the specific attribute whose value should be returned.
   * @returns {any}
   */
  public get(attribute?: string): any {
    if (attribute == undefined) {
      return this.attributes;
    } else {
      return this.attributes[attribute];
    }
  }

  /**
   * Gets the default value of a single specific attribute.</br>
   * If no attribute is specified, the method instead returns an object containing all registered attribute key-default values.
   * @param attribute
   * the specific attribute whose default value should be returned.
   * @returns {any}
   */
  public getDefault(attribute?: string): any {
    if (attribute == undefined) {
      return this.defaultAttributes;
    } else {
      return this.defaultAttributes[attribute];
    }
  }

  /**
   * Resets each registered attribute to its default value.</br>
   * Note: this method calls the {@link setMultiple} method without specifying any options.</br>
   * After the `setMultiple` call has returned, this method triggers the `reset` event.
   */
  public reset() {
    this.setMultiple(this.defaultAttributes);
    this.modelWasResetEvent();
  }

  /**
   * Registers a new attribute key-value.
   * @param attribute
   * the name of the new attribute to register.
   * @param defaultValue
   * the newly registered attribute default value.
   */
  public registerNewAttribute(attribute: string, defaultValue: any) {
    this.defaultAttributes[attribute] = defaultValue;
    this.attributes[attribute] = defaultValue;
  }

  /**
   * Gets a string displaying the event namespace followed by the specific event name. The returned string is formatted thus:</br>
   * `[eventNameSpace]:[eventName]`
   * @example `getEventName("reset");` could return `"state:reset"`.
   * @param event
   * the event name.
   * @returns {string}
   */
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

  private typeIsValid(attribute: string, value: any): boolean {
    if (!Utils.isNullOrUndefined(this.attributes[attribute]) && !Utils.isUndefined(value)) {
      if (_.isNumber(this.attributes[attribute])) {
        return this.validateNumber(attribute, value);
      } else if (_.isBoolean(this.attributes[attribute])) {
        return this.validateBoolean(attribute, value);
      } else {
        return this.validateOther(attribute, value);
      }
    }
    return true;
  }

  private validateNumber(attribute: string, value: any): boolean {
    if (!_.isNumber(value) || isNaN(value)) {
      this.logger.error(`Non-matching type for ${attribute}. Expected number and got ${value}`);
      return false;
    }
    return true;
  }

  private validateBoolean(attribute: string, value: any) {
    if (!_.isBoolean(value) && !Utils.parseBooleanIfNotUndefined(value) !== undefined) {
      this.logger.error(`Non matching type for ${attribute}. Expected boolean and got ${value}`);
      return false;
    }
    return true;
  }

  private validateOther(attribute: string, value: any) {
    if (!Utils.isNullOrUndefined(this.defaultAttributes[attribute])) {
      if (typeof value !== typeof this.defaultAttributes[attribute]) {
        this.logger.error(`Non-matching type for ${attribute}. Expected ${typeof this.defaultAttributes[attribute]} and got ${value}`);
        return false;
      }
    }
    return true;
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
      return oldValue !== newValue;
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
