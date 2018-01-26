/// <reference path="../../controllers/HierarchicalFacetQueryController.ts" />
/// <reference path="HierarchicalFacetValuesList.ts" />
/// <reference path="HierarchicalFacetSearch.ts" />
/// <reference path="HierarchicalBreadcrumbValuesList.ts" />
/// <reference path="HierarchicalFacetValueElement.ts" />

import { IFacetOptions } from '../Facet/Facet';
import { FacetValue } from '../Facet/FacetValues';
import { Facet } from '../Facet/Facet';
import { ComponentOptions } from '../Base/ComponentOptions';
import { HierarchicalFacetValuesList } from './HierarchicalFacetValuesList';
import { HierarchicalFacetQueryController } from '../../controllers/HierarchicalFacetQueryController';
import { IComponentBindings } from '../Base/ComponentBindings';
import { IIndexFieldValue } from '../../rest/FieldValue';
import { Utils } from '../../utils/Utils';
import { $$ } from '../../utils/Dom';
import { Defer } from '../../misc/Defer';
import { HierarchicalFacetSearchValuesList } from './HierarchicalFacetSearchValuesList';
import { HierarchicalFacetSearch } from './HierarchicalFacetSearch';
import { HierarchicalBreadcrumbValuesList } from './HierarchicalBreadcrumbValuesList';
import { IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { Assert } from '../../misc/Assert';
import { IPopulateBreadcrumbEventArgs } from '../../events/BreadcrumbEvents';
import { IPopulateOmniboxEventArgs } from '../../events/OmniboxEvents';
import { OmniboxHierarchicalValuesList } from './OmniboxHierarchicalValuesList';
import { HierarchicalFacetValueElement } from './HierarchicalFacetValueElement';
import { Initialization } from '../Base/Initialization';
import { ISearchAlertsPopulateMessageEventArgs } from '../../events/SearchAlertEvents';
import * as _ from 'underscore';
import { exportGlobally } from '../../GlobalExports';
import 'styling/_HierarchicalFacet';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';

export interface IHierarchicalFacetOptions extends IFacetOptions {
  delimitingCharacter?: string;
  levelStart?: number;
  levelEnd?: number;
  marginByLevel?: number;
}

export interface IValueHierarchy {
  childs?: IValueHierarchy[];
  parent?: IValueHierarchy;
  originalPosition?: number;
  facetValue: FacetValue;
  level: number;
  keepOpened: boolean;
  hasChildSelected: boolean;
  allChildShouldBeSelected: boolean;
}

interface IFlatHierarchy {
  facetValue: FacetValue;
  level: number;
  parent: string;
  self: string;
}

/**
 * The `HierarchicalFacet` component inherits all of its options and behaviors from the [`Facet`]{@link Facet}
 * component, but is meant to be used to render hierarchical values.
 *
 * **Note:**
 * > The `HierarchicalFacet` component does not currently support the [`customSort`]{@link Facet.options.customSort}
 * > `Facet` option.
 *
 * You can use the `HierarchicalFacet` component to display files in a file system, or categories for items in a
 * hierarchy.
 *
 * This facet requires a group by field with a special format to work correctly.
 *
 * **Example:**
 *
 * If you have the following files indexed on a file system:
 * ```
 * c:\
 *    folder1\
 *        text1.txt
 *    folder2\
 *      folder3\
 *        text2.txt
 * ```
 * The `text1.txt` item would need to have a field with the following format:
 * `@field : c; c|folder1;`
 *
 * The `text2.txt` item would have a field with the following format:
 * `@field: c; c|folder2; c|folder2|folder3;`
 *
 * The `|` character allows the facet to build its hierarchy (`folder3` inside `folder2` inside `c`).
 *
 * Since both items contain the `c` value, selecting this value in the facet would return both items.
 *
 * Selecting the `folder3` value in the facet would only return the `text2.txt` item.
 *
 * @notSupportedIn salesforcefree
 */
export class HierarchicalFacet extends Facet implements IComponentBindings {
  static ID = 'HierarchicalFacet';

  static doExport = () => {
    exportGlobally({
      HierarchicalFacet: HierarchicalFacet
    });
  };

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IHierarchicalFacetOptions = {
    /**
     * The character that allows to specify the hierarchical dependency.
     *
     * **Example:**
     *
     * If your field has the following values:
     *
     * `@field: c; c>folder2; c>folder2>folder3;`
     *
     * The delimiting character is `>`.
     *
     * Default value is `|`.
     */
    delimitingCharacter: ComponentOptions.buildStringOption({ defaultValue: '|' }),

    /**
     * Specifies at which level (0-based index) of the hierarchy the `HierarchicalFacet` should start displaying its
     * values.
     *
     * **Example:**
     *
     * If you have the following files indexed on a file system:
     * ```
     * c:\
     *    folder1\
     *        text1.txt
     *    folder2\
     *      folder3\
     *        text2.txt
     * ```
     * Setting `levelStart` to `1` displays `folder1` and `folder2` in the `HierarchicalFacet`, but omits `c:`.
     *
     * Default (and minimum) value is `0`.
     */
    levelStart: ComponentOptions.buildNumberOption({ defaultValue: 0, min: 0 }),

    /**
     * Specifies at which level (0-based index) of the hierarchy the `HierarchicalFacet` should stop displaying its
     * values.
     *
     * Default value is `undefined`, which means the `HierarchicalFacet` component renders all hierarchical levels.
     * Minimum value is `0`.
     */
    levelEnd: ComponentOptions.buildNumberOption({ min: 0 }),

    /**
     * Specifies the margin (in pixels) to display between each hierarchical level when expanding.
     *
     * Default value is `10`.
     */
    marginByLevel: ComponentOptions.buildNumberOption({ defaultValue: 10, min: 0 })
  };

  static parent = Facet;

  public options: IHierarchicalFacetOptions;
  public facetValuesList: HierarchicalFacetValuesList;
  public numberOfValuesToShow: number;
  public facetQueryController: HierarchicalFacetQueryController;
  public topLevelHierarchy: IValueHierarchy[];
  public shouldReshuffleFacetValuesClientSide = false;

  private valueHierarchy: { [facetValue: string]: IValueHierarchy };
  private originalNumberOfValuesToShow: number;

  private correctLevels: IFlatHierarchy[] = [];

  /**
   * Creates a new `HierarchicalFacet` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `HierarchicalFacet` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  public constructor(public element: HTMLElement, options: IHierarchicalFacetOptions, public bindings: IComponentBindings) {
    super(element, options, bindings, HierarchicalFacet.ID);
    this.options = ComponentOptions.initComponentOptions(element, HierarchicalFacet, this.options);
    this.numberOfValuesToShow = this.originalNumberOfValuesToShow = this.options.numberOfValues || 5;
    this.numberOfValues = Math.max(this.options.numberOfValues, 10000);
    this.options.injectionDepth = Math.max(this.options.injectionDepth, 10000);
    this.logger.info('Hierarchy facet: Set number of values very high in order to build hierarchy', this.numberOfValues, this);
    this.logger.info('Hierarchy facet: Set injection depth very high in order to build hierarchy', this.options.injectionDepth);
  }

  /**
   * Selects a single value.
   * @param value The value to select.
   * @param selectChildren Specifies whether to also select all child values (if any). Default value is the opposite of
   * the [`useAnd`]{@link Facet.options.useAnd} option value set for this `HierarchicalFacet`.
   */
  public selectValue(value: FacetValue, selectChildren?: boolean): void;
  public selectValue(value: string, selectChildren?: boolean): void;
  public selectValue(value: any, selectChildren = !this.options.useAnd) {
    this.ensureDom();
    this.ensureValueHierarchyExists([value]);
    let valueHierarchy = this.getValueFromHierarchy(value);
    if (selectChildren) {
      this.selectChilds(valueHierarchy, valueHierarchy.childs);
    }
    this.flagParentForSelection(valueHierarchy);
    super.selectValue(value);
  }

  /**
   * Selects multiple values
   * @param values The array of values to select.
   * @param selectChildren Specifies whether to also select all child values (if any). Default value is the opposite of
   * the [`useAnd`]{@link Facet.options.useAnd} option value set for this `HierarchicalFacet`.
   */
  public selectMultipleValues(values: FacetValue[], selectChildren?: boolean): void;
  public selectMultipleValues(values: string[], selectChildren?: boolean): void;
  public selectMultipleValues(values: any[], selectChildren = !this.options.useAnd): void {
    this.ensureDom();
    this.ensureValueHierarchyExists(values);
    _.each(values, value => {
      let valueHierarchy = this.getValueFromHierarchy(value);
      this.flagParentForSelection(valueHierarchy);
      if (selectChildren) {
        _.each(valueHierarchy.childs, child => {
          this.selectValue(child.facetValue);
        });
      }
    });
    super.selectMultipleValues(values);
  }

  /**
   * Deselects a single value
   * @param value The value to deselect.
   * @param deselectChildren Specifies whether to also deselect all child values (if any). Default value is `true`.
   */
  public deselectValue(value: FacetValue, deselectChildren?: boolean): void;
  public deselectValue(value: string, deselectChildren?: boolean): void;
  public deselectValue(value: any, deselectChildren = true) {
    this.ensureDom();
    this.ensureValueHierarchyExists([value]);
    let valueHierarchy = this.getValueFromHierarchy(value);
    if (deselectChildren) {
      let hasChilds = valueHierarchy.childs != undefined;
      if (hasChilds) {
        let activeChilds = _.filter<IValueHierarchy>(valueHierarchy.childs, child => {
          let valueToCompare = this.getFacetValueFromHierarchy(child.facetValue);
          return valueToCompare.selected || valueToCompare.excluded;
        });
        valueHierarchy.hasChildSelected = false;
        if (activeChilds.length == valueHierarchy.childs.length) {
          this.deselectChilds(valueHierarchy, valueHierarchy.childs);
        }
      }
    }
    this.deselectParent(valueHierarchy.parent);
    this.unflagParentForSelection(valueHierarchy);
    super.deselectValue(value);
  }

  /**
   * Excludes a single value.
   * @param value The value to exclude.
   * @param excludeChildren Specifies whether to also exclude all child values (if any). Default value is the opposite
   * of the [`useAnd`]{@link Facet.options.useAnd} option value set for this `HierarchicalFacet`.
   */
  public excludeValue(value: FacetValue, excludeChildren?: boolean): void;
  public excludeValue(value: string, excludeChildren?: boolean): void;
  public excludeValue(value: any, excludeChildren = !this.options.useAnd): void {
    this.ensureDom();
    this.ensureValueHierarchyExists([value]);
    let valueHierarchy = this.getValueFromHierarchy(value);
    if (excludeChildren) {
      this.excludeChilds(valueHierarchy.childs);
    } else {
      this.deselectChilds(valueHierarchy, valueHierarchy.childs);
      this.close(valueHierarchy);
    }
    this.flagParentForSelection(valueHierarchy);
    super.excludeValue(value);
  }

  /**
   * Un-excludes a single value.
   * @param value The value to un-exclude.
   * @param unexludeChildren Specifies whether to also un-exclude all child values (if any). Default value is the
   * opposite of the [`useAnd`]{@link Facet.options.useAnd} option value set for this `HierarchicalFacet`.
   */
  public unexcludeValue(value: FacetValue, unexludeChildren?: boolean): void;
  public unexcludeValue(value: string, unexludeChildren?: boolean): void;
  public unexcludeValue(value: any, unexludeChildren = !this.options.useAnd): void {
    this.ensureDom();
    this.ensureValueHierarchyExists([value]);
    let valueHierarchy = this.getValueFromHierarchy(value);
    if (unexludeChildren) {
      this.unexcludeChilds(valueHierarchy.childs);
    }
    this.unflagParentForSelection(valueHierarchy);
    super.unexcludeValue(value);
  }

  /**
   * Deselects multiple values.
   * @param values The array of values to deselect.
   * @param deselectChildren Specifies whether to also deselect all child values (if any). Default value is the opposite
   * of the [`useAnd`]{@link Facet.options.useAnd} option value set for this `HierarchicalFacet`.
   */
  public deselectMultipleValues(values: FacetValue[], deselectChildren?: boolean): void;
  public deselectMultipleValues(values: string[], deselectChildren?: boolean): void;
  public deselectMultipleValues(values: any[], deselectChildren = !this.options.useAnd): void {
    this.ensureDom();
    this.ensureValueHierarchyExists(values);
    _.each(values, value => {
      let valueHierarchy = this.getValueFromHierarchy(value);
      valueHierarchy.hasChildSelected = false;
      this.unflagParentForSelection(valueHierarchy);
      if (deselectChildren) {
        _.each(valueHierarchy.childs, child => {
          let childInHierarchy = this.getValueFromHierarchy(child.facetValue);
          childInHierarchy.hasChildSelected = false;
          this.deselectValue(child.facetValue);
        });
      }
    });
    super.deselectMultipleValues(values);
  }

  /**
   * Toggles the selection of a single value (selects value if not selected; deselects value if selected).
   * @param value The value to select or deselect.
   */
  public toggleSelectValue(value: FacetValue): void;
  public toggleSelectValue(value: string): void;
  public toggleSelectValue(value: any): void {
    this.ensureDom();
    this.ensureValueHierarchyExists([value]);
    if (this.getFacetValueFromHierarchy(value).selected == false) {
      this.selectValue(value);
    } else {
      this.deselectValue(value);
    }
  }

  /**
   * Toggles the exclusion of a single value (excludes value if not excluded; un-excludes value if excluded).
   * @param value The value to exclude or un-exclude.
   */
  public toggleExcludeValue(value: FacetValue): void;
  public toggleExcludeValue(value: string): void;
  public toggleExcludeValue(value: any): void {
    this.ensureDom();
    this.ensureValueHierarchyExists([value]);
    if (this.getFacetValueFromHierarchy(value).excluded == false) {
      this.excludeValue(value);
    } else {
      this.unexcludeValue(value);
    }
  }

  /**
   * Gets the caption of a single value.
   * @param facetValue The value whose caption the method should return.
   * @returns {string} The caption of the value.
   */
  public getValueCaption(facetValue: IIndexFieldValue): string;
  public getValueCaption(facetValue: FacetValue): string;
  public getValueCaption(facetValue: any): string {
    let stringValue = this.getSelf(facetValue);
    let ret = stringValue;
    if (Utils.exists(this.options.valueCaption)) {
      if (typeof this.options.valueCaption == 'object') {
        ret = this.options.valueCaption[stringValue] || ret;
      }
      if (typeof this.options.valueCaption == 'function') {
        ret = this.options.valueCaption.call(this, facetValue);
      }
    }
    return ret;
  }

  /**
   * Gets the values that the `HierarchicalFacet` is currently displaying.
   * @returns {any[]} An array containing all the values that the `HierarchicalFacet` is currently displaying.
   */
  public getDisplayedValues(): string[] {
    let displayed = _.filter(this.values.getAll(), v => {
      let valFromHierarchy = this.getValueFromHierarchy(v);
      if (valFromHierarchy) {
        let elem = this.getElementFromFacetValueList(v);
        return !$$(elem).hasClass('coveo-inactive');
      }
      return false;
    });
    return _.pluck(displayed, 'value');
  }

  /**
   * Updates the sort criteria for the `HierarchicalFacet`.
   *
   * See the [`sortCriteria`]{@link IGroupByRequest.sortCriteria} property of the [`IGroupByRequest`] interface for the
   * list and description of possible values.
   *
   * @param criteria The new sort criteria.
   */
  public updateSort(criteria: string) {
    super.updateSort(criteria);
  }

  /**
   * Opens (expands) a single value and shows all its children.
   * @param value The value to open.
   */
  public open(value: FacetValue);
  public open(value: IValueHierarchy);
  public open(value: String);
  public open(value: any) {
    let getter;
    if (_.isString(value)) {
      getter = this.getValueHierarchy(value);
    } else if (value instanceof FacetValue) {
      getter = this.getValueHierarchy(value.value);
    } else {
      getter = value;
    }
    if (getter != undefined) {
      $$(this.getElementFromFacetValueList(getter.facetValue.value)).addClass('coveo-open');
      this.showChilds(getter.childs);
      if (getter.parent != undefined) {
        this.open(this.getValueHierarchy(getter.facetValue.value).parent);
      }
      this.getValueHierarchy(getter.facetValue.value).keepOpened = true;
    }
  }

  /**
   * Closes (collapses) a single value and hides all its children.
   * @param value The value to close.
   */
  public close(value: FacetValue);
  public close(value: IValueHierarchy);
  public close(value: String);
  public close(value: any) {
    let getter;
    if (_.isString(value)) {
      getter = this.getValueHierarchy(value);
    } else if (value instanceof FacetValue) {
      getter = this.getValueHierarchy(value.value);
    } else {
      getter = value;
    }
    if (getter != undefined) {
      $$(this.getElementFromFacetValueList(getter.facetValue)).removeClass('coveo-open');
      this.hideChilds(getter.childs);
      _.each(getter.childs, (child: IValueHierarchy) => {
        this.close(this.getValueHierarchy(child.facetValue.value));
      });
      this.getValueHierarchy(getter.facetValue.value).keepOpened = false;
    }
  }

  /**
   * Resets the `HierarchicalFacet` state.
   */
  public reset() {
    _.each(this.getAllValueHierarchy(), valueHierarchy => {
      valueHierarchy.hasChildSelected = false;
      valueHierarchy.allChildShouldBeSelected = false;
    });
    // Need to close all values, otherwise we might end up with orphan(s)
    // if a parent value, after reset, is no longer visible.
    _.each(this.getAllValueHierarchy(), valueHierarchy => {
      this.close(valueHierarchy);
    });
    super.reset();
  }

  public processFacetSearchAllResultsSelected(facetValues: FacetValue[]): void {
    this.selectMultipleValues(facetValues);
    this.triggerNewQuery();
  }

  protected triggerUpdateDeltaQuery(facetValues: FacetValue[]) {
    this.shouldReshuffleFacetValuesClientSide = this.keepDisplayedValuesNextTime;
    super.triggerUpdateDeltaQuery(facetValues);
  }

  protected updateSearchElement(moreValuesAvailable = true) {
    // We always want to show search for hierarchical facet :
    // It's useful since child values are folded under their parent most of the time
    super.updateSearchElement(true);
  }

  protected facetValueHasChanged() {
    this.updateQueryStateModel();
    Defer.defer(() => {
      this.updateAppearanceDependingOnState();
    });
  }

  protected initFacetQueryController() {
    this.facetQueryController = new HierarchicalFacetQueryController(this);
  }

  protected initFacetSearch() {
    this.facetSearch = new HierarchicalFacetSearch(this, HierarchicalFacetSearchValuesList, this.root);
    this.element.appendChild(this.facetSearch.build());
  }

  protected handleDeferredQuerySuccess(data: IQuerySuccessEventArgs) {
    this.updateAppearanceDependingOnState();
    super.handleDeferredQuerySuccess(data);
  }

  protected handlePopulateSearchAlerts(args: ISearchAlertsPopulateMessageEventArgs) {
    if (this.values.hasSelectedOrExcludedValues()) {
      args.text.push(
        new HierarchicalBreadcrumbValuesList(
          this,
          this.values.getSelected().concat(this.values.getExcluded()),
          this.getAllValueHierarchy()
        ).buildAsString()
      );
    }
  }

  protected handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    Assert.exists(args);
    if (this.values.hasSelectedOrExcludedValues()) {
      let element = new HierarchicalBreadcrumbValuesList(
        this,
        this.values.getSelected().concat(this.values.getExcluded()),
        this.getAllValueHierarchy()
      ).build();
      args.breadcrumbs.push({
        element: element
      });
    }
  }

  protected handleOmniboxWithStaticValue(eventArg: IPopulateOmniboxEventArgs) {
    let regex = eventArg.completeQueryExpression.regex;
    let match = _.first(
      _.filter<IValueHierarchy>(this.getAllValueHierarchy(), existingValue => {
        return regex.test(this.getValueCaption(existingValue.facetValue));
      }),
      this.options.numberOfValuesInOmnibox
    );
    let facetValues = _.compact(
      _.map(match, gotAMatch => {
        let fromList = this.getFromFacetValueList(gotAMatch.facetValue);
        return fromList ? fromList.facetValue : undefined;
      })
    );
    let element = new OmniboxHierarchicalValuesList(this, facetValues, eventArg).build();
    eventArg.rows.push({
      element: element,
      zIndex: this.omniboxZIndex
    });
  }

  protected rebuildValueElements() {
    this.shouldReshuffleFacetValuesClientSide = this.shouldReshuffleFacetValuesClientSide || this.keepDisplayedValuesNextTime;
    this.numberOfValues = Math.max(this.numberOfValues, 10000);
    this.processHierarchy();
    this.setValueListContent();
    super.rebuildValueElements();
    this.buildParentChildRelationship();
    this.checkForOrphans();
    this.checkForNewUnselectedChild();
    this.crop();
    this.shouldReshuffleFacetValuesClientSide = false;
  }

  protected initFacetValuesList() {
    this.facetValuesList = new HierarchicalFacetValuesList(this, HierarchicalFacetValueElement);
    this.element.appendChild(this.facetValuesList.build());
  }

  protected updateMoreLess() {
    let moreValuesAvailable = this.numberOfValuesToShow < this.topLevelHierarchy.length;
    let lessIsShown = this.numberOfValuesToShow > this.originalNumberOfValuesToShow;
    super.updateMoreLess(lessIsShown, moreValuesAvailable);
  }

  protected handleClickMore(): void {
    this.numberOfValuesToShow += this.originalNumberOfValuesToShow;
    this.numberOfValuesToShow = Math.min(this.numberOfValuesToShow, this.values.size());
    this.crop();
    this.updateMoreLess();
  }

  protected handleClickLess() {
    this.numberOfValuesToShow = this.originalNumberOfValuesToShow;
    this.crop();
    this.updateMoreLess();
  }

  protected updateNumberOfValues() {
    this.numberOfValues = Math.max(this.numberOfValues, 10000);
  }

  private ensureValueHierarchyExists(facetValues: any) {
    if (facetValues[0] && typeof facetValues[0] == 'string') {
      facetValues = _.map(facetValues, (value: string) => {
        return FacetValue.createFromValue(value);
      });
    }
    let atLeastOneDoesNotExists = false;
    _.each(facetValues, (facetValue: FacetValue) => {
      if (this.getValueHierarchy(facetValue.value) == undefined) {
        atLeastOneDoesNotExists = true;
      }
    });
    if (atLeastOneDoesNotExists) {
      this.processHierarchy(facetValues);
    }
  }

  private crop() {
    // Partition the top level or the facet to only operate on the values that are not selected or excluded
    let partition = _.partition(this.topLevelHierarchy, (hierarchy: IValueHierarchy) => {
      return hierarchy.facetValue.selected || hierarchy.facetValue.excluded || hierarchy.hasChildSelected;
    });

    // Hide and show the partitionned top level values, depending on the numberOfValuesToShow
    let numberOfValuesLeft = this.numberOfValuesToShow - partition[0].length;
    _.each(_.last(partition[1], partition[1].length - numberOfValuesLeft), (toHide: IValueHierarchy) => {
      this.hideFacetValue(toHide);
      this.hideChilds(toHide.childs);
    });
    _.each(_.first(partition[1], numberOfValuesLeft), (toShow: IValueHierarchy) => {
      this.showFacetValue(toShow);
    });
  }

  private placeChildsUnderTheirParent(hierarchy: IValueHierarchy, hierarchyElement: HTMLElement) {
    let toIterateOver = hierarchy.childs;
    if (toIterateOver) {
      let toIterateOverSorted = this.facetValuesList.sortFacetValues(_.pluck(toIterateOver, 'facetValue')).reverse();
      _.each(toIterateOverSorted, child => {
        let childFromHierarchy = this.getValueFromHierarchy(child);
        if (childFromHierarchy) {
          let childElement = this.getElementFromFacetValueList(child);
          $$(childElement).insertAfter(hierarchyElement);
          if (childFromHierarchy.childs && childFromHierarchy.childs.length != 0) {
            this.placeChildsUnderTheirParent(childFromHierarchy, childElement);
          }
        }
      });
    }

    if (hierarchy.keepOpened) {
      this.open(hierarchy);
      this.showChilds(hierarchy.childs);
    } else {
      this.hideChilds(hierarchy.childs);
    }
  }

  private addCssClassToParentAndChilds(hierarchy: IValueHierarchy, hierarchyElement: HTMLElement) {
    $$(hierarchyElement).addClass('coveo-has-childs');
    if (hierarchy.hasChildSelected) {
      $$(hierarchyElement).addClass('coveo-has-childs-selected');
    }
    const expandChilds = $$('span', { className: 'coveo-hierarchical-facet-expand' }, SVGIcons.icons.facetExpand);
    const collapseChilds = $$('span', { className: 'coveo-hierarchical-facet-collapse' }, SVGIcons.icons.facetCollapse);
    SVGDom.addClassToSVGInContainer(expandChilds.el, 'coveo-hierarchical-facet-expand-svg');
    SVGDom.addClassToSVGInContainer(collapseChilds.el, 'coveo-hierarchical-facet-collapse-svg');
    let openAndCloseChilds = $$(
      'div',
      {
        className: 'coveo-has-childs-toggle'
      },
      expandChilds.el,
      collapseChilds.el
    ).el;

    $$(openAndCloseChilds).on('click', () => {
      $$(hierarchyElement).hasClass('coveo-open') ? this.close(hierarchy) : this.open(hierarchy);
    });

    $$(hierarchyElement).prepend(openAndCloseChilds);
  }

  private buildParentChildRelationship() {
    let fragment = document.createDocumentFragment();
    fragment.appendChild(this.facetValuesList.valueContainer);
    let sorted = _.map(this.facetValuesList.sortFacetValues(), (facetValue: FacetValue) => {
      return this.getValueFromHierarchy(facetValue);
    });
    _.each(sorted, (hierarchy: IValueHierarchy) => {
      let hierarchyElement = this.getElementFromFacetValueList(hierarchy.facetValue);
      if (Utils.isNonEmptyArray(hierarchy.childs)) {
        this.placeChildsUnderTheirParent(hierarchy, hierarchyElement);
        this.addCssClassToParentAndChilds(hierarchy, hierarchyElement);
      } else {
        $$(hierarchyElement).addClass('coveo-no-childs');
      }
      hierarchyElement.style.marginLeft = this.options.marginByLevel * (hierarchy.level - this.options.levelStart) + 'px';
    });

    $$(<any>fragment).insertAfter(this.headerElement);
  }

  private setValueListContent() {
    this.facetValuesList.hierarchyFacetValues = _.map(this.correctLevels, hierarchy => {
      if (!this.values.contains(hierarchy.facetValue.value)) {
        hierarchy.facetValue.occurrences = 0;
        this.values.add(hierarchy.facetValue);
      }
      return hierarchy.facetValue;
    });
  }

  private createHierarchy(valuesToBuildWith: FacetValue[]) {
    let flatHierarchy = _.map(valuesToBuildWith, (value: FacetValue) => {
      let parent = this.getParent(value);
      let self = value.lookupValue || value.value;
      return {
        facetValue: value,
        level: this.getLevel(value),
        parent: parent,
        self: self
      };
    });
    this.setInHierarchy(flatHierarchy);
    _.each(this.getAllValueHierarchy(), valueHierarchy => {
      if (valueHierarchy.facetValue.selected) {
        this.flagParentForSelection(valueHierarchy);
      }
    });
    return flatHierarchy;
  }

  private processHierarchy(facetValues = this.values.getAll()) {
    _.each(this.getAllValueHierarchy(), (hierarchy: IValueHierarchy) => {
      if (this.values.get(hierarchy.facetValue.value) == undefined) {
        this.deleteValueHierarchy(this.getLookupOrValue(hierarchy.facetValue));
      }
    });
    this.createHierarchy(facetValues);
  }

  private setInHierarchy(flatHierarchy: IFlatHierarchy[]) {
    this.correctLevels = _.filter<IFlatHierarchy>(flatHierarchy, hierarchy => {
      let isCorrectMinimumLevel = this.options.levelStart == undefined || hierarchy.level >= this.options.levelStart;
      let isCorrectMaximumLevel = this.options.levelEnd == undefined || hierarchy.level < this.options.levelEnd;
      return isCorrectMinimumLevel && isCorrectMaximumLevel;
    });
    _.each(this.correctLevels, (hierarchy: IFlatHierarchy) => {
      let childs = _.map(
        _.filter<IFlatHierarchy>(this.correctLevels, (possibleChild: IFlatHierarchy) => {
          return possibleChild.parent != null && possibleChild.parent.toLowerCase() == hierarchy.self.toLowerCase();
        }),
        (child): IValueHierarchy => {
          return {
            facetValue: child.facetValue,
            level: child.level,
            keepOpened: false,
            hasChildSelected: false,
            allChildShouldBeSelected: false
          };
        }
      );

      let parent =
        hierarchy.parent != null
          ? _.find<IFlatHierarchy>(this.correctLevels, possibleParent => {
              return possibleParent.self.toLowerCase() == hierarchy.parent.toLowerCase();
            })
          : null;

      let hierarchyThatAlreadyExists = this.getValueHierarchy(hierarchy.facetValue.value);
      if (hierarchyThatAlreadyExists && hierarchyThatAlreadyExists.childs.length != childs.length) {
        hierarchyThatAlreadyExists.childs = childs;
      }
      let hierarchyThatAlreadyExistsAtParent;
      if (parent) {
        hierarchyThatAlreadyExistsAtParent = this.getValueHierarchy(parent.facetValue.value);
      }
      this.setValueHierarchy(hierarchy.facetValue.value, {
        childs: childs,
        parent:
          parent == undefined
            ? undefined
            : {
                facetValue: parent.facetValue,
                level: parent.level,
                keepOpened: hierarchyThatAlreadyExistsAtParent ? hierarchyThatAlreadyExistsAtParent.keepOpened : false,
                hasChildSelected: hierarchyThatAlreadyExistsAtParent ? hierarchyThatAlreadyExistsAtParent.hasChildSelected : false,
                originalPosition: hierarchyThatAlreadyExistsAtParent ? hierarchyThatAlreadyExistsAtParent.originalPosition : undefined,
                allChildShouldBeSelected: hierarchyThatAlreadyExistsAtParent
                  ? hierarchyThatAlreadyExistsAtParent.allChildShouldBeSelected
                  : false
              },
        facetValue: hierarchy.facetValue,
        level: hierarchy.level,
        keepOpened: hierarchyThatAlreadyExists ? hierarchyThatAlreadyExists.keepOpened : false,
        hasChildSelected: hierarchyThatAlreadyExists ? hierarchyThatAlreadyExists.hasChildSelected : false,
        originalPosition: hierarchyThatAlreadyExists ? hierarchyThatAlreadyExists.originalPosition : undefined,
        allChildShouldBeSelected: hierarchyThatAlreadyExists ? hierarchyThatAlreadyExists.allChildShouldBeSelected : false
      });
    });

    this.topLevelHierarchy = _.chain(this.values.getAll())
      .filter((value: FacetValue) => {
        let fromHierarchy = this.getValueFromHierarchy(value);
        if (fromHierarchy) {
          return fromHierarchy.level == (this.options.levelStart || 0);
        } else {
          return false;
        }
      })
      .map((value: FacetValue) => {
        return this.getValueFromHierarchy(value);
      })
      .value();
  }

  private getParent(value: FacetValue) {
    let lastIndexOfDelimiting = this.getLookupOrValue(value).lastIndexOf(this.options.delimitingCharacter);
    if (lastIndexOfDelimiting != -1) {
      return this.getLookupOrValue(value).substring(0, lastIndexOfDelimiting);
    }
    return undefined;
  }

  private getSelf(value: FacetValue) {
    let parent = this.getParent(value);
    if (parent == undefined) {
      return this.getLookupOrValue(value);
    } else {
      let indexOfParent = this.getLookupOrValue(value).indexOf(parent);
      return this.getLookupOrValue(value).substring(indexOfParent + parent.length + 1);
    }
  }

  private showFacetValue(value: IValueHierarchy) {
    $$(this.getElementFromFacetValueList(value.facetValue.value)).removeClass('coveo-inactive');
  }

  private hideFacetValue(value: IValueHierarchy) {
    $$(this.getElementFromFacetValueList(value.facetValue.value)).addClass('coveo-inactive');
  }

  private hideChilds(children: IValueHierarchy[]) {
    _.each(children, child => {
      this.hideFacetValue(child);
    });
  }

  private showChilds(children: IValueHierarchy[]) {
    _.each(children, child => {
      this.showFacetValue(child);
    });
  }

  private selectChilds(parent: IValueHierarchy, children: IValueHierarchy[]) {
    this.flagParentForSelection(parent);
    parent.allChildShouldBeSelected = true;
    this.selectMultipleValues(
      _.map(children, child => {
        return child.facetValue;
      })
    );
  }

  private deselectChilds(parent: IValueHierarchy, children: IValueHierarchy[]) {
    parent.hasChildSelected = false;
    parent.allChildShouldBeSelected = false;
    this.deselectMultipleValues(
      _.map(children, child => {
        return child.facetValue;
      })
    );
  }

  private excludeChilds(children: IValueHierarchy[]) {
    this.excludeMultipleValues(
      _.map(children, child => {
        return child.facetValue;
      })
    );
  }

  private unexcludeChilds(children: IValueHierarchy[]) {
    this.unexcludeMultipleValues(
      _.map(children, child => {
        return child.facetValue;
      })
    );
  }

  private deselectParent(parent: IValueHierarchy) {
    if (parent != undefined) {
      this.deselectValue(parent.facetValue, false);
    }
  }

  private flagParentForSelection(valueHierarchy: IValueHierarchy) {
    let parent = valueHierarchy.parent;
    let current = valueHierarchy;
    while (parent) {
      let parentInHierarchy = this.getValueHierarchy(parent.facetValue.value);
      parentInHierarchy.hasChildSelected = true;
      let found = _.find(parentInHierarchy.childs, (child: IValueHierarchy) => {
        return child.facetValue.value.toLowerCase() == current.facetValue.value.toLowerCase();
      });
      if (found) {
        if (this.getValueHierarchy(found.facetValue.value).hasChildSelected) {
          found.hasChildSelected = true;
        }
      }
      parent = parentInHierarchy.parent;
      current = parentInHierarchy;
    }
  }

  private unflagParentForSelection(valueHierarchy: IValueHierarchy) {
    let parent = valueHierarchy.parent;
    while (parent) {
      let parentInHierarchy = this.getValueHierarchy(parent.facetValue.value);
      let otherSelectedChilds = _.filter<IValueHierarchy>(parentInHierarchy.childs, child => {
        let childInHierarchy = this.getValueHierarchy(child.facetValue.value);
        if (childInHierarchy != undefined) {
          return (
            childInHierarchy.facetValue.value != valueHierarchy.facetValue.value &&
            (childInHierarchy.facetValue.selected || childInHierarchy.facetValue.excluded || childInHierarchy.hasChildSelected)
          );
        }
      });

      if (otherSelectedChilds.length == 0) {
        parentInHierarchy.hasChildSelected = false;
      }
      parentInHierarchy.allChildShouldBeSelected = false;
      parent = parentInHierarchy.parent;
    }
  }

  public getValueFromHierarchy(value: any): IValueHierarchy {
    let getter = value instanceof FacetValue ? value.value : value;
    return this.getValueHierarchy(getter);
  }

  private getFacetValueFromHierarchy(value: any): FacetValue {
    return this.getValueFromHierarchy(value).facetValue;
  }

  private getLookupOrValue(value: FacetValue) {
    return value.lookupValue || value.value;
  }

  private getElementFromFacetValueList(value: any) {
    let ret = this.getFromFacetValueList(value);
    if (ret) {
      return ret.renderer.listItem;
    } else {
      return $$('div').el;
    }
  }

  private getFromFacetValueList(value: any) {
    let fromHierarchy = this.getValueFromHierarchy(value);
    if (fromHierarchy != undefined) {
      return this.facetValuesList.get(value);
    } else {
      return undefined;
    }
  }

  private getLevel(value: FacetValue) {
    return value.value.split(this.options.delimitingCharacter).length - 1;
  }

  public getAllValueHierarchy(): { [facetValue: string]: IValueHierarchy } {
    if (this.valueHierarchy == null) {
      this.valueHierarchy = {};
    }
    return this.valueHierarchy;
  }

  private deleteValueHierarchy(key: string) {
    if (this.valueHierarchy != null) {
      delete this.valueHierarchy[key.toLowerCase()];
    }
  }

  private getValueHierarchy(key: string): IValueHierarchy {
    if (this.valueHierarchy == null) {
      return undefined;
    }
    return this.valueHierarchy[key.toLowerCase()];
  }

  private setValueHierarchy(key: string, value: IValueHierarchy) {
    if (this.valueHierarchy == null) {
      this.valueHierarchy = {};
    }
    this.valueHierarchy[key.toLowerCase()] = value;
  }

  private checkForOrphans() {
    _.each(this.valueHierarchy, (v: IValueHierarchy) => {
      if (this.getLevel(v.facetValue) != this.options.levelStart) {
        if (this.getValueHierarchy(this.getParent(v.facetValue)) == undefined) {
          this.logger.error(
            `Orphan value found in HierarchicalFacet : ${v.facetValue.value}`,
            `Needed : ${this.getParent(v.facetValue)} but not found`
          );
          this.logger.warn(`Removing incoherent facet value : ${v.facetValue.value}`);
          this.hideFacetValue(v);
        }
      }
    });
  }

  private checkForNewUnselectedChild() {
    // It's possible that after checking a facet value, the index returns new facet values (because of injection depth);
    _.each(this.valueHierarchy, (v: IValueHierarchy) => {
      if (v.allChildShouldBeSelected) {
        let notAlreadySelected = _.find(v.childs, (child: IValueHierarchy) => {
          return child.facetValue.selected != true;
        });
        if (notAlreadySelected) {
          this.selectValue(v.facetValue, true);
          this.logger.info('Re-executing query with new facet values returned by index');
          this.queryController.deferExecuteQuery();
        }
      }
    });
  }
}
Initialization.registerAutoCreateComponent(HierarchicalFacet);
