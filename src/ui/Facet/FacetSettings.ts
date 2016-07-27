/// <reference path="Facet.ts" />
/// <reference path="FacetSort.ts" />
/// <reference path="FacetHeader.ts" />
import {Facet} from './Facet';
import {FacetSort} from './FacetSort';
import {$$} from '../../utils/Dom';
import {LocalStorageUtils} from '../../utils/LocalStorageUtils';
import {IFacetSortDescription} from './FacetSort';
import {Utils} from '../../utils/Utils';
import {l} from '../../strings/Strings';
import {QueryStateModel} from '../../models/QueryStateModel';
import {FacetHeader} from './FacetHeader';
import {IAnalyticsFacetMeta, analyticsActionCauseList} from '../Analytics/AnalyticsActionListMeta';
import {DeviceUtils} from '../../utils/DeviceUtils';
import {PopupUtils, HorizontalAlignment, VerticalAlignment } from '../../utils/PopupUtils';

export interface IFacetSettingsKlass {
  new (sorts: string[], facet: Facet): FacetSettings;
}

export interface IFacetState {
  included: string[]
  excluded: string[];
  operator: string;
}

/**
 * Handle the rendering of the {@link Facet} settings menu (typically the ... in the facet header)
 */
export class FacetSettings extends FacetSort {
  public loadedFromSettings: { [attribute: string]: any };

  private facetStateLocalStorage: LocalStorageUtils<IFacetState>;
  private includedStateAttribute: string;
  private excludedStateAttribute: string;
  private operatorStateAttribute: string;

  private settingsPopup: HTMLElement;
  private settingsIcon: HTMLElement;
  private settingsButton: HTMLElement;
  private directionSection: HTMLElement[];
  private saveStateSection: HTMLElement;
  private clearStateSection: HTMLElement;
  private hideSection: HTMLElement;
  private showSection: HTMLElement;
  private sortSection: { element: HTMLElement; sortItems: HTMLElement[] };
  private customSortDirectionChange = false;

  private enabledSortsIgnoreRenderBecauseOfPairs: IFacetSortDescription[] = [];

  constructor(public sorts: string[], public facet: Facet) {
    super(sorts, facet);
    this.filterDuplicateForRendering();
  }

  /**
   * Build the menu, hook click events
   * @returns {HTMLElement}
   */
  public build() {
    this.settingsButton = document.createElement('div');
    this.settingsButton.setAttribute('title', l('Settings'));
    $$(this.settingsButton).addClass('coveo-facet-header-settings');

    this.settingsIcon = document.createElement('span');
    $$(this.settingsIcon).addClass('coveo-icon');

    this.settingsButton.appendChild(this.settingsIcon);

    this.settingsPopup = document.createElement('div');
    $$(this.settingsPopup).addClass('coveo-facet-settings-popup');
    if (Utils.isNonEmptyArray(this.enabledSorts)) {
      this.sortSection = this.buildSortSection();

      if (this.enabledSortsAllowDirection()) {
        this.directionSection = this.buildDirectionSection();
      }
    }
    if (this.facet.options.enableSettingsFacetState) {
      this.saveStateSection = this.buildSaveStateSection();
      this.clearStateSection = this.buildClearStateSection();
    }
    this.hideSection = this.buildHideSection();
    this.showSection = this.buildShowSection();

    var appendCommon = () => {
      this.appendIfNotUndefined(this.saveStateSection);
      this.appendIfNotUndefined(this.clearStateSection);
      this.appendIfNotUndefined(this.hideSection);
      this.appendIfNotUndefined(this.showSection)
    }

    this.handleMouseEventOnButton(this.sortSection);
    if (Utils.isNonEmptyArray(this.enabledSorts)) {
      this.settingsPopup.appendChild(this.sortSection.element);
      _.each(this.directionSection, (d) => {
        this.appendIfNotUndefined(d);
      })
      appendCommon();
    } else {
      appendCommon();
    }
    return this.settingsButton;
  }

