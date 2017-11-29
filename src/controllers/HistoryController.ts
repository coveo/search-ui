import { Assert } from '../misc/Assert';
import { QueryController } from '../controllers/QueryController';
import { QueryStateModel } from '../models/QueryStateModel';
import { InitializationEvents } from '../events/InitializationEvents';
import { $$ } from '../utils/Dom';
import { HashUtils } from '../utils/HashUtils';
import { Defer } from '../misc/Defer';
import { RootComponent } from '../ui/Base/RootComponent';
import { Utils } from '../utils/Utils';
import * as _ from 'underscore';
import { IStringMap } from '../rest/GenericParam';
import { QUERY_STATE_ATTRIBUTES } from '../models/QueryStateModel';
import { IAnalyticsClient } from '../ui/Analytics/AnalyticsClient';
import { analyticsActionCauseList, IAnalyticsFacetMeta, IAnalyticsActionCause } from '../ui/Analytics/AnalyticsActionListMeta';
import { logSearchBoxSubmitEvent, logSortEvent } from '../ui/Analytics/SharedAnalyticsCalls';
import { Model } from '../models/Model';

export interface IHistoryControllerEnvironment {
  model: QueryStateModel;
  window: Window;
  queryController: QueryController;
  usageAnalytics: IAnalyticsClient;
}

/**
 * This component is instantiated automatically by the framework on the root if the {@link SearchInterface}.<br/>
 * When the {@link SearchInterface.options.enableHistory} option is set to true, this component is instantiated.<br/>
 * It's only job is to apply changes in the {@link QueryStateModel} to the hash in the URL, and vice versa.<br/>
 * This component does *not* hold the state of the interface, it only represent it in the URL.
 */
export class HistoryController extends RootComponent {
  static ID = 'HistoryController';

  static attributesThatDoNotTriggerQuery = ['quickview'];

  private ignoreNextHashChange = false;
  private initialHashChange = false;
  private willUpdateHash: boolean = false;
  private hashchange: (...args: any[]) => void;
  private lastState: IStringMap<any>;
  private hashUtilsModule: typeof HashUtils;

  /**
   * Create a new HistoryController
   * @param element
   * @param environment
   */
  constructor(public element: HTMLElement, private environment: IHistoryControllerEnvironment) {
    super(element, HistoryController.ID);

    Assert.exists(this.model);
    Assert.exists(this.queryController);

    $$(this.element).on(InitializationEvents.restoreHistoryState, () => {
      this.logger.trace('Restore history state. Update model');
      this.updateModelFromHash();
      this.lastState = this.model.getAttributes();
    });

    $$(this.element).on(this.model.getEventName(Model.eventTypes.all), () => {
      this.logger.trace('Query model changed. Update hash');
      this.updateHashFromModel();
    });

    this.hashchange = () => {
      this.handleHashChange();
      this.lastState = this.model.getAttributes();
    };

    this.window.addEventListener('hashchange', this.hashchange);
    $$(this.element).on(InitializationEvents.nuke, () => this.handleNuke());
  }

  public set hashUtils(hashUtils: typeof HashUtils) {
    this.hashUtilsModule = hashUtils;
  }

  public get hashUtils() {
    return this.hashUtilsModule ? this.hashUtilsModule : HashUtils;
  }

  public get window() {
    return this.environment.window;
  }

  public get model() {
    return this.environment.model;
  }

  public get queryController() {
    return this.environment.queryController;
  }

  public get usageAnalytics() {
    return this.environment.usageAnalytics;
  }

  /**
   * Set the given map of key value in the hash of the URL
   * @param values
   */
  public setHashValues(values: {}) {
    this.logger.trace('Update history hash');

    const hash = '#' + this.hashUtils.encodeValues(values);
    this.ignoreNextHashChange = this.window.location.hash != hash;

    this.logger.trace('ignoreNextHashChange', this.ignoreNextHashChange);
    this.logger.trace('initialHashChange', this.initialHashChange);
    this.logger.trace('from', this.window.location.hash, 'to', hash);

    if (this.initialHashChange) {
      this.initialHashChange = false;
      this.window.location.replace(hash);
      this.logger.trace('History hash modified', hash);
    } else if (this.ignoreNextHashChange) {
      this.window.location.hash = hash;
      this.logger.trace('History hash created', hash);
    }
  }

  public debugInfo() {
    return {
      state: this.model.getAttributes()
    };
  }

  private handleNuke() {
    this.window.removeEventListener('hashchange', this.hashchange);
  }

