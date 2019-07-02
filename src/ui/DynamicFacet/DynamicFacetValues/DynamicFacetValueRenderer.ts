import { $$, Dom } from '../../../utils/Dom';
import { DynamicFacet } from '../DynamicFacet';
import { DynamicFacetValue } from './DynamicFacetValue';
import { Checkbox } from '../../FormWidgets/Checkbox';
import { l } from '../../../strings/Strings';
import { analyticsActionCauseList } from '../../Analytics/AnalyticsActionListMeta';
import { FacetValueState } from '../../../rest/Facet/FacetValueState';

export class DynamicFacetValueRenderer {
  private dom: Dom;
  private checkbox: Checkbox;
  private isInSearch = false;

  constructor(private facetValue: DynamicFacetValue, private facet: DynamicFacet) {}

  public enableIsInSearchFlag() {
    this.isInSearch = true;
  }

  public render() {
    this.dom = $$('li', {
      className: 'coveo-dynamic-facet-value coveo-dynamic-facet-selectable',
      dataValue: this.facetValue.value
    });

    if (this.isInSearch) {
      this.dom.setAttribute('id', `coveo-dynamic-facet-search-result-${this.facetValue.position}`);
    }

    this.createCheckbox();
    this.dom.append(this.checkbox.getElement());

    this.addFocusAndBlurEventListeners();

    this.toggleSelectedClass();

    return this.dom.el;
  }

  private toggleSelectedClass() {
    this.dom.toggleClass('coveo-selected', this.facetValue.isSelected);
  }

  private createCheckbox() {
    this.checkbox = new Checkbox(
      () => this.selectAction(),
      this.facetValue.valueCaption,
      this.ariaLabel,
      `(${this.facetValue.formattedCount})`
    );

    const label = $$(this.checkbox.getElement()).find('.coveo-checkbox-span-label');
    const labelSuffix = $$(this.checkbox.getElement()).find('.coveo-checkbox-span-label-suffix');

    if (label && labelSuffix) {
      label.setAttribute('title', this.facetValue.valueCaption);
      label.setAttribute('aria-hidden', 'true');
      labelSuffix.setAttribute('aria-hidden', 'true');
    }

    this.facetValue.isSelected && this.checkbox.select(false);
  }

  private addFocusAndBlurEventListeners() {
    const checkboxButton = $$(this.checkbox.getElement()).find('button');

    $$(checkboxButton).on('focusin', () => this.onFocusIn());
    $$(checkboxButton).on('focusout', () => this.onFocusOut());
  }

  private onFocusIn() {
    if (this.isInSearch) {
      this.dom.setAttribute('aria-selected', 'true');
      this.facet.updateSearchActiveDescendant(this.dom.getAttribute('id'));
    }
    this.dom.addClass('coveo-focused');
  }

  private onFocusOut() {
    this.isInSearch && this.dom.setAttribute('aria-selected', 'false');
    this.dom.removeClass('coveo-focused');
  }

  private selectAction = () => {
    this.facet.pinFacetPosition();
    this.facet.toggleSelectValue(this.facetValue.value);
    this.toggleSelectedClass();
    this.isInSearch && this.facet.clearSearch();
    !this.isInSearch && this.facet.enableFreezeCurrentValuesFlag();
    this.facet.enableFreezeFacetOrderFlag();
    this.facet.triggerNewQuery(() => this.logActionToAnalytics());
  };

  private logActionToAnalytics() {
    const action =
      this.facetValue.state === FacetValueState.selected
        ? analyticsActionCauseList.dynamicFacetSelect
        : analyticsActionCauseList.dynamicFacetDeselect;

    this.facet.logAnalyticsEvent(action, this.facetValue.analyticsMeta);
  }

  private get ariaLabel() {
    const selectOrUnselect = !this.facetValue.isSelected ? 'SelectValueWithResultCount' : 'UnselectValueWithResultCount';
    const resultCount = l('ResultCount', this.facetValue.formattedCount);

    return `${l(selectOrUnselect, this.facetValue.valueCaption, resultCount)}`;
  }
}