  /**
   * Restore the facet state from local storage, and apply it in the query state model
   */
  public loadSavedState() {
    if (this.facetStateLocalStorage) {
      // set the state from the settings only if there is nothing
      // in the query state model for the current facet
      var state = this.facetStateLocalStorage.load();
      var currentStateIncluded = this.facet.queryStateModel.get(this.includedStateAttribute);
      var currentStateExcluded = this.facet.queryStateModel.get(this.excludedStateAttribute);
      var currentStateOperator = this.facet.queryStateModel.get(this.operatorStateAttribute);
      if (!Utils.isNullOrUndefined(state)
        && Utils.isEmptyArray(currentStateIncluded)
        && Utils.isEmptyArray(currentStateExcluded)
        && !Utils.isNonEmptyString(currentStateOperator)) {
        var toSet: { [key: string]: any } = {};
        toSet[this.includedStateAttribute] = state.included;
        toSet[this.excludedStateAttribute] = state.excluded;
        toSet[this.operatorStateAttribute] = state.operator;
        this.facet.queryStateModel.setMultiple(toSet);
        this.loadedFromSettings = toSet;
      }
    } else {
      this.facet.logger.info('Facet state local storage not enabled : See Facet.options.enableSettingsFacetState');
    }
  }

  /**
   * Take the current state of the facet and save it in the local storage
   */
  public saveState() {
    if (this.facetStateLocalStorage) {
      this.facetStateLocalStorage.save({
        included: this.facet.queryStateModel.get(this.includedStateAttribute),
        excluded: this.facet.queryStateModel.get(this.excludedStateAttribute),
        operator: this.facet.queryStateModel.get(this.operatorStateAttribute),
      })
    } else {
      this.facet.logger.info('Facet state local storage not enabled : See Facet.options.enableSettingsFacetState');
    }

  }

  /**
   * Close the settings menu
   */
  public close() {
    $$(this.settingsPopup).detach();
  }

  /**
   * Open the settings menu
   */
  public open() {
    PopupUtils.positionPopup(
      this.settingsPopup,
      this.settingsButton,
      this.facet.root,
      this.getPopupAlignment(), this.facet.root);

    $$(this.hideSection).toggle(!$$(this.facet.element).hasClass('coveo-facet-collapsed'));
    $$(this.showSection).toggle($$(this.facet.element).hasClass('coveo-facet-collapsed'));

    if (this.facet.options.enableSettingsFacetState) {
      $$(this.clearStateSection).toggle(!Utils.isNullOrUndefined(this.facetStateLocalStorage.load()))
    }
    _.each(this.enabledSorts, (criteria: IFacetSortDescription, i) => {
      if (!Utils.isNullOrUndefined(this.sortSection.sortItems[i])) {
        if (this.activeSort.name == criteria.name.toLowerCase() || this.activeSort.relatedSort == criteria.name.toLowerCase()) {
          this.selectItem(this.sortSection.sortItems[i]);
        } else {
          this.unselectItem(this.sortSection.sortItems[i]);
        }
      }
    });
  }

  private buildSortSection() {
    var sortSection = this.buildSection('coveo-facet-settings-section-sort');
    var sortSectionIcon = this.buildIcon();
    var sortSectionItems = this.buildItems();
    if (this.facet.searchInterface.isNewDesign()) {
      var sortTitle = document.createElement('div');
      $$(sortTitle).addClass('coveo-facet-settings-section-sort-title');
      $$(sortTitle).text(l('SortBy') + ' :');
      sortSectionItems.appendChild(sortTitle);
    }
    var sortItems = this.buildSortSectionItems();
    _.each(sortItems, (s) => {
      sortSectionItems.appendChild(s);
    })
    sortSection.appendChild(sortSectionIcon);
    sortSection.appendChild(sortSectionItems);
    return { element: sortSection, sortItems: sortItems };
  }

  private buildSortSectionItems() {
    var elems = _.map(this.enabledSorts, (enabledSort) => {
      if (_.contains(this.enabledSortsIgnoreRenderBecauseOfPairs, enabledSort)) {
        return undefined;
      } else {
        var elem = this.buildItem(l(enabledSort.label), enabledSort.description);
        $$(elem).on('click', (e: Event) => this.handleClickSortButton(e, enabledSort));
        return elem;
      }
    })
    elems = _.compact(elems);
    return elems;
  }

