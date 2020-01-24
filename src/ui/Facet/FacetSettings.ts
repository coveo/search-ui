import Popper from 'popper.js';
import 'styling/_FacetSettings';
import { compact, contains, each, escape, filter, find, findWhere, map, first } from 'underscore';
import { InitializationEvents } from '../../events/InitializationEvents';
import { QueryStateModel } from '../../models/QueryStateModel';
import { l } from '../../strings/Strings';
import { AccessibleButton } from '../../utils/AccessibleButton';
import { $$ } from '../../utils/Dom';
import { KEYBOARD, KeyboardUtils } from '../../utils/KeyboardUtils';
import { LocalStorageUtils } from '../../utils/LocalStorageUtils';
import { SVGDom } from '../../utils/SVGDom';
import { SVGIcons } from '../../utils/SVGIcons';
import { Utils } from '../../utils/Utils';
import { analyticsActionCauseList, IAnalyticsFacetMeta } from '../Analytics/AnalyticsActionListMeta';
import { Facet } from './Facet';
import { FacetSort, IFacetSortDescription } from './FacetSort';

export interface IFacetSettingsKlass {
  new (sorts: string[], facet: Facet): FacetSettings;
}

export interface IFacetState {
  included: string[];
  excluded: string[];
  operator: string;
}

/**
 * Handle the rendering of the {@link Facet} settings menu (typically the ... in the facet header).
 */
export class FacetSettings extends FacetSort {
  public loadedFromSettings: { [attribute: string]: any };
  public settingsButton: HTMLElement;
  public settingsPopup: HTMLElement;

  private facetStateLocalStorage: LocalStorageUtils<IFacetState>;
  private includedStateAttribute: string;
  private excludedStateAttribute: string;
  private operatorStateAttribute: string;
  private directionSection: HTMLElement[];
  private saveStateSection: HTMLElement;
  private clearStateSection: HTMLElement;
  private hideSection: HTMLElement;
  private showSection: HTMLElement;
  private sortSection: { element: HTMLElement; sortItems: HTMLElement[] };
  private customSortDirectionChange = false;
  private onDocumentClick = () => this.close();
  private closeTimeout: number;
  private enabledSortsIgnoreRenderBecauseOfPairs: IFacetSortDescription[] = [];

  private get isExpanded() {
    return this.settingsButton && this.settingsButton.getAttribute('aria-expanded') === `${true}`;
  }

  private set isExpanded(expanded: boolean) {
    this.settingsButton.setAttribute('aria-expanded', `${expanded}`);
  }

  constructor(public sorts: string[], public facet: Facet) {
    super(sorts, facet);
    this.filterDuplicateForRendering();
  }

  /**
   * Build the menu, hook click events.
   * @returns {HTMLElement}
   */
  public build() {
    this.buildSettingsButton();
    this.buildSettingsPopup();

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
    if (this.facet.options.enableCollapse) {
      this.hideSection = this.buildHideSection();
      this.showSection = this.buildShowSection();
    }

    const appendCommon = () => {
      this.appendIfNotUndefined(this.saveStateSection);
      this.appendIfNotUndefined(this.clearStateSection);
      this.appendIfNotUndefined(this.hideSection);
      this.appendIfNotUndefined(this.showSection);
    };

    this.addOnDocumentClickHandler();
    this.addOnNukeHandler();

    if (Utils.isNonEmptyArray(this.enabledSorts)) {
      this.settingsPopup.appendChild(this.sortSection.element);
      each(this.directionSection, d => {
        this.appendIfNotUndefined(d);
      });
      appendCommon();
    } else {
      appendCommon();
    }
    return this.settingsButton;
  }

