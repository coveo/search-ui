/// <reference path="../../controllers/HierarchicalFacetQueryController.ts" />
/// <reference path="HierarchicalFacetValuesList.ts" />
/// <reference path="HierarchicalFacetSearch.ts" />
/// <reference path="HierarchicalBreadcrumbValuesList.ts" />
/// <reference path="HierarchicalFacetValueElement.ts" />

import {IFacetOptions} from '../Facet/Facet';
import {FacetValue} from '../Facet/FacetValues';
import {Facet} from '../Facet/Facet';
import {ComponentOptions} from '../Base/ComponentOptions';
import {HierarchicalFacetValuesList} from './HierarchicalFacetValuesList';
import {HierarchicalFacetQueryController} from '../../controllers/HierarchicalFacetQueryController';
import {IComponentBindings} from '../Base/ComponentBindings';
import {IIndexFieldValue} from '../../rest/FieldValue';
import {Utils} from '../../utils/Utils';
import {$$} from '../../utils/Dom';
import {Defer} from '../../misc/Defer';
import {HierarchicalFacetSearchValuesList} from './HierarchicalFacetSearchValuesList';
import {HierarchicalFacetSearch} from './HierarchicalFacetSearch';
import {HierarchicalBreadcrumbValuesList} from './HierarchicalBreadcrumbValuesList';
import {IQuerySuccessEventArgs} from '../../events/QueryEvents';
import {Assert} from '../../misc/Assert';
import {IPopulateBreadcrumbEventArgs} from '../../events/BreadcrumbEvents';
import {IPopulateOmniboxEventArgs} from '../../events/OmniboxEvents';
import {OmniboxHierarchicalValuesList} from './OmniboxHierarchicalValuesList';
import {HierarchicalFacetValueElement} from './HierarchicalFacetValueElement';
import {Initialization} from '../Base/Initialization';
import {ValueElementRenderer} from '../Facet/ValueElementRenderer';
import {l} from '../../strings/Strings';

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
}

interface IFlatHierarchy {
  facetValue: FacetValue;
  level: number;
  parent: string;
  self: string;
}

/**
 * This component inherits all of its options and behavior from the normal {@link Facet} component, but is meant to be used for hierarchical values.<br/>
 * The HierarchicalFacet component could be used to display files in a file system, or categories for documents in a hierarchy.<br/>
 * This facet require a group by field with a special format in order to work correctly.<br/>
 * Let's say we have the following files indexed on a filesystem:
 * ```
 * C:\
 *    folder1\
 *        text1.txt
 *    folder2\
 *      folder3\
 *        text2.txt
 * ```
 * The document `text1.txt` would need to have a field with the following format:<br/>
 * `@field : c; c|folder1;`<br/>
 * The document `text2.txt` would have a field with the following format:<br/>
 * `@field: c; c|folder2; c|folder2|folder3;`<br/>
 * The | character allows the facet to build its hierarchy (`folder3` inside `folder2` inside `c`)<br/>
 * Since both documents contain the `c` value, selecting that value in the facet would return both documents.<br/>
 * Selecting the `folder3` value in the facet would only return the `text2.txt` document.
 */
export class HierarchicalFacet extends Facet {
  static ID = 'HierarchicalFacet';
  /**
   * The options for the component
   * @componentOptions
   */
  static options: IHierarchicalFacetOptions = {
    /**
     * The character that allows to specify the hierarchy dependency.<br/>
     * The default value is `|`.<br/>
     * For example, if your field has the following values : @field: c; c>folder2; c>folder2>folder3; Then your delimiting character would be `>`
     */
    delimitingCharacter: ComponentOptions.buildStringOption({ defaultValue: '|' }),
    /**
     * Specifies at which level (0 based index) of the hierarchy you want your facet to start displaying it's values.<br/>
     * The default value is `0`.<br/>
     * Using this example :
     * ```
     * C:\
     *    folder1\
     *        text1.txt
     *    folder2\
     *      folder3\
     *        text2.txt
     * ```
     * Setting levelStart to 1 would only display folder1 and folder2, and omit c:
     */
    levelStart: ComponentOptions.buildNumberOption({ defaultValue: 0, min: 0 }),
    /**
     * Specifies at which level (0 based index) of the hierarchy you want your facet to stop displaying it's values.<br/>
     * The default value is undefined, meaning it will render all levels.
     */
    levelEnd: ComponentOptions.buildNumberOption({ min: 0 }),
    /**
     * Specifies the margin, in pixel, between each level, when they are expanded.<br/>
     * Default value is `10`.
     */
    marginByLevel: ComponentOptions.buildNumberOption({ defaultValue: 10, min: 0 })
  }