  private closePopupAndUpdateSort() {
    this.close();
    if (this.activeSort.name != 'custom') {
      this.facet.updateSort(this.activeSort.name);
    } else {
      this.facet.updateSort('nosort');
      if (this.customSortDirectionChange) {
        this.customSortDirectionChange = false;
        this.facet.queryController.executeQuery();
      }
    }
  }

  private enabledSortsAllowDirection() {
    return _.some(this.enabledSorts, (facetSortDescription: IFacetSortDescription) => {
      return facetSortDescription.directionToggle;
    })
  }


  private buildDirectionSection() {
    if (this.facet.searchInterface.isNewDesign()) {
      var directionAscendingSection = this.buildAscendingOrDescendingSection('Ascending');
      var iconAscending = this.buildIcon();
      var iconDescending = this.buildIcon();
      var directionItemsAscending = this.buildItems();
      var ascending = this.buildAscendingOrDescending('Ascending');

      directionItemsAscending.appendChild(ascending)
      directionAscendingSection.appendChild(iconAscending);
      directionAscendingSection.appendChild(directionItemsAscending);
      $$(directionAscendingSection).on('click', (e: Event) => this.handleDirectionClick(e, 'ascending'));

      var directionDescendingSection = this.buildAscendingOrDescendingSection('Descending');
      var directionItemsDescending = this.buildItems();
      var descending = this.buildAscendingOrDescending('Descending');

      directionItemsDescending.appendChild(descending);
      directionDescendingSection.appendChild(iconDescending)
      directionDescendingSection.appendChild(directionItemsDescending);
      $$(directionDescendingSection).on('click', (e: Event) => this.handleDirectionClick(e, 'descending'));

      if (!this.activeSort.directionToggle) {
        $$(directionAscendingSection).addClass('coveo-facet-settings-disabled');
        $$(directionDescendingSection).addClass('coveo-facet-settings-disabled');
      } else {
        this.selectItem(this.getItems(directionAscendingSection)[0]);
      }
      return [directionAscendingSection, directionDescendingSection];

    } else {
      var directionSection = this.buildSection('coveo-facet-settings-section-direction');
      var icon = this.buildIcon();

      var directionItems = this.buildItems();
      var ascending = this.buildAscendingOrDescending('Ascending');
      $$(ascending).on('click', (e: Event) => this.handleDirectionClick(e, 'ascending'));

      var descending = this.buildAscendingOrDescending('Descending');
      $$(descending).on('click', (e: Event) => this.handleDirectionClick(e, 'descending'));

      directionItems.appendChild(ascending);
      directionItems.appendChild(descending);
      directionSection.appendChild(icon);
      directionSection.appendChild(directionItems);

      if (!this.activeSort.directionToggle) {
        $$(directionSection).addClass('coveo-facet-settings-disabled');
      } else {
        this.selectItem(this.getCurrentDirectionItem([directionSection]));
      }
      return [directionSection];
    }
  }

  private buildSaveStateSection() {
    var saveStateSection = this.buildSection('coveo-facet-settings-section-save-state');
    var icon = this.buildIcon();
    var saveStateItems = this.buildItems();

    this.facetStateLocalStorage = new LocalStorageUtils<IFacetState>('facet-state-' + this.facet.options.id);
    this.includedStateAttribute = QueryStateModel.getFacetId(this.facet.options.id);
    this.excludedStateAttribute = QueryStateModel.getFacetId(this.facet.options.id, false);
    this.operatorStateAttribute = QueryStateModel.getFacetOperator(this.facet.options.id);

    var saveStateItem = document.createElement('div');
    $$(saveStateItem).addClass('coveo-facet-settings-item');
    saveStateItem.setAttribute('title', _.escape(l('SaveFacetState')));
    $$(saveStateItem).text(_.escape(l('SaveFacetState')));
    saveStateItems.appendChild(saveStateItem);

    saveStateSection.appendChild(icon);
    saveStateSection.appendChild(saveStateItems);
    $$(saveStateSection).on('click', (e: Event) => this.handleSaveStateClick());
    return saveStateSection;
  }

