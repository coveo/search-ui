import 'styling/DynamicHierarchicalFacet/_DynamicHierarchicalFacetValues';
import { IFacetResponse, IFacetResponseValue } from '../../../rest/Facet/FacetResponse';
import { DynamicHierarchicalFacetValue } from './DynamicHierarchicalFacetValue';
import { FacetUtils } from '../../Facet/FacetUtils';
import { $$ } from '../../../utils/Dom';
import { find } from 'underscore';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { Utils } from '../../../utils/Utils';
import { l } from '../../../strings/Strings';
import { DynamicFacetValueShowMoreLessButton } from '../../DynamicFacet/DynamicFacetValues/DynamicFacetValueMoreLessButton';
import { IDynamicHierarchicalFacetValues, IDynamicHierarchicalFacet, IDynamicHierarchicalFacetValue } from '../IDynamicHierarchicalFacet';

export class DynamicHierarchicalFacetValues implements IDynamicHierarchicalFacetValues {
  private facetValues: IDynamicHierarchicalFacetValue[] = [];
  private _selectedPath: string[] = [];
  private list = $$('ul', { className: 'coveo-dynamic-hierarchical-facet-values' }).el;

  constructor(private facet: IDynamicHierarchicalFacet) {}

  private formatDisplayValue(value: string) {
    let returnValue = FacetUtils.tryToGetTranslatedCaption(<string>this.facet.options.field, value);
    return this.facet.options.valueCaption[value] || returnValue;
  }

  public createFromResponse(response: IFacetResponse) {
    this.facetValues = response.values.map(responseValue => this.createFacetValueFromResponse(responseValue));
  }

  private createFacetValueFromResponse(responseValue: IFacetResponseValue, path: string[] = []): IDynamicHierarchicalFacetValue {
    const newPath = [...path, responseValue.value];
    const displayValue = FacetUtils.getDisplayValueFromValueCaption(
      responseValue.value,
      this.facet.options.field as string,
      this.facet.options.valueCaption
    );
    const children = responseValue.children
      ? responseValue.children.map(responseValue => this.createFacetValueFromResponse(responseValue, newPath))
      : [];

    if (responseValue.state === FacetValueState.selected) {
      this._selectedPath = newPath;
    }

    return new DynamicHierarchicalFacetValue(
      {
        value: responseValue.value,
        numberOfResults: responseValue.numberOfResults,
        state: responseValue.state,
        moreValuesAvailable: responseValue.moreValuesAvailable,
        path: newPath,
        displayValue,
        children
      },
      this.facet
    );
  }

  public get allFacetValues() {
    return this.facetValues;
  }

  public get hasSelectedValue() {
    return !!this._selectedPath.length;
  }

  public get selectedPath() {
    return [...this._selectedPath];
  }

  public resetValues() {
    this.facetValues = [];
    this._selectedPath = [];
  }

  public clearPath() {
    this._selectedPath = [];
  }

  private findValueWithPath(path: string[]) {
    let facetValues = this.facetValues;
    let facetValue: IDynamicHierarchicalFacetValue;
    let remainingPath = [...path];

    do {
      const value = remainingPath.shift();
      facetValue = find(facetValues, facetValue => facetValue.value === value);

      if (!facetValue) {
        return null;
      }
      facetValues = facetValue.children;
    } while (remainingPath.length);

    return facetValue;
  }

  private createFacetValueWithPath(path: string[], children: IDynamicHierarchicalFacetValue[] = []): IDynamicHierarchicalFacetValue {
    const value = path[path.length - 1];
    return new DynamicHierarchicalFacetValue(
      {
        value,
        path,
        displayValue: this.formatDisplayValue(value),
        numberOfResults: 0,
        state: FacetValueState.idle,
        moreValuesAvailable: false,
        children
      },
      this.facet
    );
  }

  private getOrCreateFacetValueWithPath(path: string[]) {
    const existingFacetValue = this.findValueWithPath(path);
    if (existingFacetValue) {
      return existingFacetValue;
    }

    const newFacetValue = this.createFacetValueWithPath(path);
    const siblingValues = path.length === 1 ? this.facetValues : this.getOrCreateFacetValueWithPath(path.slice(0, -1)).children;

    siblingValues.push(newFacetValue);
    return newFacetValue;
  }

  private filterHierarchyAtPathLevel(facetValues: IDynamicHierarchicalFacetValue[], path: string[], level = 1) {
    const filteredFacetValues = facetValues.filter(facetValue => {
      const targetPath = path.slice(0, level);
      return Utils.arrayEqual(targetPath, facetValue.path);
    });

    filteredFacetValues.forEach(facetValue => {
      facetValue.state = FacetValueState.idle;
      facetValue.children = this.filterHierarchyAtPathLevel(facetValue.children, path, level + 1);
    });

    return filteredFacetValues;
  }

  private filterHierarchyWithPath(path: string[]) {
    this.facetValues = this.filterHierarchyAtPathLevel(this.facetValues, path);
  }

  public selectPath(path: string[]) {
    this.filterHierarchyWithPath(path);
    this.getOrCreateFacetValueWithPath(path).select();
    this._selectedPath = [...path];
  }

  private prependAllCategories() {
    const clear = $$(
      'li',
      {},
      $$(
        'button',
        { className: 'coveo-dynamic-hierarchical-facet-all', title: this.facet.options.clearLabel },
        this.facet.options.clearLabel
      )
    );
    clear.on('click', () => this.facet.header.options.clear());
    $$(this.list).prepend(clear.el);
  }

  private buildShowLess() {
    const showLess = new DynamicFacetValueShowMoreLessButton({
      className: 'coveo-dynamic-hierarchical-facet-show-less',
      ariaLabel: l('ShowLessFacetResults', this.facet.options.title),
      label: l('ShowLess'),
      action: () => {
        this.facet.enableFreezeFacetOrderFlag();
        this.facet.showLessValues();
      }
    });

    return showLess.element;
  }

  private buildShowMore() {
    const showMore = new DynamicFacetValueShowMoreLessButton({
      className: 'coveo-dynamic-hierarchical-facet-show-more',
      ariaLabel: l('ShowMoreFacetResults', this.facet.options.title),
      label: l('ShowMore'),
      action: () => {
        this.facet.enableFreezeFacetOrderFlag();
        this.facet.showMoreValues();
      }
    });

    return showMore.element;
  }

  private get shouldEnableShowLess() {
    return this.facetValues.length > this.facet.options.numberOfValues;
  }

  private get shouldEnableShowMore() {
    return this.facet.moreValuesAvailable && !this.hasSelectedValue;
  }

  private appendShowMoreLess(fragment: DocumentFragment) {
    if (!this.facet.options.enableMoreLess) {
      return;
    }

    if (this.shouldEnableShowLess) {
      fragment.appendChild(this.buildShowLess());
    }

    if (this.shouldEnableShowMore) {
      fragment.appendChild(this.buildShowMore());
    }
  }

  public render() {
    const fragment = document.createDocumentFragment();
    $$(this.list).empty();

    this.facetValues.forEach(facetValue => {
      facetValue.render(fragment);
    });

    $$(this.list).toggleClass('coveo-with-space', !!this._selectedPath.length);
    this._selectedPath.length && this.prependAllCategories();

    this.appendShowMoreLess(fragment);

    this.list.appendChild(fragment);
    return this.list;
  }
}