  static parent = Facet;

  public options: IHierarchicalFacetOptions;
  public facetValuesList: HierarchicalFacetValuesList;
  public numberOfValuesToShow: number;
  public facetQueryController: HierarchicalFacetQueryController;
  private valueHierarchy: { [facetValue: string]: IValueHierarchy };
  private originalPosition: IValueHierarchy[];
  private firstPlacement = true;
  private originalNumberOfValuesToShow: number;
  private topLevelHierarchy: IValueHierarchy[];
  private correctLevels: IFlatHierarchy[] = [];

  /**
   * Create a new instance of the Hierarchical component
   * @param element
   * @param options
   * @param bindings
   */
  public constructor(public element: HTMLElement, options: IHierarchicalFacetOptions, public bindings: IComponentBindings) {
    super(element, options, bindings, HierarchicalFacet.ID);
    this.options = ComponentOptions.initComponentOptions(element, HierarchicalFacet, this.options);
    this.numberOfValuesToShow = this.originalNumberOfValuesToShow = (this.options.numberOfValues || 5);
    this.numberOfValues = Math.max(this.options.numberOfValues, 10000);
    this.options.injectionDepth = Math.max(this.options.injectionDepth, 10000);
    this.logger.info('Hierarchy facet : Set number of values very high in order to build hierarchy', this.numberOfValues, this);
    this.logger.info('Hierarchy facet : Set injection depth very high in order to build hierarchy', this.options.injectionDepth);
  }

  /**
   * Select a single value
   * @param value The value to select
   * @param selectChilds Determine if the child values (if any) should also be selected. By default, this is the opposite value of the {@link Facet.options.useAnd} value
   */
  public selectValue(value: FacetValue, selectChilds?: boolean): void;
  public selectValue(value: string, selectChilds?: boolean): void;
  public selectValue(value: any, selectChilds = !this.options.useAnd) {
    this.ensureDom();
    this.ensureValueHierarchyExists([value]);
    let valueHierarchy = this.getValueFromHierarchy(value);
    if (selectChilds) {
      this.selectChilds(valueHierarchy, valueHierarchy.childs);
    }
    this.flagParentForSelection(valueHierarchy);
    super.selectValue(value);
  }

  /**
   * Select multiple values
   * @param values The array of values to select
   * @param selectChilds Determine if the child values (if any) should also be selected. By default, this is the opposite value of the {@link Facet.options.useAnd} value
   */
  public selectMultipleValues(values: FacetValue[], selectChilds?: boolean): void;
  public selectMultipleValues(values: string[], selectChilds?: boolean): void;
  public selectMultipleValues(values: any[], selectChilds = !this.options.useAnd): void {
    this.ensureDom();
    this.ensureValueHierarchyExists(values);
    _.each(values, (value) => {
      let valueHierarchy = this.getValueFromHierarchy(value);
      this.flagParentForSelection(valueHierarchy);
      if (selectChilds) {
        _.each(valueHierarchy.childs, (child) => {
          this.selectValue(child.facetValue);
        })
      }
    })
    super.selectMultipleValues(values);
  }