  private buildClearStateSection() {
    var clearStateSection = this.buildSection('coveo-facet-settings-section-clear-state')
    var icon = this.buildIcon();
    var clearStateItems = this.buildItems();
    var clearStateItem = this.buildItem(l('ClearFacetState'));
    clearStateItems.appendChild(clearStateItem);
    clearStateSection.appendChild(icon);
    clearStateSection.appendChild(clearStateItems);
    $$(clearStateSection).on('click', (e: Event) => this.handleClearStateClick());
    return clearStateSection;
  }

  private buildHideSection() {
    var hideSection = this.buildSection('coveo-facet-settings-section-hide');
    var icon = this.buildIcon();
    var hideItems = this.buildItems();
    var hideItem = this.buildItem(l('Collapse'));
    hideItems.appendChild(hideItem);

    hideSection.appendChild(icon);
    hideSection.appendChild(hideItems);
    $$(hideSection).on('click', (e: Event) => {
      this.facet.facetHeader.collapseFacet();
      this.close();
    })
    return hideSection;
  }

  private buildShowSection() {
    var showSection = this.buildSection('coveo-facet-settings-section-show');
    var icon = this.buildIcon();
    var showItems = this.buildItems();
    var showItem = this.buildItem(l('Expand'));
    showItems.appendChild(showItem);

    showSection.appendChild(icon);
    showSection.appendChild(showItems);
    $$(showSection).on('click', (e: Event) => {
      this.facet.facetHeader.expandFacet();
      this.close();
    })
    return showSection;
  }

  private buildIcon() {
    if (this.facet.searchInterface.isNewDesign()) {
      var icon = document.createElement('div');
      $$(icon).addClass('coveo-icon-container');
      var insideIcon = document.createElement('div');
      $$(insideIcon).addClass('coveo-icon');
      icon.appendChild(insideIcon);
      return icon;
    } else {
      var icon = document.createElement('div');
      $$(icon).addClass('coveo-icon');
      return icon;
    }
  }

  private buildAscendingOrDescending(direction: string) {
    var elem = this.buildItem(l(direction));
    elem.setAttribute('data-direction', direction.toLowerCase());
    return elem;
  }

  private buildAscendingOrDescendingSection(direction: string) {
    return this.buildSection('coveo-facet-settings-section-direction-' + direction.toLowerCase());
  }

  private buildItem(label: string, title = label) {
    var elem = document.createElement('div');
    $$(elem).addClass('coveo-facet-settings-item')
    elem.setAttribute('title', _.escape(title));
    $$(elem).text(_.escape(label));
    return elem;
  }

  private buildItems() {
    var elem = document.createElement('div');
    $$(elem).addClass('coveo-facet-settings-items');
    return elem;
  }

  private buildSection(className: string) {
    var section = document.createElement('div');
    $$(section).addClass(['coveo-facet-settings-section', className]);
    return section;
  }

  private handleClickSettingsButtons(event: Event, sortSection?: { element: HTMLElement; sortItems: HTMLElement[] }) {
    if (!Utils.isNullOrUndefined(this.settingsPopup.parentElement)) {
      this.close();
    } else {
      this.open();
    }
  }

  private handleClickSortButton(e: Event, enabledSort: IFacetSortDescription) {
    if (this.activeSort != enabledSort && this.activeSort.relatedSort != enabledSort.name) {
      this.activeSort = enabledSort;
      if (enabledSort.directionToggle && _.contains(this.enabledSorts, FacetSettings.availableSorts[this.activeSort.relatedSort])) {
        this.activateDirectionSection();
      } else {
        this.disableDirectionSection();
      }
      this.selectItem(<HTMLElement>e.target);
      this.closePopupAndUpdateSort();
    }
  }

