import {Model} from './Model';
import _ = require('underscore');

export interface ComponentOptionsAttributes {
  resultLink: any;
  searchHub: string;
}

export class ComponentOptionsModel extends Model {
  static ID = 'ComponentOptions';

  static defaultAttributes: ComponentOptionsAttributes = {
    resultLink: undefined,
    searchHub: undefined
  };

  static attributesEnum = {
    resultLink: 'resultLink',
    searchHub: 'searchHub'
  };

  constructor(element: HTMLElement, attributes?: ComponentOptionsAttributes) {
    var merged = _.extend({}, ComponentOptionsModel.defaultAttributes, attributes);
    super(element, ComponentOptionsModel.ID, merged);
  }
}