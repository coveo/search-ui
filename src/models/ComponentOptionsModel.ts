import { Model } from './Model';
import * as _ from 'underscore';

export const COMPONENT_OPTIONS_ATTRIBUTES = {
  RESULT_LINK: 'resultLink',
  SEARCH_HUB: 'searchHub',
  SEARCH_BOX: 'searchBox'
};

export interface IComponentOptionsAttributes {
  resultLink: any;
  searchHub: string;
  searchBox: any;
}

export class ComponentOptionsModel extends Model {
  static ID = 'ComponentOptions';

  static defaultAttributes: IComponentOptionsAttributes = {
    resultLink: undefined,
    searchHub: undefined,
    searchBox: undefined
  };

  static attributesEnum = {
    resultLink: 'resultLink',
    searchHub: 'searchHub',
    searchBox: 'searchBox'
  };

  constructor(element: HTMLElement, attributes?: IComponentOptionsAttributes) {
    var merged = _.extend({}, ComponentOptionsModel.defaultAttributes, attributes);
    super(element, ComponentOptionsModel.ID, merged);
  }
}
