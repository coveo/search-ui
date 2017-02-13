import { Assert } from '../misc/Assert';
import { QueryController } from '../controllers/QueryController';
import { Model } from '../models/Model';
import { InitializationEvents } from '../events/InitializationEvents';
import { $$ } from '../utils/Dom';
import { HashUtils } from '../utils/HashUtils';
import { Defer } from '../misc/Defer';
import { RootComponent } from '../ui/Base/RootComponent';
import { Utils } from '../utils/Utils';
import _ = require('underscore');

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

  /**
   * Create a new history controller
   * @param element
   * @param windoh For mock / test purposes.
   * @param model
   * @param queryController
   * @param hashUtilsModule For mock / test purposes.
   */
  constructor(element: HTMLElement, public windoh: Window, public model: Model, public queryController: QueryController, private hashUtils: typeof HashUtils = HashUtils) {
    super(element, HistoryController.ID);

    this.windoh = this.windoh || window;
    Assert.exists(this.model);
    Assert.exists(this.queryController);

    $$(this.element).on(InitializationEvents.restoreHistoryState, () => {
      this.logger.trace('Restore history state. Update model');
      this.updateModelFromHash();
    });

    $$(this.element).on(this.model.getEventName(Model.eventTypes.all), () => {
      this.logger.trace('Query model changed. Update hash');
      this.updateHashFromModel();
    });
    this.hashchange = () => {
      this.handleHashChange();
    };
    this.windoh.addEventListener('hashchange', this.hashchange);
    $$(this.element).on(InitializationEvents.nuke, () => this.handleNuke());
  }

  /**
   * Set the given map of key value in the hash of the URL
   * @param values
   */
  public setHashValues(values: {}) {
    this.logger.trace('Update history hash');

    let hash = '#' + this.hashUtils.encodeValues(values);
    this.ignoreNextHashChange = this.windoh.location.hash != hash;

    this.logger.trace('ignoreNextHashChange', this.ignoreNextHashChange);
    this.logger.trace('initialHashChange', this.initialHashChange);
    this.logger.trace('from', this.windoh.location.hash, 'to', hash);

    if (this.initialHashChange) {
      this.initialHashChange = false;
      this.windoh.location.replace(hash);
      this.logger.trace('History hash modified', hash);
    } else if (this.ignoreNextHashChange) {
      this.windoh.location.hash = hash;
      this.logger.trace('History hash created', hash);
    }
  }

  private handleNuke() {
    this.windoh.removeEventListener('hashchange', this.hashchange);
  }

  private handleHashChange() {
    this.logger.trace('History hash changed');

    if (this.ignoreNextHashChange) {
      this.logger.trace('History hash change ignored');
      this.ignoreNextHashChange = false;
      return;
    }

    let diff = this.updateModelFromHash();

    if (_.difference(diff, HistoryController.attributesThatDoNotTriggerQuery).length > 0) {
      this.queryController.executeQuery();
    }
  }

  private updateHashFromModel() {
    this.logger.trace('Model -> history hash');

    if (!this.willUpdateHash) {
      Defer.defer(() => {
        let attributes = this.model.getAttributes();
        this.setHashValues(attributes);
        this.logger.debug('Saving state to hash', attributes);
        this.willUpdateHash = false;
      });
      this.willUpdateHash = true;
    }
  }

  private updateModelFromHash() {
    this.logger.trace('History hash -> model');

    let toSet: { [key: string]: any } = {};
    let diff: string[] = [];
    _.each(<_.Dictionary<any>>this.model.attributes, (value, key?, obj?) => {
      let valToSet = this.getHashValue(key);
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
      value = this.hashUtils.getValue(key, this.hashUtils.getHash(this.windoh));
    } catch (error) {
      this.logger.error(`Could not parse parameter ${key} from URI`);
    }

    if (Utils.isUndefined(value)) {
      value = this.model.defaultAttributes[key];
    }

    return value;
  }

  public debugInfo() {
    return {
      'state': this.model.getAttributes()
    };
  }
}