  private handleHashChange() {
    this.logger.trace('History hash changed');

    if (this.ignoreNextHashChange) {
      this.logger.trace('History hash change ignored');
      this.ignoreNextHashChange = false;
      return;
    }

    const attributesThatGotApplied = this.updateModelFromHash();
    if (_.difference(attributesThatGotApplied, HistoryController.attributesThatDoNotTriggerQuery).length > 0) {
      if (this.lastState) {
        const differenceWithLastState = Utils.differenceBetweenObjects(this.model.getAttributes(), this.lastState);
        this.mapStateDifferenceToUsageAnalyticsCall(differenceWithLastState);
      }
      this.queryController.executeQuery();
    }
  }

  private updateHashFromModel() {
    this.logger.trace('Model -> history hash');

    if (!this.willUpdateHash) {
      Defer.defer(() => {
        const attributes = this.model.getAttributes();
        this.setHashValues(attributes);
        this.logger.debug('Saving state to hash', attributes);
        this.willUpdateHash = false;
      });
      this.willUpdateHash = true;
    }
  }

  private updateModelFromHash() {
    this.logger.trace('History hash -> model');

    const toSet: { [key: string]: any } = {};
    const diff: string[] = [];
    _.each(<_.Dictionary<any>>this.model.attributes, (value, key?, obj?) => {
      const valToSet = this.getHashValue(key);
      toSet[key] = valToSet;
      if (this.model.get(key) != valToSet) {
        diff.push(key);
      }
    });
    this.initialHashChange = true;
    this.model.setMultiple(toSet);
    return diff;
  }

  private getHashValue(key: string): any {
    Assert.isNonEmptyString(key);
    let value;
    try {
      value = this.hashUtils.getValue(key, this.hashUtils.getHash(this.window));
    } catch (error) {
      this.logger.error(`Could not parse parameter ${key} from URI`);
    }

    if (Utils.isUndefined(value)) {
      value = this.model.defaultAttributes[key];
    }

    return value;
  }

  private mapStateDifferenceToUsageAnalyticsCall(stateDifference: IStringMap<any>) {
    // In this method, we want to only match a single analytics event for the current state change.
    // Even though it's technically possible that many property changed at the same time since the last state,
    // the backend UA service does not support multiple search cause for a single search event.
    // So we find the first event that match (if any), by order of importance (query expression > sort > facet)
    if (QUERY_STATE_ATTRIBUTES.Q in stateDifference) {
      logSearchBoxSubmitEvent(this.usageAnalytics);
      return;
    } else if (QUERY_STATE_ATTRIBUTES.SORT in stateDifference) {
      logSortEvent(this.usageAnalytics, stateDifference[QUERY_STATE_ATTRIBUTES.SORT]);
      return;
    } else {
      // Facet id are not known at compilation time, so we iterate on all keys,
      // and try to determine if at least one is linked to a facet selection or exclusion.
      _.keys(stateDifference).forEach(key => {
        const facetInfo = this.extractFacetInfoFromStateDifference(key);
        if (facetInfo) {
          this.usageAnalytics.logSearchEvent<IAnalyticsFacetMeta>(facetInfo.actionCause, {
            facetId: facetInfo.fieldName,
            facetTitle: facetInfo.fieldName,
            facetValue: facetInfo.valueModified
          });
        }
      });
    }
  }

  private extractFacetInfoFromStateDifference(key: string) {
    const regexForFacetInclusion = /f:(?!.*:not)(.*)/;
    const matchForInclusion = regexForFacetInclusion.exec(key);

    const regexForFacetExclusion = /f:(.*):not/;
    const matchForExclusion = regexForFacetExclusion.exec(key);

    const currentValue = this.model.get(key) || [];
    const lastValue = this.lastState[key] || [];

    const valueRemoved = currentValue.length < lastValue.length;
    let valueModified;
    if (valueRemoved) {
      valueModified = _.first(_.difference(lastValue, currentValue));
    } else {
      valueModified = _.first(_.difference(currentValue, lastValue));
    }

    if (matchForInclusion) {
      const fieldName = matchForInclusion[1];
      let actionCause: IAnalyticsActionCause;
      if (valueRemoved) {
        actionCause = analyticsActionCauseList.facetDeselect;
      } else {
        actionCause = analyticsActionCauseList.facetSelect;
      }

      return {
        fieldName,
        actionCause,
        valueModified
      };
    }

    if (matchForExclusion) {
      const fieldName = matchForExclusion[1];
      let actionCause: IAnalyticsActionCause;
      if (valueRemoved) {
        actionCause = analyticsActionCauseList.facetUnexclude;
      } else {
        actionCause = analyticsActionCauseList.facetExclude;
      }

      return {
        fieldName,
        actionCause,
        valueModified
      };
    }

    return null;
  }
}