  /**
   * Restore the facet state from local storage, and apply it in the query state model.
   */
  public loadSavedState() {
    if (this.facetStateLocalStorage) {
      // set the state from the settings only if there is nothing
      // in the query state model for the current facet
      const state = this.facetStateLocalStorage.load();
      const currentStateIncluded = this.facet.queryStateModel.get(this.includedStateAttribute);
      const currentStateExcluded = this.facet.queryStateModel.get(this.excludedStateAttribute);
      const currentStateOperator = this.facet.queryStateModel.get(this.operatorStateAttribute);
      if (
        !Utils.isNullOrUndefined(state) &&
        Utils.isEmptyArray(currentStateIncluded) &&
        Utils.isEmptyArray(currentStateExcluded) &&
        !Utils.isNonEmptyString(currentStateOperator)
      ) {
        const toSet: { [key: string]: any } = {};
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
   * Take the current state of the facet and save it in the local storage.
   */
  public saveState() {
    if (this.facetStateLocalStorage) {
      this.facetStateLocalStorage.save({
        included: this.facet.queryStateModel.get(this.includedStateAttribute),
        excluded: this.facet.queryStateModel.get(this.excludedStateAttribute),
        operator: this.facet.queryStateModel.get(this.operatorStateAttribute)
      });
    } else {
      this.facet.logger.info('Facet state local storage not enabled : See Facet.options.enableSettingsFacetState');
    }
  }

  /**
   * Close the settings menu
   */
  public close() {
    if (!this.isExpanded) {
      return;
    }
    this.isExpanded = false;
    $$(this.settingsPopup).detach();
  }

  /**
   * Open the settings menu
   */
  public open() {
    $$(this.settingsPopup).insertAfter(this.settingsButton);
    new Popper(this.settingsButton, this.settingsPopup);

    this.isExpanded = true;

    if (this.hideSection && this.showSection) {
      $$(this.hideSection).toggle(!$$(this.facet.element).hasClass('coveo-facet-collapsed'));
      $$(this.showSection).toggle($$(this.facet.element).hasClass('coveo-facet-collapsed'));
    }

    if (this.facet.options.enableSettingsFacetState) {
      $$(this.clearStateSection).toggle(!Utils.isNullOrUndefined(this.facetStateLocalStorage.load()));
    }

    each(this.enabledSorts, (criteria: IFacetSortDescription, i) => {
      if (this.activeSort.name == criteria.name.toLowerCase()) {
        this.selectItem(this.getSortItem(criteria.name));
      } else {
        this.unselectItem(this.getSortItem(criteria.name));
      }
    });

    if (this.sortSection) {
      first(this.sortSection.sortItems).focus();
    }
  }

  public getSortItem(sortName: string): HTMLElement {
    return find(this.sortSection.sortItems, sortItem => {
      return (
        $$(sortItem)
          .getAttribute('data-sort-name')
          .toLowerCase() == sortName.replace('ascending|descending', '').toLowerCase()
      );
    });
  }

  public get button() {
    return this.settingsButton;
  }

  private buildSettingsButton() {
    this.settingsButton = $$('div', { className: 'coveo-facet-header-settings', 'aria-haspopup': 'true' }).el;
    this.settingsButton.innerHTML = SVGIcons.icons.more;
    SVGDom.addClassToSVGInContainer(this.settingsButton, 'coveo-facet-settings-more-svg');

    this.hideElementOnMouseEnterLeave(this.settingsButton);

    this.isExpanded = false;

    new AccessibleButton()
      .withElement(this.settingsButton)
      .withLabel(l('Settings'))
      .withClickAction(e => this.handleSettingsButtonClick(e))
      .withEnterKeyboardAction(e => this.handleSettingsButtonClick(e))
      .build();
  }

  private hideElementOnMouseEnterLeave(el: HTMLElement) {
    const mouseLeave = () => (this.closeTimeout = window.setTimeout(() => this.close(), 300));
    const mouseEnter = () => clearTimeout(this.closeTimeout);

    $$(el).on('mouseleave', mouseLeave);
    $$(el).on('mouseenter', mouseEnter);
    $$(el).on('keyup', KeyboardUtils.keypressAction(KEYBOARD.ESCAPE, () => this.handleKeyboardClose()));
  }

  private handleKeyboardClose() {
    this.close();
    this.settingsButton.focus();
  }

  private buildSettingsPopup() {
    this.settingsPopup = $$('div', { className: 'coveo-facet-settings-popup' }).el;
    this.hideElementOnMouseEnterLeave(this.settingsPopup);
    $$(this.settingsPopup).on('focusout', (e: FocusEvent) => {
      if (e.relatedTarget && this.settingsPopup.contains(e.relatedTarget as Node)) {
        return;
      }
      this.close();
    });
  }

  private buildSortSection() {
    const sortSection = this.buildSection('coveo-facet-settings-section-sort');
    const sortSectionIcon = this.buildIcon('coveo-facet-settings-section-sort-svg', SVGIcons.icons.sort);
    const sortSectionItems = this.buildItems();

    const sortTitle = document.createElement('div');
    $$(sortTitle).addClass('coveo-facet-settings-section-sort-title');
    $$(sortTitle).text(l('SortBy') + ' :');
    sortSectionItems.appendChild(sortTitle);

    const sortItems = this.buildSortSectionItems();
    each(sortItems, s => {
      sortSectionItems.appendChild(s);
    });
    sortSection.appendChild(sortSectionIcon);
    sortSection.appendChild(sortSectionItems);
    return { element: sortSection, sortItems: sortItems };
  }

  private buildSortSectionItems() {
    let elems = map(this.enabledSorts, enabledSort => {
      if (contains(this.enabledSortsIgnoreRenderBecauseOfPairs, enabledSort)) {
        return undefined;
      } else {
        const elem = this.buildItem(l(enabledSort.label), enabledSort.description);
        $$(elem).setAttribute('data-sort-name', enabledSort.name.toLowerCase().replace('ascending|descending', ''));

        new AccessibleButton()
          .withElement(elem)
          .withSelectAction((e: Event) => this.handleClickSortButton(e, enabledSort))
          .withLabel(enabledSort.label)
          .build();

        return elem;
      }
    });
    elems = compact(elems);
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
    const allEnabledSortsWithPossibleDirectionToggle = filter(this.enabledSorts, (facetSortDescription: IFacetSortDescription) => {
      return facetSortDescription.directionToggle;
    });
    const allowToggle = filter(allEnabledSortsWithPossibleDirectionToggle, possibleDirectionToggle => {
      return findWhere(this.enabledSorts, { name: possibleDirectionToggle.relatedSort }) != undefined;
    });
    return allowToggle.length > 0;
  }

  private buildDirectionSection() {
    const directionAscendingSection = this.buildAscendingOrDescendingSection('Ascending');
    const iconAscending = this.buildIcon('coveo-facet-settings-section-direction-ascending-svg', SVGIcons.icons.ascending);
    const iconDescending = this.buildIcon('coveo-facet-settings-section-direction-descending-svg', SVGIcons.icons.descending);
    const directionItemsAscending = this.buildItems();
    const ascending = this.buildAscendingOrDescending('Ascending');

    directionItemsAscending.appendChild(ascending);
    directionAscendingSection.appendChild(iconAscending);
    directionAscendingSection.appendChild(directionItemsAscending);
    new AccessibleButton()
      .withElement(directionAscendingSection)
      .withLabel(l('Ascending'))
      .withSelectAction((e: Event) => this.handleDirectionClick(e, 'ascending'))
      .build();

    const directionDescendingSection = this.buildAscendingOrDescendingSection('Descending');
    const directionItemsDescending = this.buildItems();
    const descending = this.buildAscendingOrDescending('Descending');

    directionItemsDescending.appendChild(descending);
    directionDescendingSection.appendChild(iconDescending);
    directionDescendingSection.appendChild(directionItemsDescending);
    new AccessibleButton()
      .withElement(directionDescendingSection)
      .withLabel(l('Descending'))
      .withSelectAction((e: Event) => this.handleDirectionClick(e, 'descending'))
      .build();

    if (!this.activeSort.directionToggle) {
      $$(directionAscendingSection).addClass('coveo-facet-settings-disabled');
      $$(directionDescendingSection).addClass('coveo-facet-settings-disabled');
    } else {
      this.selectItem(this.getItems(directionAscendingSection)[0]);
    }
    return [directionAscendingSection, directionDescendingSection];
  }

  private buildSaveStateSection() {
    const saveStateSection = this.buildSection('coveo-facet-settings-section-save-state');
    const icon = this.buildIcon('coveo-facet-settings-section-save-state-svg', SVGIcons.icons.dropdownMore);
    const saveStateItems = this.buildItems();

    this.facetStateLocalStorage = new LocalStorageUtils<IFacetState>('facet-state-' + this.facet.options.id);
    this.includedStateAttribute = QueryStateModel.getFacetId(this.facet.options.id);
    this.excludedStateAttribute = QueryStateModel.getFacetId(this.facet.options.id, false);
    this.operatorStateAttribute = QueryStateModel.getFacetOperator(this.facet.options.id);

    const saveStateItem = document.createElement('div');
    $$(saveStateItem).addClass('coveo-facet-settings-item');
    saveStateItem.setAttribute('title', l('SaveFacetState'));
    $$(saveStateItem).text(l('SaveFacetState'));
    saveStateItems.appendChild(saveStateItem);

    saveStateSection.appendChild(icon);
    saveStateSection.appendChild(saveStateItems);
    new AccessibleButton()
      .withElement(saveStateSection)
      .withSelectAction(() => this.handleSaveStateClick())
      .withLabel(l('SaveFacetState'))
      .build();

    return saveStateSection;
  }

  private buildClearStateSection() {
    const clearStateSection = this.buildSection('coveo-facet-settings-section-clear-state');
    const icon = this.buildIcon('coveo-facet-settings-section-clear-state-svg', SVGIcons.icons.dropdownLess);
    const clearStateItems = this.buildItems();
    const clearStateItem = this.buildItem(l('ClearFacetState'));
    clearStateItems.appendChild(clearStateItem);
    clearStateSection.appendChild(icon);
    clearStateSection.appendChild(clearStateItems);
    new AccessibleButton()
      .withElement(clearStateSection)
      .withSelectAction(() => this.handleClearStateClick())
      .withLabel(l('ClearFacetState'))
      .build();

    return clearStateSection;
  }

  private buildHideSection() {
    const hideSection = this.buildSection('coveo-facet-settings-section-hide');
    const icon = this.buildIcon('coveo-facet-settings-section-hide-svg', SVGIcons.icons.facetCollapse);
    const hideItems = this.buildItems();
    const hideItem = this.buildItem(l('Collapse'));
    hideItems.appendChild(hideItem);

    hideSection.appendChild(icon);
    hideSection.appendChild(hideItems);
    new AccessibleButton()
      .withElement(hideSection)
      .withSelectAction(() => {
        this.facet.facetHeader.collapseFacet();
        this.close();
      })
      .withLabel(l('CollapseFacet', this.facet.options.title))
      .build();

    return hideSection;
  }

  private buildShowSection() {
    const showSection = this.buildSection('coveo-facet-settings-section-show');
    const icon = this.buildIcon('coveo-facet-settings-section-show-svg', SVGIcons.icons.facetExpand);
    const showItems = this.buildItems();
    const showItem = this.buildItem(l('Expand'));
    showItems.appendChild(showItem);

    showSection.appendChild(icon);
    showSection.appendChild(showItems);

    new AccessibleButton()
      .withElement(showSection)
      .withSelectAction(() => {
        this.facet.facetHeader.expandFacet();
        this.close();
      })
      .withLabel(l('ExpandFacet', this.facet.options.title))
      .build();

    return showSection;
  }

  private buildIcon(iconClass?: string, svgIcon?: string) {
    if (iconClass && svgIcon) {
      const icon = $$('div', { className: 'coveo-icon-container' }, svgIcon);
      SVGDom.addClassToSVGInContainer(icon.el, iconClass);
      return icon.el;
    } else {
      return $$('div', { className: 'coveo-icon' }).el;
    }
  }

  private buildAscendingOrDescending(direction: string) {
    const elem = this.buildItem(l(direction));
    elem.setAttribute('aria-disabled', 'true');
    elem.setAttribute('data-direction', direction.toLowerCase());
    return elem;
  }

  private buildAscendingOrDescendingSection(direction: string) {
    return this.buildSection('coveo-facet-settings-section-direction-' + direction.toLowerCase());
  }

  private buildItem(label: string, title = label) {
    return $$(
      'div',
      {
        className: 'coveo-facet-settings-item',
        title: title
      },
      escape(label)
    ).el;
  }

  private buildItems() {
    const elem = document.createElement('div');
    $$(elem).addClass('coveo-facet-settings-items');
    return elem;
  }

  private buildSection(className: string) {
    const section = document.createElement('div');
    $$(section).addClass(['coveo-facet-settings-section', className]);
    return section;
  }

  private handleSettingsButtonClick(event: Event) {
    event.stopPropagation();
    const settingsPopupIsOpen = !Utils.isNullOrUndefined(this.settingsPopup.parentElement);
    settingsPopupIsOpen ? this.close() : this.open();
  }

  private handleClickSortButton(e: Event, enabledSort: IFacetSortDescription) {
    if (this.activeSort != enabledSort && this.activeSort.relatedSort != enabledSort.name) {
      this.activeSort = enabledSort;
      if (enabledSort.directionToggle && contains(this.enabledSorts, FacetSettings.availableSorts[this.activeSort.relatedSort])) {
        this.activateDirectionSection();
      } else {
        this.disableDirectionSection();
      }
      this.selectItem(<HTMLElement>e.target);
      this.closePopupAndUpdateSort();
    }
  }

  private handleDirectionClick(e: Event, direction: string) {
    if (
      !$$((<HTMLElement>e.target).parentElement.parentElement).hasClass('coveo-facet-settings-disabled') &&
      this.activeSort.name.indexOf(direction) == -1
    ) {
      this.activeSort = FacetSettings.availableSorts[this.activeSort.relatedSort];
      each(this.directionSection, d => {
        this.unselectSection(d);
      });
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
    this.facet.triggerNewQuery(() =>
      this.facet.usageAnalytics.logSearchEvent<IAnalyticsFacetMeta>(analyticsActionCauseList.facetClearAll, {
        facetId: this.facet.options.id,
        facetField: this.facet.options.field.toString(),
        facetTitle: this.facet.options.title
      })
    );
  }

  private addOnNukeHandler() {
    $$(this.facet.root).on(InitializationEvents.nuke, () => this.handleNuke());
  }

  private addOnDocumentClickHandler() {
    document.addEventListener('click', () => this.onDocumentClick());
  }

  public getCurrentDirectionItem(directionSection = this.directionSection) {
    let found: HTMLElement;
    each(directionSection, direction => {
      if (!found) {
        found = find(this.getItems(direction), (direction: HTMLElement) => {
          return this.activeSort.name.indexOf(direction.getAttribute('data-direction')) != -1;
        });
      }
    });
    if (!found) {
      found = directionSection[0];
    }
    return found;
  }

  private activateDirectionSection() {
    each(this.directionSection, direction => {
      $$(direction).removeClass('coveo-facet-settings-disabled');
      $$(direction)
        .find('.coveo-facet-settings-item')
        .removeAttribute('aria-disabled');
      this.unselectSection(direction);
    });
    this.selectItem(this.getCurrentDirectionItem());
  }

  private disableDirectionSection() {
    each(this.directionSection, direction => {
      $$(direction).addClass('coveo-facet-settings-disabled');
      $$(direction)
        .find('.coveo-facet-settings-item')
        .setAttribute('aria-disabled', 'true');
      this.unselectSection(direction);
    });
  }

  private getItems(section: HTMLElement) {
    return $$(section).findAll('.coveo-facet-settings-item');
  }

  private unselectSection(section: HTMLElement) {
    each(this.getItems(section), i => {
      $$(i).removeClass('coveo-selected');
    });
  }

  private selectItem(item: HTMLElement) {
    if (item) {
      $$(item).addClass('coveo-selected');
    }
  }

  private unselectItem(item: HTMLElement) {
    if (item) {
      $$(item).removeClass('coveo-selected');
    }
  }

  private filterDuplicateForRendering() {
    each(this.enabledSorts, (enabledSort: IFacetSortDescription, i: number) => {
      if (enabledSort.relatedSort != null) {
        for (let j = i + 1; j < this.enabledSorts.length; j++) {
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

  private handleNuke() {
    document.removeEventListener('click', this.onDocumentClick);
  }
}
