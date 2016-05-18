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

export interface ValueHierarchy {
  childs?: ValueHierarchy[];
  parent?: ValueHierarchy;
  originalPosition?: number;
  facetValue: FacetValue;
  level: number;
  keepOpened: boolean;
  hasChildSelected: boolean;
}

interface FlatHierarchy {
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
    delimitingCharacter: ComponentOptions.buildStringOption({defaultValue: '|'}),
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
    levelStart: ComponentOptions.buildNumberOption({defaultValue: 0, min: 0}),
    /**
     * Specifies at which level (0 based index) of the hierarchy you want your facet to stop displaying it's values.<br/>
     * The default value is undefined, meaning it will render all levels.
     */
    levelEnd: ComponentOptions.buildNumberOption({min: 0}),
    /**
     * Specifies the margin, in pixel, between each level, when they are expanded.<br/>
     * Default value is `10`.
     */
    marginByLevel: ComponentOptions.buildNumberOption({defaultValue: 10, min: 0})
  }

  static parent = Facet;

  public options: IHierarchicalFacetOptions;
  public facetValuesList: HierarchicalFacetValuesList;
  public numberOfValuesToShow: number;
  public facetQueryController: HierarchicalFacetQueryController;
  private valueHierarchy: { [facetValue: string]: ValueHierarchy };
  private originalPosition: ValueHierarchy[];
  private firstPlacement = true;
  private originalNumberOfValuesToShow: number;
  private topLevelHierarchy: ValueHierarchy[];
  private correctLevels: FlatHierarchy[] = [];

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
    var valueHierarchy = this.getValueFromHierarchy(value);
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
      var valueHierarchy = this.getValueFromHierarchy(value);
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
    var valueHierarchy = this.getValueFromHierarchy(value);
    if (deselectChilds) {
      var hasChilds = valueHierarchy.childs != undefined;
      if (hasChilds) {
        var activeChilds = _.filter<ValueHierarchy>(valueHierarchy.childs, (child) => {
          var valueToCompare = this.getFacetValueFromHierarchy(child.facetValue)
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
    var valueHierarchy = this.getValueFromHierarchy(value);
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
    var valueHierarchy = this.getValueFromHierarchy(value);
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
      var valueHierarchy = this.getValueFromHierarchy(value);
      valueHierarchy.hasChildSelected = false;
      this.unflagParentForSelection(valueHierarchy);
      if (deselectChilds) {
        _.each(valueHierarchy.childs, (child) => {
          var childInHierarchy = this.getValueFromHierarchy(child.facetValue)
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
    var stringValue = this.getSelf(facetValue);
    var ret = stringValue;
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
    var displayed = _.filter(this.values.getAll(), (v)=> {
      var valFromHierarchy = this.getValueFromHierarchy(v);
      if (valFromHierarchy) {
        var elem = this.getElementFromFacetValueList(v)
        return elem.style.display == 'block' || elem.style.display == '';
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
  public open(value: ValueHierarchy);
  public open(value: String);
  public open(value: any) {
    var getter;
    if (_.isString(value)) {
      getter = this.valueHierarchy[value];
    } else if (value instanceof FacetValue) {
      getter = this.valueHierarchy[value.value];
    } else {
      getter = value;
    }
    if (getter != undefined) {
      $$(this.getElementFromFacetValueList(getter.facetValue.value)).addClass('coveo-open');
      this.showChilds(getter.childs);
      if (getter.parent != undefined) {
        this.open(this.valueHierarchy[getter.facetValue.value].parent);
      }
      this.valueHierarchy[getter.facetValue.value].keepOpened = true;
    }
  }

  /**
   * Close a single value and hide all it's child
   * @param value
   */
  public close(value: FacetValue);
  public close(value: ValueHierarchy);
  public close(value: String);
  public close(value: any) {
    var getter;
    if (_.isString(value)) {
      getter = this.valueHierarchy[value];
    } else if (value instanceof FacetValue) {
      getter = this.valueHierarchy[value.value];
    } else {
      getter = value;
    }
    if (getter != undefined) {
      $$(this.getElementFromFacetValueList(getter.facetValue)).removeClass('coveo-open');
      this.hideChilds(getter.childs);
      _.each(getter.childs, (child: ValueHierarchy) => {
        this.close(this.valueHierarchy[child.facetValue.value]);
      })
      this.valueHierarchy[getter.facetValue.value].keepOpened = false;
    }
  }

  /**
   * Reset the facet state
   */
  public reset() {
    _.each(this.valueHierarchy, (valueHierarchy) => {
      valueHierarchy.hasChildSelected = false;
    })
    super.reset();
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
    this.facetSearch = new HierarchicalFacetSearch(this, HierarchicalFacetSearchValuesList);
    $(this.element).append(this.facetSearch.build());
  }

  protected handleDeferredQuerySuccess(data: IQuerySuccessEventArgs) {
    this.updateAppearanceDependingOnState();
    super.handleDeferredQuerySuccess(data);
  }

  protected handlePopulateBreadcrumb(args: IPopulateBreadcrumbEventArgs) {
    Assert.exists(args);
    if (this.values.hasSelectedOrExcludedValues()) {
      var element = new HierarchicalBreadcrumbValuesList(this, this.values.getSelected().concat(this.values.getExcluded()), this.valueHierarchy).build();
      args.breadcrumbs.push({
        element: element
      });
    }
  }

  protected handleOmniboxWithStaticValue(eventArg: IPopulateOmniboxEventArgs) {
    var regex = eventArg.completeQueryExpression.regex;
    var valueToSearch = eventArg.completeQueryExpression.word;
    var match = _.first(_.filter<ValueHierarchy>(this.valueHierarchy, (existingValue) => {
      return regex.test(this.getValueCaption(existingValue.facetValue))
    }), this.options.numberOfValuesInOmnibox)
    var facetValues = _.compact(_.map(match, (gotAMatch) => {
      var fromList = this.getFromFacetValueList(gotAMatch.facetValue);
      return fromList ? fromList.facetValue : undefined;
    }))
    var element = new OmniboxHierarchicalValuesList(this, facetValues, eventArg).build();
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
    this.crop();
  }

  protected initFacetValuesList() {
    this.facetValuesList = new HierarchicalFacetValuesList(this, HierarchicalFacetValueElement);
    $(this.element).append(this.facetValuesList.build());
  }

  protected updateMoreLess() {
    if (!this.searchInterface.isNewDesign()) {
      if (this.topLevelHierarchy.length > this.numberOfValuesToShow) {
        $$(this.moreElement).addClass('coveo-active');
      } else {
        $$(this.moreElement).removeClass('coveo-active');
      }

      if (this.numberOfValuesToShow > this.originalNumberOfValuesToShow) {
        $$(this.lessElement).show();
      } else {
        $$(this.lessElement).hide();
      }
    } else {
      var moreValuesAvailable = this.numberOfValuesToShow < this.values.getAll().length;
      if (moreValuesAvailable) {
        var renderer = new ValueElementRenderer(this, FacetValue.create(l('More')));
        var built = renderer.build().withNo([renderer.excludeIcon, renderer.icon]);
        $$(built.listElement).addClass('coveo-facet-more');
        $$(built.checkbox).on('change', ()=>this.handleClickMore());
        this.facetValuesList.valueContainer.appendChild(built.listElement);
      }
    }
  }

  protected handleClickMore(): void {
    this.numberOfValuesToShow += this.originalNumberOfValuesToShow;
    this.numberOfValuesToShow = Math.min(this.numberOfValuesToShow, this.values.size());
    if (this.searchInterface.isNewDesign()) {
      super.handleClickMore();
    } else {
      this.rebuildValueElements();
    }
  }

  protected handleClickLess() {
    if (this.searchInterface.isNewDesign()) {
      super.handleClickMore();
    } else {
      this.numberOfValuesToShow = this.originalNumberOfValuesToShow;
      this.rebuildValueElements();
    }
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
    var atLeastOneDoesNotExists = false;
    _.each(facetValues, (facetValue: FacetValue) => {
      if (this.valueHierarchy == undefined || this.valueHierarchy[facetValue.value] == undefined) {
        atLeastOneDoesNotExists = true;
      }
    })
    if (atLeastOneDoesNotExists) {
      this.processHierarchy(facetValues);
    }
  }

  private crop() {
    var partition = _.partition(this.topLevelHierarchy, (hierarchy: ValueHierarchy) => {
      return hierarchy.facetValue.selected || hierarchy.facetValue.excluded
    });

    if (!this.searchInterface.isNewDesign()) {
      _.each(_.last(partition[1], partition[1].length - (this.numberOfValuesToShow - partition[0].length)), (toHide: ValueHierarchy) => {
        $$(this.getElementFromFacetValueList(toHide.facetValue)).hide()
      })
    } else {
      _.each(partition[1], (toHide: ValueHierarchy, i: number) => {
        if (i >= this.numberOfValuesToShow && !toHide.hasChildSelected) {
          $$(this.getElementFromFacetValueList(toHide.facetValue)).hide();
        }
      });
    }
  }

  private placeChildsUnderTheirParent(hierarchy: ValueHierarchy, hierarchyElement: HTMLElement) {
    _.each(hierarchy.childs.reverse(), (child) => {
      if (this.valueHierarchy[child.facetValue.value]) {
        var childElement = this.getElementFromFacetValueList(child.facetValue);
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

  private addCssClassToParentAndChilds(hierarchy: ValueHierarchy, hierarchyElement: HTMLElement) {
    $$(hierarchyElement).addClass('coveo-has-childs');
    if (hierarchy.hasChildSelected) {
      $$(hierarchyElement).addClass('coveo-has-childs-selected');
    }
    var openAndCloseChilds = $$('div', {
      className: 'coveo-has-childs-toggle'
    }).el;

    $$(openAndCloseChilds).on('click', ()=> {
      $$(hierarchyElement).hasClass('coveo-open') ? this.close(hierarchy) : this.open(hierarchy);
    })

    $$(hierarchyElement).prepend(openAndCloseChilds);
  }

  private buildParentChildRelationship() {
    var sorted = _.chain(this.valueHierarchy)
                  .toArray()
                  .sortBy('level')
                  .value();

    _.each(<any>sorted, (hierarchy: ValueHierarchy) => {
      var hierarchyElement = this.getElementFromFacetValueList(hierarchy.facetValue);
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
    var flatHierarchy = _.map(valuesToBuildWith, (value: FacetValue) => {
      var parent = this.getParent(value);
      var self = value.lookupValue || value.value;
      return {
        facetValue: value,
        level: this.getLevel(value),
        parent: parent,
        self: self
      };
    });
    this.setInHierarchy(flatHierarchy);
    _.each(this.valueHierarchy, (valueHierarchy) => {
      if (valueHierarchy.facetValue.selected) {
        this.flagParentForSelection(valueHierarchy);
      }
    });
    return flatHierarchy;
  }

  private processHierarchy(facetValues = this.values.getAll()) {
    this.valueHierarchy = this.valueHierarchy ? this.valueHierarchy : {};
    _.each(this.valueHierarchy, (hierarchy: ValueHierarchy)=> {
      if (this.values.get(hierarchy.facetValue.value) == undefined) {
        delete this.valueHierarchy[this.getLookupOrValue(hierarchy.facetValue)];
      }
    });
    this.createHierarchy(facetValues);
  }

  private setInHierarchy(flatHierarchy: FlatHierarchy[]) {
    this.correctLevels = _.filter<FlatHierarchy>(flatHierarchy, (hierarchy) => {
      var isCorrectMinimumLevel = this.options.levelStart == undefined || hierarchy.level >= this.options.levelStart;
      var isCorrectMaximumLevel = this.options.levelEnd == undefined || hierarchy.level < this.options.levelEnd;
      return isCorrectMinimumLevel && isCorrectMaximumLevel;
    })
    _.each(this.correctLevels, (hierarchy) => {
      var childs = _.map(_.filter<FlatHierarchy>(this.correctLevels, (possibleChild) => {
        return possibleChild.parent == hierarchy.self
      }), (child): ValueHierarchy => {
        return {
          facetValue: child.facetValue,
          level: child.level,
          keepOpened: false,
          hasChildSelected: false
        }
      })

      var parent = _.find<FlatHierarchy>(this.correctLevels, (possibleParent) => {
        return possibleParent.self == hierarchy.parent
      })

      var hierarchyThatAlreadyExists = this.valueHierarchy[hierarchy.facetValue.value];
      var hierarchyThatAlreadyExistsAtParent;
      if (parent) {
        hierarchyThatAlreadyExistsAtParent = this.valueHierarchy[parent.facetValue.value]
      }
      this.valueHierarchy[hierarchy.facetValue.value] = {
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
      }
    });

    this.topLevelHierarchy = _.chain(this.values.getAll())
                              .filter((value: FacetValue)=> {
                                var fromHierarchy = this.getValueFromHierarchy(value);
                                if (fromHierarchy) {
                                  return fromHierarchy.level == (this.options.levelStart || 0 );
                                } else {
                                  return false;
                                }
                              })
                              .map((value: FacetValue)=> {
                                return this.getValueFromHierarchy(value);
                              })
                              .value()
  }

  private getParent(value: FacetValue) {
    var lastIndexOfDelimiting = this.getLookupOrValue(value).lastIndexOf(this.options.delimitingCharacter);
    if (lastIndexOfDelimiting != -1) {
      return this.getLookupOrValue(value).substring(0, lastIndexOfDelimiting);
    }
    return undefined;
  }

  private getSelf(value: FacetValue) {
    var parent = this.getParent(value);
    if (parent == undefined) {
      return this.getLookupOrValue(value)
    } else {
      var indexOfParent = this.getLookupOrValue(value).indexOf(parent);
      return this.getLookupOrValue(value).substring(indexOfParent + parent.length + 1);
    }
  }

  private showFacetValue(value: ValueHierarchy) {
    $$(this.getElementFromFacetValueList(value.facetValue.value)).removeClass('coveo-inactive');
  }

  private hideFacetValue(value: ValueHierarchy) {
    $$(this.getElementFromFacetValueList(value.facetValue.value)).addClass('coveo-inactive');
  }

  private hideChilds(children: ValueHierarchy[]) {
    _.each(children, (child) => {
      this.hideFacetValue(child);
    })
  }

  private showChilds(children: ValueHierarchy[]) {
    _.each(children, (child) => {
      this.showFacetValue(child);
    })
  }

  private hideParent(parent: ValueHierarchy) {
    if (parent) {
      this.hideFacetValue(parent);
    }
  }

  private showParent(parent: ValueHierarchy) {
    if (parent) {
      this.showFacetValue(parent);
    }
  }

  private selectChilds(parent: ValueHierarchy, children: ValueHierarchy[]) {
    this.flagParentForSelection(parent);
    this.selectMultipleValues(_.map(children, (child) => {
      return child.facetValue
    }))
  }

  private deselectChilds(parent: ValueHierarchy, children: ValueHierarchy[]) {
    parent.hasChildSelected = false;
    this.deselectMultipleValues(_.map(children, (child) => {
      return child.facetValue
    }))
  }

  private excludeChilds(children: ValueHierarchy[]) {
    this.excludeMultipleValues(_.map(children, (child) => {
      return child.facetValue
    }))
  }

  private unexcludeChilds(children: ValueHierarchy[]) {
    this.unexcludeMultipleValues(_.map(children, (child) => {
      return child.facetValue
    }))
  }

  private selectParent(parent: ValueHierarchy) {
    if (parent != undefined) {
      this.selectValue(parent.facetValue);
      if (parent.parent) {
        this.selectParent(this.valueHierarchy[parent.parent.facetValue.value])
      }
    }
  }

  private deselectParent(parent: ValueHierarchy) {
    if (parent != undefined) {
      this.deselectValue(parent.facetValue, false);
    }
  }

  private flagParentForSelection(valueHierarchy: ValueHierarchy) {
    var parent = valueHierarchy.parent;
    while (parent) {
      var parentInHierarchy = this.valueHierarchy[parent.facetValue.value];
      parentInHierarchy.hasChildSelected = true;
      parent = parentInHierarchy.parent;
    }
  }

  private unflagParentForSelection(valueHierarchy: ValueHierarchy) {
    var parent = valueHierarchy.parent;
    while (parent) {
      var parentInHierarchy = this.valueHierarchy[parent.facetValue.value]
      var otherSelectedChilds = _.filter<ValueHierarchy>(parentInHierarchy.childs, (child) => {
        var childInHierarchy = this.valueHierarchy[child.facetValue.value];
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

  private getValueFromHierarchy(value: any): ValueHierarchy {
    var getter = value instanceof FacetValue ? value.value : value;
    return this.valueHierarchy[getter];
  }

  private getFacetValueFromHierarchy(value: any): FacetValue {
    return this.getValueFromHierarchy(value).facetValue;
  }

  private getLookupOrValue(value: FacetValue) {
    return value.lookupValue || value.value;
  }

  private getElementFromFacetValueList(value: any) {
    var ret = this.getFromFacetValueList(value)
    if (ret) {
      return ret.renderer.listElement
    } else {
      return $$('div').el;
    }
  }

  private getFromFacetValueList(value: any) {
    var fromHierarchy = this.getValueFromHierarchy(value);
    if (fromHierarchy != undefined) {
      return this.facetValuesList.get(value);
    } else {
      return undefined;
    }
  }

  private getLevel(value: FacetValue) {
    return value.value.split(this.options.delimitingCharacter).length - 1
  }
}

Initialization.registerAutoCreateComponent(HierarchicalFacet);