  private handleDirectionClick(e: Event, direction: string) {
    if (!$$((<HTMLElement>e.target).parentElement.parentElement).hasClass('coveo-facet-settings-disabled') && this.activeSort.name.indexOf(direction) == -1) {
      this.activeSort = FacetSettings.availableSorts[this.activeSort.relatedSort];
      _.each(this.directionSection, (d) => {
        this.unselectSection(d);
      })
      this.selectItem(<HTMLElement>e.target);
      if (this.activeSort.name == 'custom' && this.customSortDirection != direction) {
        this.customSortDirection = direction;
        this.customSortDirectionChange = true;
      }
      this.closePopupAndUpdateSort();
    }
  }

  private handleSaveStateClick() {
    this.saveState();
    this.close();
  }

  private handleClearStateClick() {
    this.facetStateLocalStorage.remove();
    this.facet.reset();
    this.close();
    this.facet.triggerNewQuery(() => this.facet.usageAnalytics.logSearchEvent<IAnalyticsFacetMeta>(analyticsActionCauseList.facetClearAll, {
      facetId: this.facet.options.id,
      facetTitle: this.facet.options.title
    }));
  }

  private handleMouseEventOnButton(sortSection: { element: HTMLElement; sortItems: HTMLElement[] }) {
    var closeTimeout: number;
    $$(this.settingsButton).on('click', (e: Event) => this.handleClickSettingsButtons(e, sortSection));

    var mouseLeave = () => {
      closeTimeout = setTimeout(() => {
        this.close();
      }, 300)
    }
    var mouseEnter = () => {
      clearTimeout(closeTimeout);
    }

    $$(this.settingsIcon).on('mouseleave', mouseLeave);
    $$(this.settingsPopup).on('mouseleave', mouseLeave);
    $$(this.settingsIcon).on('mouseenter', mouseEnter);
    $$(this.settingsPopup).on('mouseenter', mouseEnter);
  }

  public getCurrentDirectionItem(directionSection = this.directionSection) {
    var found: HTMLElement;
    _.each(directionSection, (direction) => {
      if (!found) {
        found = _.find(this.getItems(direction), (direction: HTMLElement) => {
          return this.activeSort.name.indexOf(direction.getAttribute('data-direction')) != -1
        })
      }
    })
    if (!found) {
      found = directionSection[0];
    }
    return found;
  }

  private activateDirectionSection() {
    _.each(this.directionSection, (direction) => {
      $$(direction).removeClass('coveo-facet-settings-disabled');
      this.unselectSection(direction);
    })
    this.selectItem(this.getCurrentDirectionItem());
  }

  private disableDirectionSection() {
    _.each(this.directionSection, (direction) => {
      $$(direction).addClass('coveo-facet-settings-disabled');
      this.unselectSection(direction);
    })

  }

  private getItems(section: HTMLElement) {
    return $$(section).findAll('.coveo-facet-settings-item');
  }

  private unselectSection(section: HTMLElement) {
    _.each(this.getItems(section), (i) => {
      $$(i).removeClass('coveo-selected');
    })
  }

  private selectItem(item: HTMLElement) {
    $$(item).addClass('coveo-selected');
  }

  private unselectItem(item: HTMLElement) {
    $$(item).removeClass('coveo-selected');
  }

  private getPopupAlignment() {
    var alignmentHorizontal = DeviceUtils.isMobileDevice() ? HorizontalAlignment.CENTER : HorizontalAlignment.INNERLEFT;
    var alignmentVertical = VerticalAlignment.BOTTOM;
    return {
      horizontal: alignmentHorizontal,
      vertical: alignmentVertical
    }
  }

  private filterDuplicateForRendering() {
    _.each(this.enabledSorts, (enabledSort: IFacetSortDescription, i: number) => {
      if (enabledSort.relatedSort != null) {
        for (var j = i + 1; j < this.enabledSorts.length; j++) {
          if (this.enabledSorts[j].name == enabledSort.relatedSort) {
            this.enabledSortsIgnoreRenderBecauseOfPairs.push(this.enabledSorts[j]);
            break;
          }
        }
      }
    });
  }

  private appendIfNotUndefined(toAppend: HTMLElement) {
    if (!Utils.isNullOrUndefined(toAppend)) {
      this.settingsPopup.appendChild(toAppend);
    }
  }
}
