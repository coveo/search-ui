import { Model, IModelSetOptions } from './Model';
import { Assert } from '../misc/Assert';
import { IStringMap } from '../rest/GenericParam';
import * as _ from 'underscore';
import { Utils } from '../utils/Utils';

export const QUERY_STATE_ATTRIBUTES = {
  Q: 'q',
  FIRST: 'first',
  T: 't',
  TG: 'tg',
  SORT: 'sort',
  LAYOUT: 'layout',
  HD: 'hd',
  HQ: 'hq',
  QUICKVIEW: 'quickview'
};

export interface IQueryStateIncludedAttribute {
  title: string;
  included: string[];
}

export interface IQueryStateExcludedAttribute {
  title: string;
  excluded: string[];
}

/**
 * The `QueryStateModel` class is a key-value store which contains the current state of the components that can affect
 * the query (see [State](https://developers.coveo.com/x/RYGfAQ)). This class inherits from the [`Model`]{@link Model}
 * class. Optionally, it is possible to persist the state in the query string in order to enable browser history
 * management (see the [`HistoryController`]{@link HistoryController} class).
 *
 * Components set values in the `QueryStateModel` instance to reflect their current state. The `QueryStateModel`
 * triggers state events (see [`eventTypes`]{@link Model.eventTypes}) whenever one of its values is modified. Components
 * listen to triggered state events to update themselves when appropriate.
 *
 * For instance, when a query is triggered, the [`Searchbox`]{@link Searchbox} component sets the `q` attribute (the
 * basic query expression), while the [`Pager`]{@link Pager} component sets the `first` attribute (the index of the
 * first result to display in the result list), and so on.
 *
 * **Example:**
 *
 * > The user modifies the content of the `Searchbox` and submits a query. This triggers the following state events:
 * > - `state:change:q` (because the value of `q` has changed).
 * > - `state:change` (because at least one value has changed in the `QueryStateModel`).
 * >
 * > Components or external code can attach handlers to those events:
 * > ```javascript
 * > Coveo.$$(document).on('state:change:q', function() {
 * >   [ ... ]
 * > });
 * > ```
 *
 * **Note:**
 * > Normally, you should interact with the `QueryStateModel` instance using the [`Coveo.state`]{@link state} top-level
 * > function.
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
    layout: 'list',
    tg: '',
    quickview: ''
  };

  static attributesEnum = {
    q: 'q',
    first: 'first',
    t: 't',
    sort: 'sort',
    layout: 'layout',
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
   * Creates a new `QueryStateModel` instance.
   * @param element The HTMLElement on which to instantiate the `QueryStateModel`.
   * @param attributes The state key-value store to instantiate the `QueryStateModel` with.
   */
  constructor(element: HTMLElement, attributes?: IStringMap<string>) {
    let merged = _.extend({}, QueryStateModel.defaultAttributes, attributes);
    super(element, QueryStateModel.ID, merged);
  }

  /**
   * Validates whether at least one facet is currently active (has selected or excluded values) in the interface.
   *
   * @returns {boolean} `true` if at least one facet is active; `false` otherwise.
   */
  public atLeastOneFacetIsActive() {
    return !_.isUndefined(
      _.find(this.attributes, (value, key: any) => {
        return key.indexOf('f:') == 0 && !Utils.arrayEqual(this.getDefault(key), value);
      })
    );
  }

  public set(attribute: string, value: any, options?: IModelSetOptions) {
    this.validate(attribute, value);
    super.set(attribute, value, options);
  }

  private validate(attribute: string, value: any) {
    if (attribute == QueryStateModel.attributesEnum.first) {
      Assert.isNumber(value);
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