  /**
   * Deselect a single value
   * @param value The value to deselect
   * @param deselectChilds Determine if the child values (if any) should also be de-selected. By default, this is true
   */
  public deselectValue(value: FacetValue, deselectChilds?: boolean): void;
  public deselectValue(value: string, deselectChilds?: boolean): void;
  public deselectValue(value: any, deselectChilds = true) {
    this.ensureDom();
    this.ensureValueHierarchyExists([value]);
    let valueHierarchy = this.getValueFromHierarchy(value);
    if (deselectChilds) {
      let hasChilds = valueHierarchy.childs != undefined;
      if (hasChilds) {
        let activeChilds = _.filter<IValueHierarchy>(valueHierarchy.childs, (child) => {
          let valueToCompare = this.getFacetValueFromHierarchy(child.facetValue)
          return valueToCompare.selected || valueToCompare.excluded;
        })
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
   * Exclude a single value
   * @param value The value to exclude
   * @param excludeChilds Determine if the child values (if any) should also be excluded. By default, this is the opposite value of the {@link Facet.options.useAnd} value
   */
  public excludeValue(value: FacetValue, excludeChilds?: boolean): void;
  public excludeValue(value: string, excludeChilds?: boolean): void;
  public excludeValue(value: any, excludeChilds = !this.options.useAnd): void {
    this.ensureDom();
    this.ensureValueHierarchyExists([value]);
    let valueHierarchy = this.getValueFromHierarchy(value);
    if (excludeChilds) {
      this.excludeChilds(valueHierarchy.childs);
    } else {
      this.deselectChilds(valueHierarchy, valueHierarchy.childs);
      this.close(valueHierarchy);
    }
    this.flagParentForSelection(valueHierarchy);
    super.excludeValue(value);
  }

  /**
   * Unexclude a single value
   * @param value The value to unexclude
   * @param unexludeChilds Determine if the child values (if any) should also be un-excluded. By default, this is the opposite value of the {@link Facet.options.useAnd} value
   */
  public unexcludeValue(value: FacetValue, unexludeChilds?: boolean): void;
  public unexcludeValue(value: string, unexludeChilds?: boolean): void;
  public unexcludeValue(value: any, unexludeChilds = !this.options.useAnd): void {
    this.ensureDom();
    this.ensureValueHierarchyExists([value]);
    let valueHierarchy = this.getValueFromHierarchy(value);
    if (unexludeChilds) {
      this.unexcludeChilds(valueHierarchy.childs);
    }
    this.unflagParentForSelection(valueHierarchy);
    super.unexcludeValue(value);
  }

  /**
   * Deselect multiple values
   * @param values The array of values to deselect
   * @param deselectChilds Determine if the child values (if any) should also be deselected. By default, this is the opposite value of the {@link Facet.options.useAnd} value
   */
  public deselectMultipleValues(values: FacetValue[], deselectChilds?: boolean): void;
  public deselectMultipleValues(values: string[], deselectChilds?: boolean): void;
  public deselectMultipleValues(values: any[], deselectChilds = !this.options.useAnd): void {
    this.ensureDom();
    this.ensureValueHierarchyExists(values);
    _.each(values, (value) => {
      let valueHierarchy = this.getValueFromHierarchy(value);
      valueHierarchy.hasChildSelected = false;
      this.unflagParentForSelection(valueHierarchy);
      if (deselectChilds) {
        _.each(valueHierarchy.childs, (child) => {
          let childInHierarchy = this.getValueFromHierarchy(child.facetValue)
          childInHierarchy.hasChildSelected = false;
          this.deselectValue(child.facetValue);
        })
      }
    })
    super.deselectMultipleValues(values);
  }

  /**
   * Toggle the selection on a single value (select / deselect).
   * @param value
   */
  public toggleSelectValue(value: FacetValue): void;
  public toggleSelectValue(value: string): void;
  public toggleSelectValue(value: any): void {
    this.ensureDom();
    this.ensureValueHierarchyExists([value]);
    if (this.getFacetValueFromHierarchy(value).selected == false) {
      this.selectValue(value)
    } else {
      this.deselectValue(value);
    }
  }

  /**
   * Toggle the exclusion on a single value (exclude / unexclude)
   * @param value
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
   * Get the caption for a single value.
   * @param facetValue
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
        ret = this.options.valueCaption.call(this, facetValue)
      }
    }
    return ret;
  }

  /**
   * Get the currently displayed values in the facet
   * @returns {any[]}
   */
  public getDisplayedValues(): string[] {
    let displayed = _.filter(this.values.getAll(), (v) => {
      let valFromHierarchy = this.getValueFromHierarchy(v);
      if (valFromHierarchy) {
        let elem = this.getElementFromFacetValueList(v)
        return !$$(elem).hasClass('coveo-inactive');
      }
      return false;
    })
    return _.pluck(displayed, 'value');
  }

  /**
   * Update the sort criteria for the facet
   * @param criteria
   */
  public updateSort(criteria: string) {
    this.firstPlacement = true;
    super.updateSort(criteria);
  }

  /**
   * Open a single value and show all it's child
   * @param value
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
   * Close a single value and hide all it's child
   * @param value
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
   * Reset the facet state
   */
  public reset() {
    _.each(this.getAllValueHierarchy(), (valueHierarchy) => {
      valueHierarchy.hasChildSelected = false;
    })
    // Need to close all values, otherwise we might end up with orphan(s)
    // if a parent value, after reset, is no longer visible.
    _.each(this.getAllValueHierarchy(), (valueHierarchy) => {
      this.close(valueHierarchy);
    })
    super.reset();
  }

  public processFacetSearchAllResultsSelected(facetValues: FacetValue[]): void {
    this.selectMultipleValues(facetValues);
    this.triggerNewQuery();
  }

  protected updateSearchInNewDesign(moreValuesAvailable = true) {
    // We always want to show search for hierarchical facet :
    // It's useful since child values are folded under their parent most of the time
    super.updateSearchInNewDesign(true);
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

  protected handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    Assert.exists(args);
    if (this.values.hasSelectedOrExcludedValues()) {
      let element = new HierarchicalBreadcrumbValuesList(this, this.values.getSelected().concat(this.values.getExcluded()), this.getAllValueHierarchy()).build();
      args.breadcrumbs.push({
        element: element
      });
    }
  }

  protected handleOmniboxWithStaticValue(eventArg: IPopulateOmniboxEventArgs) {
    let regex = eventArg.completeQueryExpression.regex;
    let match = _.first(_.filter<IValueHierarchy>(this.getAllValueHierarchy(), (existingValue) => {
      return regex.test(this.getValueCaption(existingValue.facetValue))
    }), this.options.numberOfValuesInOmnibox)
    let facetValues = _.compact(_.map(match, (gotAMatch) => {
      let fromList = this.getFromFacetValueList(gotAMatch.facetValue);
      return fromList ? fromList.facetValue : undefined;
    }))
    let element = new OmniboxHierarchicalValuesList(this, facetValues, eventArg).build();
    eventArg.rows.push({
      element: element,
      zIndex: this.omniboxZIndex
    })
  }

  protected rebuildValueElements() {
    this.numberOfValues = Math.max(this.numberOfValues, 10000);
    this.processHierarchy();
    this.setValueListContent();
    super.rebuildValueElements();
    this.buildParentChildRelationship();
    this.checkForOrphans();
    this.crop();
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
      })
    }
    let atLeastOneDoesNotExists = false;
    _.each(facetValues, (facetValue: FacetValue) => {
      if (this.getValueHierarchy(facetValue.value) == undefined) {
        atLeastOneDoesNotExists = true;
      }
    })
    if (atLeastOneDoesNotExists) {
      this.processHierarchy(facetValues);
    }
  }

