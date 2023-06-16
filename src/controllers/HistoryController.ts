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
import { IHistoryManager } from './HistoryManager';

/**
 * This component is instantiated automatically by the framework on the root if the {@link SearchInterface}.<br/>
 * When the {@link SearchInterface.options.enableHistory} option is set to true, this component is instantiated.<br/>
 * It's only job is to apply changes in the {@link QueryStateModel} to the hash in the URL, and vice versa.<br/>
 * This component does *not* hold the state of the interface, it only represent it in the URL.
 */
export class HistoryController extends RootComponent implements IHistoryManager {
  static ID = 'HistoryController';

  static attributesThatDoNotTriggerQuery = ['quickview'];

  private willUpdateHash: boolean = false;
  private hashchange: (...args: any[]) => void;
  private lastState: IStringMap<any>;
  private hashUtilsModule: typeof HashUtils;

  /**
   * Create a new HistoryController
   * @param element
   * @param window
   * @param queryStateModel
   * @param queryController
   * @param usageAnalytics **Deprecated.** Since the [October 2019 Release (v2.7219)](https://docs.coveo.com/en/3084/), the class retrieves and uses the {@link AnalyticsClient} from the `queryController` constructor parameter.
   */
  constructor(
    element: HTMLElement,
    public window: Window,
    public queryStateModel: QueryStateModel,
    public queryController: QueryController,
    usageAnalytics?: IAnalyticsClient
  ) {
    super(element, HistoryController.ID);

    Assert.exists(this.queryStateModel);
    Assert.exists(this.queryController);

    $$(this.element).on(InitializationEvents.restoreHistoryState, () => {
      this.logger.trace('Restore history state. Update model');
      this.updateModelFromHash();
      this.lastState = this.queryStateModel.getAttributes();
    });

    $$(this.element).on(this.queryStateModel.getEventName(Model.eventTypes.all), () => {
      this.logger.trace('Query model changed. Update hash');
      this.updateHashFromModel();
    });

    this.hashchange = () => {
      this.handleHashChange();
      this.lastState = this.queryStateModel.getAttributes();
    };

    this.window.addEventListener('hashchange', this.hashchange);
    $$(this.element).on(InitializationEvents.nuke, () => this.handleNuke());
  }

  public get usageAnalytics() {
    return this.queryController.usageAnalytics;
  }

  public set hashUtils(hashUtils: typeof HashUtils) {
    this.hashUtilsModule = hashUtils;
  }

  public get hashUtils() {
    return this.hashUtilsModule ? this.hashUtilsModule : HashUtils;
  }

  public setState(state: Record<string, any>) {
    this.setHashValues(state);
  }

  public replaceState(state: Record<string, any>) {
    const hash = '#' + this.hashUtils.encodeValues(state);
    this.window.location.replace(hash);
  }

  private replaceUrl(url: string) {
    this.window.location.replace(url);
  }

  /**
   * Set the given map of key value in the hash of the URL
   * @param values
   */
  public setHashValues(values: Record<string, any>) {
    this.logger.trace('Update history hash');

    const encoded = this.hashUtils.encodeValues(values);
    const hash = encoded ? `#${encoded}` : '';
    const hashHasChanged = this.window.location.hash != hash;

    this.logger.trace('from', this.window.location.hash, 'to', hash);
    const location = this.window.location;
    const url = `${location.pathname}${location.search}${hash}`;

    if (this.queryController.firstQuery) {
      if (hashHasChanged) {
        // Using replace avoids adding an entry in the History of the browser.
        // This means that this new URL will become the new initial URL.
        this.replaceUrl(url);
        this.logger.trace('History hash modified', hash);
      }
    } else if (hashHasChanged) {
      this.window.history.pushState('', '', url);
      this.logger.trace('History hash created', hash);
    }
  }

  public debugInfo() {
    return {
      state: this.queryStateModel.getAttributes()
    };
  }

  public handleHashChange() {
    this.logger.trace('History hash changed');

    const attributesThatGotApplied = this.updateModelFromHash();
    if (_.difference(attributesThatGotApplied, HistoryController.attributesThatDoNotTriggerQuery).length > 0) {
      if (this.lastState) {
        const differenceWithLastState = Utils.differenceBetweenObjects(this.queryStateModel.getAttributes(), this.lastState);
        this.mapStateDifferenceToUsageAnalyticsCall(differenceWithLastState);
      }
      this.queryController.executeQuery();
    }
  }

  private handleNuke() {
    this.window.removeEventListener('hashchange', this.hashchange);
  }

  private updateHashFromModel() {
    this.logger.trace('Model -> history hash');

    if (!this.willUpdateHash) {
      Defer.defer(() => {
        const attributes = this.queryStateModel.getAttributes();
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
    _.each(<_.Dictionary<any>>this.queryStateModel.attributes, (value, key?, obj?) => {
      const valToSet = this.getHashValue(key);
      toSet[key] = valToSet;
      if (`${this.queryStateModel.get(key)}` !== `${valToSet}`) {
        diff.push(key);
      }
    });
    this.queryStateModel.setMultiple(toSet);
    return diff;
  }

  private getHashValue(key: string): any {
    Assert.isNonEmptyString(key);
    let value;
    try {
      const hash = this.hashUtils.getHash(this.window);
      value = this.hashUtils.getValue(key, hash);
    } catch (error) {
      this.logger.error(`Could not parse parameter ${key} from URI`);
    }

    if (Utils.isUndefined(value)) {
      value = this.queryStateModel.defaultAttributes[key];
    }

    return value;
  }

  private mapStateDifferenceToUsageAnalyticsCall(stateDifference: IStringMap<any>) {
    // In this method, we want to only match a single analytics event for the current state change.
    // Even though it's technically possible that many property changed at the same time since the last state,
    // the backend UA service does not support multiple search cause for a single search event.
    // So we find the first event that match (if any), by order of importance (query expression > sort > facet)

    if (!this.usageAnalytics) {
      this.logger.warn("The query state has been modified directly in the URL and we couldn't log the proper analytics call.");
      this.logger.warn('This is caused by a history controller that has been initialized without the usage analytics parameter.');
      return;
    }

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
            facetField: facetInfo.fieldName,
            facetTitle: facetInfo.fieldName,
            facetValue: facetInfo.valueModified
          });
        }
      });
    }
  }

  private extractFacetInfoFromStateDifference(key: string) {
    const regexForFacetInclusion = /^f:(?!.*:not)(.*)/;
    const matchForInclusion = regexForFacetInclusion.exec(key);

    const regexForFacetExclusion = /^f:(.*):not/;
    const matchForExclusion = regexForFacetExclusion.exec(key);

    const currentValue = this.queryStateModel.get(key) || [];
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
