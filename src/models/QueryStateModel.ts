import {Model, IModelSetOptions} from './Model';
import {Assert} from '../misc/Assert';
import {IStringMap} from '../rest/GenericParam';
import {Utils} from '../utils/Utils';
import _ = require('underscore');

export const QUERY_STATE_ATTRIBUTES = {
  Q: 'q',
  FIRST: 'first',
  T: 't',
  TG: 'tg',
  SORT: 'sort',
  HD: 'hd',
  HQ: 'hq',
  QUICKVIEW: 'quickview'
}

export interface IQueryStateIncludedAttribute {
  title: string;
  included: string[];
}

export interface IQueryStateExcludedAttribute {
  title: string;
  excluded: string[];
}

/**
 * The QueryStateModel is a key->value store of the state of every component that can affect a query.<br/>
 * Component set values in this key -> value store, and listen to event triggered to react accordingly.<br/>
 * For example, when a query is launched, the searchbox will set the 'q' attribute, the pager will set the 'first' attribute, etc.<br/>
 * At the same time, this class will trigger the associated event when a value is modified.<br/>
 * eg : The user change the content of the searchbox, and submit a query. This will trigger the following events :<br/>
 * -- state:change:q (because the value of 'q' changed)</br>
 * -- state:change (because at least one value changed in the query state)<br/>
 * Component or external code could hook handler on those events : document.addEventListener('state:change:q', handler);<br/>
 * See : {@link Model}, as all the relevant method are exposed in the base class.<br/>
 * Optionally, the state can be persisted to the query string to allow browser history management : See {@link HistoryController}
 */
export class QueryStateModel extends Model {
  static ID = 'state';

  static defaultAttributes = {
    q: '',
    first: 0,
    t: '',
    hd: '',
    hq: '',
    sort: '',
    tg: '',
    quickview: ''
  };

  static attributesEnum = {
    q: 'q',
    first: 'first',
    t: 't',
    sort: 'sort',
    hd: 'hd',
    hq: 'hq',
    tg: 'tg',
    quickview: 'quickview'
  };

  static getFacetId(id: string, include: boolean = true) {
    return 'f:' + id + (include ? '' : ':not');
  }

  static getFacetOperator(id: string) {
    return 'f:' + id + ':operator';
  }

  static getFacetLookupValue(id: string) {
    return QueryStateModel.getFacetId(id) + ':lookupvalues';
  }

  /**
   * Create a new QueryState
   * @param element
   * @param attributes
   * @param bindings
   */
  constructor(element: HTMLElement, attributes?: IStringMap<string>) {
    let merged = _.extend({}, QueryStateModel.defaultAttributes, attributes);
    super(element, QueryStateModel.ID, merged);
  }

  /**
   * Determine if at least one facet is currently active in the interface (this means that a facet has selected or excluded values)
   * @returns {boolean}
   */
  public atLeastOneFacetIsActive() {
    return !_.isUndefined(_.find(this.attributes, (value, key: any) => {
      return key.indexOf('f:') == 0 && Utils.isNonEmptyArray(value) && key.indexOf(':range') < 0;
    }))
  }

  public set(attribute: string, value: any, options?: IModelSetOptions) {
    this.validate(attribute, value);
    super.set(attribute, value, options);
  }

  private validate(attribute: string, value: any) {
    if (attribute == QueryStateModel.attributesEnum.first) {
      Assert.isLargerOrEqualsThan(0, value);
    }
  }
}

export function setState(model: Model, args: any[]): any {
  Assert.exists(model);

  if (args.length == 0 || args[0] == undefined) {
    // No args means return the model
    return model;
  } else if (args.length == 1 && Utils.isNonEmptyString(args[0])) {
    // One string arg means retrieve value from model
    return model.get(args[0]);
  } else if (_.isObject(args[0])) {
    // One dictionary means set multiple values
    let toSet = args[0];
    let options = _.extend(<IModelSetOptions>{ customAttribute: true }, <IModelSetOptions>args[1]);
    return model.setMultiple(toSet, options);
  } else if (args.length > 1) {
    // Otherwise we're setting a value
    let name = <string>args[0];
    let value = args[1];
    let options = _.extend(<IModelSetOptions>{ customAttribute: true }, <IModelSetOptions>args[2]);
    Assert.isNonEmptyString(name);
    return model.set(name, value, options);
  }
}