  private crop() {
    // Partition the top level or the facet to only operate on the values that are not selected or excluded
    let partition = _.partition(this.topLevelHierarchy, (hierarchy: IValueHierarchy) => {
      return hierarchy.facetValue.selected || hierarchy.facetValue.excluded
    });

    // Hide and show the partitionned top level values, depending on the numberOfValuesToShow
    let numberOfValuesLeft = this.numberOfValuesToShow - partition[0].length;
    _.each(_.last(partition[1], partition[1].length - numberOfValuesLeft), (toHide: IValueHierarchy) => {
      this.hideFacetValue(toHide);
      this.hideChilds(toHide.childs);
    })
    _.each(_.first(partition[1], numberOfValuesLeft), (toShow: IValueHierarchy) => {
      this.showFacetValue(toShow);
    })
  }

  private placeChildsUnderTheirParent(hierarchy: IValueHierarchy, hierarchyElement: HTMLElement) {
    _.each(hierarchy.childs.reverse(), (child) => {
      if (this.getValueHierarchy(child.facetValue.value)) {
        let childElement = this.getElementFromFacetValueList(child.facetValue);
        $$(childElement).insertAfter(hierarchyElement);
      }
    })
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
    let openAndCloseChilds = $$('div', {
      className: 'coveo-has-childs-toggle'
    }).el;

    $$(openAndCloseChilds).on('click', () => {
      $$(hierarchyElement).hasClass('coveo-open') ? this.close(hierarchy) : this.open(hierarchy);
    })

    $$(hierarchyElement).prepend(openAndCloseChilds);
  }

