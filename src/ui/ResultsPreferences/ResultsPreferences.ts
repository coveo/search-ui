import {Component} from '../Base/Component';
import {ComponentOptions} from '../Base/ComponentOptions';
import {ComponentOptionsModel} from '../../models/ComponentOptionsModel';
import {IComponentBindings} from '../Base/ComponentBindings';
import {LocalStorageUtils} from '../../utils/LocalStorageUtils';
import {PreferencesPanel} from '../PreferencesPanel/PreferencesPanel';
import {PreferencesPanelCheckboxInput} from '../PreferencesPanel/PreferencesPanelItem';
import {PreferencesPanelEvents} from '../../events/PreferencesPanelEvents';
import {analyticsActionCauseList, IAnalyticsPreferencesChangeMeta} from '../Analytics/AnalyticsActionListMeta';
import {Initialization} from '../Base/Initialization';
import {IResultLinkOptions} from '../ResultLink/ResultLinkOptions';
import {Assert} from '../../misc/Assert';
import {l} from '../../strings/Strings';
import {$$} from '../../utils/Dom';

export interface IResultsPreferencesOptions {
  enableOpenInOutlook?: boolean;
  enableOpenInNewWindow?: boolean;
}

/**
 * This component allows users to select preferences related to their search results.<br/>
 * These preferences are saved in the localStorage of each user.<br/>
 * This component is normally accessible visually using the {@link Settings} menu.<br/>
 * It is usually located, in the DOM, inside the {@link PreferencesPanel} component.
 */
export class ResultsPreferences extends Component {
  static ID = 'ResultsPreferences';

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IResultsPreferencesOptions = {
    /**
     * Enable or disable the options to open results in outlook.<br/>
     * Default value is <code>true</code>
     */
    enableOpenInOutlook: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * Enable or disable the options to open results in a new window.<br/>
     * Default value is <code>true</code>
     */
    enableOpenInNewWindow: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  public preferences: IResultLinkOptions;
  private preferencePanelLocalStorage: LocalStorageUtils<IResultLinkOptions>;
  private preferencesPanel: HTMLElement;
  private preferencePanelCheckboxInput: PreferencesPanelCheckboxInput;

  /**
   * Create a new ResultsPreference component
   * @param element
   * @param options
   * @param bindings
   */
  constructor(public element: HTMLElement, public options: IResultsPreferencesOptions, public bindings: IComponentBindings) {
    super(element, ResultsPreferences.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, ResultsPreferences, options);

    this.preferencesPanel = $$(this.element).closest(Component.computeCssClassName(PreferencesPanel));
    this.preferencePanelLocalStorage = new LocalStorageUtils(ResultsPreferences.ID);
    Assert.exists(this.componentOptionsModel);
    Assert.exists(window.localStorage);
    Assert.exists(this.preferencesPanel);

    this.preferences = this.preferencePanelLocalStorage.load() || {};
    ComponentOptions.initComponentOptions(this.element, ResultsPreferences, this.preferences);

    this.updateComponentOptionsModel();

    this.bind.on(this.preferencesPanel, PreferencesPanelEvents.savePreferences, () => this.save())
    this.bind.on(this.preferencesPanel, PreferencesPanelEvents.exitPreferencesWithoutSave, () => this.exitWithoutSave())

    this.buildTitle();
    this.buildCheckboxesInput();
  }

  /**
   * Save the current state of the preferences to local storage
   */
  public save() {
    this.fromCheckboxInputToPreferences();
    this.logger.info('Saving preferences', this.preferences);
    this.preferencePanelLocalStorage.save(this.preferences);
    this.updateComponentOptionsModel();
  }

  public exitWithoutSave() {
    this.fromPreferencesToCheckboxInput();
  }

  private updateComponentOptionsModel() {
    this.componentOptionsModel.set(ComponentOptionsModel.attributesEnum.resultLink, this.preferences);
  }

  private buildTitle() {
    var title = $$('div', {
      className: 'coveo-title'
    }, l('LinkOpeningSettings'));

    this.element.appendChild(title.el);
  }

  private buildCheckboxesInput() {
    var inputs = [];
    if (this.options.enableOpenInOutlook) {
      inputs.push({ label: l('OpenInOutlookWhenPossible') });
    }
    if (this.options.enableOpenInNewWindow) {
      inputs.push({ label: l('AlwaysOpenInNewWindow') });
    }
    this.preferencePanelCheckboxInput = new PreferencesPanelCheckboxInput(inputs, ResultsPreferences.ID);
    var container = $$('div', {
      className: 'coveo-choices-container'
    });

    container.el.appendChild(this.preferencePanelCheckboxInput.build());
    var executeOnChange = container.findAll('input');
    _.each(executeOnChange, (toExec) => {
      $$(toExec).on('change', (e: Event) => {
        this.fromPreferenceChangeEventToUsageAnalyticsLog(e);
        this.save();
        this.queryController.executeQuery();
      })
    })

    this.element.appendChild(container.el);
    this.fromPreferencesToCheckboxInput();
  }

  private fromCheckboxInputToPreferences() {
    var selected = this.preferencePanelCheckboxInput.getSelecteds();
    this.preferences = {
      openInOutlook: false,
      alwaysOpenInNewWindow: false
    };
    if (_.contains(selected, l('OpenInOutlookWhenPossible'))) {
      this.preferences.openInOutlook = true
    }
    if (_.contains(selected, l('AlwaysOpenInNewWindow'))) {
      this.preferences.alwaysOpenInNewWindow = true;
    }
  }

  private fromPreferencesToCheckboxInput() {
    if (this.preferences.openInOutlook) {
      this.preferencePanelCheckboxInput.select(l('OpenInOutlookWhenPossible'));
    }
    if (this.preferences.alwaysOpenInNewWindow) {
      this.preferencePanelCheckboxInput.select(l('AlwaysOpenInNewWindow'));
    }
  }

  private fromPreferenceChangeEventToUsageAnalyticsLog(e: Event) {
    var type = (<HTMLInputElement>e.target).checked ? 'selected' : 'unselected';
    var preference = (<HTMLInputElement>e.srcElement).value;
    this.usageAnalytics.logCustomEvent<IAnalyticsPreferencesChangeMeta>(analyticsActionCauseList.preferencesChange, { preferenceName: preference, preferenceType: type }, this.element);
    this.usageAnalytics.logSearchEvent<IAnalyticsPreferencesChangeMeta>(analyticsActionCauseList.preferencesChange, { preferenceName: preference, preferenceType: type });
  }
}

Initialization.registerAutoCreateComponent(ResultsPreferences);
