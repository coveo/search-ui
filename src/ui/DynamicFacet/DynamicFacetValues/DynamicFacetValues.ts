import 'styling/DynamicFacet/_DynamicFacetValues';
import { $$ } from '../../../utils/Dom';
import { findWhere, find, escape } from 'underscore';
import { DynamicFacetValue } from './DynamicFacetValue';
import { IFacetResponse } from '../../../rest/Facet/FacetResponse';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';
import { l } from '../../../strings/Strings';
import { IDynamicFacet, IValueCreator, IDynamicFacetValue, IDynamicFacetValues } from '../IDynamicFacet';
import { DynamicFacetValueShowMoreLessButton } from './DynamicFacetValueMoreLessButton';
import { Utils } from '../../../utils/Utils';
import { getDynamicFacetHeaderId } from '../DynamicFacetHeader/DynamicFacetHeader';

export interface IDynamicFacetValueCreatorKlass {
  new (facet: IDynamicFacet): IValueCreator;
}

export class DynamicFacetValues implements IDynamicFacetValues {
  private facetValues: IDynamicFacetValue[];
  private list = $$('ul', { className: 'coveo-dynamic-facet-values', 'aria-labelledby': getDynamicFacetHeaderId(this.facet.options.id) })
    .el;
  private valueCreator: IValueCreator;

  constructor(private facet: IDynamicFacet, creatorKlass: IDynamicFacetValueCreatorKlass) {
    this.valueCreator = new creatorKlass(this.facet);
    this.resetValues();
  }

  public createFromResponse(response: IFacetResponse) {
    this.facetValues = response.values.map((facetValue, index) => this.valueCreator.createFromResponse(facetValue, index));
  }

  public reorderValues(order: string[]) {
    this.facetValues = Utils.reorderValuesByKeys(this.facetValues, order, value => value.value);
  }

  public resetValues() {
    this.facetValues = this.valueCreator.getDefaultValues();
  }

  public get allFacetValues() {
    return this.facetValues;
  }

  public get allValues() {
    return this.facetValues.map(facetValue => facetValue.value);
  }

  public get selectedValues() {
    return this.facetValues.filter(value => value.isSelected).map(({ value }) => value);
  }

  private get selectedDisplayValues() {
    return this.facetValues.filter(value => value.isSelected).map(({ displayValue }) => displayValue);
  }

  public get activeValues() {
    return this.facetValues.filter(value => !value.isIdle);
  }

  private get displayedValues() {
    return this.facetValues.filter(value => !value.isIdle || value.numberOfResults > 0);
  }

  public get hasSelectedValues() {
    return !!findWhere(this.facetValues, { state: FacetValueState.selected });
  }

  public get hasActiveValues() {
    return !!this.activeValues.length;
  }

  public get hasIdleValues() {
    return !!findWhere(this.facetValues, { state: FacetValueState.idle });
  }

  public clearAll() {
    this.facetValues.forEach(value => value.deselect());
  }

  public get hasValues() {
    return !!this.allFacetValues.length;
  }

  public get hasDisplayedValues() {
    return !!this.displayedValues.length;
  }

  public hasSelectedValue(arg: string | DynamicFacetValue) {
    const value = typeof arg === 'string' ? arg : arg.value;
    const foundValue = find(this.facetValues, facetValue => facetValue.equals(value));
    return foundValue && foundValue.isSelected;
  }

  public get(arg: string | DynamicFacetValue) {
    const value = typeof arg === 'string' ? arg : arg.value;
    const facetValue = find(this.facetValues, facetValue => facetValue.equals(value));

    if (facetValue) {
      return facetValue;
    }

    const newFacetValue = this.valueCreator.createFromValue(value);
    if (!newFacetValue) {
      return null;
    }

    this.facetValues.push(newFacetValue);
    return newFacetValue;
  }

  private buildShowLess() {
    const showLess = new DynamicFacetValueShowMoreLessButton({
      className: 'coveo-dynamic-facet-show-less',
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
      className: 'coveo-dynamic-facet-show-more',
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
    const hasMoreValuesThenDefault = this.facetValues.length > this.facet.options.numberOfValues;

    return hasMoreValuesThenDefault && this.hasIdleValues;
  }

  private appendShowMoreLess(fragment: DocumentFragment) {
    if (!this.facet.options.enableMoreLess) {
      return;
    }

    if (this.shouldEnableShowLess) {
      fragment.appendChild(this.buildShowLess());
    }

    if (this.facet.moreValuesAvailable) {
      fragment.appendChild(this.buildShowMore());
    }
  }

  private appendSelectedCollapsedValues(fragment: DocumentFragment) {
    if (!this.hasSelectedValues) {
      return;
    }

    const selectedValues = this.selectedDisplayValues.join(', ');
    fragment.appendChild(
      $$(
        'li',
        {
          className: 'coveo-dynamic-facet-collapsed-values',
          ariaLabel: `${l('CurrentSelections')}: ${selectedValues}`
        },
        escape(selectedValues)
      ).el
    );
  }

  public render() {
    const fragment = document.createDocumentFragment();
    $$(this.list).empty();

    this.displayedValues.forEach(facetValue => {
      fragment.appendChild(facetValue.renderedElement);
    });

    this.appendShowMoreLess(fragment);

    this.appendSelectedCollapsedValues(fragment);

    this.list.appendChild(fragment);
    return this.list;
  }
}
