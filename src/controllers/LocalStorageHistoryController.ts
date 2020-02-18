import { LocalStorageUtils } from '../utils/LocalStorageUtils';
import { Model } from '../models/Model';
import { QueryController } from './QueryController';
import { Logger } from '../misc/Logger';
import { Assert } from '../misc/Assert';
import { InitializationEvents } from '../events/InitializationEvents';
import { RootComponent } from '../ui/Base/RootComponent';
import { $$ } from '../utils/Dom';
import { each, omit } from 'underscore';
import { IHistoryManager } from './HistoryManager';
import { HashUtils } from '../utils/HashUtils';

/**
 * This component acts like the {@link HistoryController} excepts that is saves the {@link QueryStateModel} in the local storage.<br/>
 * This will not allow 'back' and 'forward' navigation in the history, like the standard {@link HistoryController} allows. Instead, it load the query state only on page load.<br/>
 * To enable this component, you should set the {@link SearchInterface.options.useLocalStorageForHistory} as well as the {@link SearchInterface.options.enableHistory} options to true.
 */
export class LocalStorageHistoryController extends RootComponent implements IHistoryManager {
  static ID = 'LocalStorageHistoryController';

  public storage: LocalStorageUtils<{ [key: string]: any }>;
  private omit: string[] = [];

  /**
   * Create a new LocalStorageHistoryController instance
   * @param element
   * @param windoh For mock purpose
   * @param model
   * @param queryController
   */
  constructor(element: HTMLElement, public windoh: Window, public model: Model, public queryController: QueryController) {
    super(element, LocalStorageHistoryController.ID);
    if (!windoh['localStorage']) {
      new Logger(element).info(
        'No local storage available in current browser. LocalStorageHistoryController cannot initialize itself',
        this
      );
    } else {
      this.storage = new LocalStorageUtils<{ [key: string]: any }>(LocalStorageHistoryController.ID);
      Assert.exists(this.model);
      Assert.exists(this.queryController);
      $$(this.element).on(InitializationEvents.restoreHistoryState, () => this.initModelFromLocalStorageAndUrlHash());
      $$(this.element).on(this.model.getEventName(Model.eventTypes.all), () => this.updateLocalStorageFromModel());
    }
  }

  public replaceState(state: Record<string, any>) {
    this.storage.save(state);
  }

  /**
   * Specifies an array of attributes from the query state model that should not be persisted in the local storage
   * @param attributes
   */
  public withoutThoseAttribute(attributes: string[]) {
    this.omit = attributes;
  }

  public setState(values: Record<string, any>) {
    this.storage.save(values);
  }

  private updateLocalStorageFromModel() {
    const attributes = omit(this.model.getAttributes(), this.omit);
    this.setState(attributes);
    this.logger.debug('Saving state to localstorage', attributes);
  }

  private initModelFromLocalStorageAndUrlHash() {
    const model = {
      ...this.localStorageModel,
      ...this.urlHashModel
    };

    this.model.setMultiple(model);
  }

  private get localStorageModel() {
    const model: Record<string, any> = {};
    const storedValues = this.storage.load() || {};

    each(this.model.attributes, (value, key) => {
      const storedValue = storedValues[key];
      const defaultValue = this.model.defaultAttributes[key];
      const valueToSet = storedValue == undefined ? defaultValue : storedValue;

      model[key] = valueToSet;
    });

    return model;
  }

  private get urlHashModel(): Record<string, any> {
    const model: Record<string, any> = {};
    const hash = HashUtils.getHash(this.windoh);

    each(this.model.attributes, (value, key) => {
      const valueInUrl = HashUtils.getValue(key, hash);

      if (valueInUrl) {
        model[key] = valueInUrl;
      }
    });

    return model;
  }
}