  private buildParentChildRelationship() {
    let sorted = _.chain(this.getAllValueHierarchy())
      .toArray()
      .sortBy('level')
      .value();

    _.each(<any>sorted, (hierarchy: IValueHierarchy) => {
      let hierarchyElement = this.getElementFromFacetValueList(hierarchy.facetValue);
      if (Utils.isNonEmptyArray(hierarchy.childs)) {
        this.placeChildsUnderTheirParent(hierarchy, hierarchyElement);
        this.addCssClassToParentAndChilds(hierarchy, hierarchyElement);
      } else {
        $$(hierarchyElement).addClass('coveo-no-childs');
      }
      hierarchyElement.style.marginLeft = (this.options.marginByLevel * (hierarchy.level - this.options.levelStart)) + 'px'
    })
  }

  private setValueListContent() {
    this.facetValuesList.hierarchyFacetValues = _.map(this.correctLevels, (hierarchy) => {
      if (!this.values.contains(hierarchy.facetValue.value)) {
        hierarchy.facetValue.occurrences = 0;
        this.values.add(hierarchy.facetValue);
      }
      return hierarchy.facetValue;
    })
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
    _.each(this.getAllValueHierarchy(), (valueHierarchy) => {
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
    this.correctLevels = _.filter<IFlatHierarchy>(flatHierarchy, (hierarchy) => {
      let isCorrectMinimumLevel = this.options.levelStart == undefined || hierarchy.level >= this.options.levelStart;
      let isCorrectMaximumLevel = this.options.levelEnd == undefined || hierarchy.level < this.options.levelEnd;
      return isCorrectMinimumLevel && isCorrectMaximumLevel;
    });
    _.each(this.correctLevels, (hierarchy: IFlatHierarchy) => {
      let childs = _.map(_.filter<IFlatHierarchy>(this.correctLevels, (possibleChild) => {
        return possibleChild.parent != null && possibleChild.parent.toLowerCase() == hierarchy.self.toLowerCase()
      }), (child): IValueHierarchy => {
        return {
          facetValue: child.facetValue,
          level: child.level,
          keepOpened: false,
          hasChildSelected: false
        }
      })

      let parent = hierarchy.parent != null ? _.find<IFlatHierarchy>(this.correctLevels, (possibleParent) => {
        return possibleParent.self.toLowerCase() == hierarchy.parent.toLowerCase()
      }) : null;

      let hierarchyThatAlreadyExists = this.getValueHierarchy(hierarchy.facetValue.value);
      let hierarchyThatAlreadyExistsAtParent;
      if (parent) {
        hierarchyThatAlreadyExistsAtParent = this.getValueHierarchy(parent.facetValue.value)
      }
      this.setValueHierarchy(hierarchy.facetValue.value, {
        childs: childs,
        parent: parent == undefined ? undefined : {
          facetValue: parent.facetValue,
          level: parent.level,
          keepOpened: hierarchyThatAlreadyExistsAtParent ? hierarchyThatAlreadyExistsAtParent.keepOpened : false,
          hasChildSelected: hierarchyThatAlreadyExistsAtParent ? hierarchyThatAlreadyExistsAtParent.hasChildSelected : false,
          originalPosition: hierarchyThatAlreadyExistsAtParent ? hierarchyThatAlreadyExistsAtParent.originalPosition : undefined,
        },
        facetValue: hierarchy.facetValue,
        level: hierarchy.level,
        keepOpened: hierarchyThatAlreadyExists ? hierarchyThatAlreadyExists.keepOpened : false,
        hasChildSelected: hierarchyThatAlreadyExists ? hierarchyThatAlreadyExists.hasChildSelected : false,
        originalPosition: hierarchyThatAlreadyExists ? hierarchyThatAlreadyExists.originalPosition : undefined
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
      .value()
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
      return this.getLookupOrValue(value)
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
    _.each(children, (child) => {
      this.hideFacetValue(child);
    })
  }

  private showChilds(children: IValueHierarchy[]) {
    _.each(children, (child) => {
      this.showFacetValue(child);
    })
  }

  private hideParent(parent: IValueHierarchy) {
    if (parent) {
      this.hideFacetValue(parent);
    }
  }

  private showParent(parent: IValueHierarchy) {
    if (parent) {
      this.showFacetValue(parent);
    }
  }

  private selectChilds(parent: IValueHierarchy, children: IValueHierarchy[]) {
    this.flagParentForSelection(parent);
    this.selectMultipleValues(_.map(children, (child) => {
      return child.facetValue
    }))
  }

  private deselectChilds(parent: IValueHierarchy, children: IValueHierarchy[]) {
    parent.hasChildSelected = false;
    this.deselectMultipleValues(_.map(children, (child) => {
      return child.facetValue
    }))
  }

  private excludeChilds(children: IValueHierarchy[]) {
    this.excludeMultipleValues(_.map(children, (child) => {
      return child.facetValue
    }))
  }

  private unexcludeChilds(children: IValueHierarchy[]) {
    this.unexcludeMultipleValues(_.map(children, (child) => {
      return child.facetValue
    }))
  }

  private selectParent(parent: IValueHierarchy) {
    if (parent != undefined) {
      this.selectValue(parent.facetValue);
      if (parent.parent) {
        this.selectParent(this.getValueHierarchy(parent.parent.facetValue.value))
      }
    }
  }

  private deselectParent(parent: IValueHierarchy) {
    if (parent != undefined) {
      this.deselectValue(parent.facetValue, false);
    }
  }

  private flagParentForSelection(valueHierarchy: IValueHierarchy) {
    let parent = valueHierarchy.parent;
    while (parent) {
      let parentInHierarchy = this.getValueHierarchy(parent.facetValue.value);
      parentInHierarchy.hasChildSelected = true;
      parent = parentInHierarchy.parent;
    }
  }

  private unflagParentForSelection(valueHierarchy: IValueHierarchy) {
    let parent = valueHierarchy.parent;
    while (parent) {
      let parentInHierarchy = this.getValueHierarchy(parent.facetValue.value)
      let otherSelectedChilds = _.filter<IValueHierarchy>(parentInHierarchy.childs, (child) => {
        let childInHierarchy = this.getValueHierarchy(child.facetValue.value);
        if (childInHierarchy != undefined) {
          return childInHierarchy.facetValue.value != valueHierarchy.facetValue.value
            && (childInHierarchy.facetValue.selected || childInHierarchy.facetValue.excluded || childInHierarchy.hasChildSelected);
        }
      })

      if (otherSelectedChilds.length == 0) {
        parentInHierarchy.hasChildSelected = false;
      }
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
    let ret = this.getFromFacetValueList(value)
    if (ret) {
      return ret.renderer.listElement
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
    return value.value.split(this.options.delimitingCharacter).length - 1
  }

  private getAllValueHierarchy(): { [facetValue: string]: IValueHierarchy } {
    if (this.valueHierarchy == null) {
      this.valueHierarchy = {}
    }
    return this.valueHierarchy;
  }

  private deleteValueHierarchy(key: string) {
    if (this.valueHierarchy != null) {
      delete this.valueHierarchy[key.toLowerCase()]
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
      this.valueHierarchy = {}
    }
    this.valueHierarchy[key.toLowerCase()] = value;
  }

  private checkForOrphans() {
    _.each(this.valueHierarchy, (v: IValueHierarchy) => {
      if (this.getLevel(v.facetValue) != 0) {
        if (this.getValueHierarchy(this.getParent(v.facetValue)) == undefined) {
          this.logger.error(`Orphan value found in HierarchicalFacet : ${v.facetValue.value}`, `Needed : ${this.getParent(v.facetValue)} but not found`);
          this.logger.warn(`Removing incoherent facet value : ${v.facetValue.value}`);
          this.hideFacetValue(v);
        }
      }
    })
  }
}
Initialization.registerAutoCreateComponent(HierarchicalFacet);
