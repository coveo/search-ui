import { $$, Dom } from '../../../utils/Dom';
import { SVGIcons } from '../../../utils/SVGIcons';
import { IDynamicHierarchicalFacetValue, IDynamicHierarchicalFacet } from '../IDynamicHierarchicalFacet';
import { Utils } from '../../../utils/Utils';

export class DynamicHierarchicalFacetValueRenderer {
  private button: Dom;

  constructor(private facetValue: IDynamicHierarchicalFacetValue, private facet: IDynamicHierarchicalFacet) {}

  public render() {
    this.button = $$('button', {
      className: 'coveo-dynamic-hierarchical-facet-value',
      ariaLabel: this.facetValue.selectAriaLabel
    });
    this.button.on('click', () => this.selectAction());

    this.renderLabel();
    this.renderCount();
    this.toggleButtonStates();

    return $$('li', { dataValue: this.facetValue.value }, this.button).el;
  }

  private renderLabel() {
    const label = $$('span', { className: 'coveo-dynamic-hierarchical-facet-value-label', title: this.facetValue.displayValue });
    label.text(this.facetValue.displayValue);
    this.button.append(label.el);
  }

  private renderCount() {
    const count = $$('span', { className: 'coveo-dynamic-hierarchical-facet-value-count' }, `(${this.facetValue.formattedCount})`);
    this.button.append(count.el);
  }

  private toggleButtonStates() {
    this.button.toggleClass('coveo-selected', this.facetValue.isSelected);
    this.button.toggleClass('coveo-with-space', this.shouldHaveMargin);
    this.button.toggleClass('coveo-show-when-collapsed', this.shouldShowWhenCollapsed);
    this.facetValue.isSelected && this.button.setAttribute('disabled', 'true');
    this.shouldHaveBackArrow && this.prependBackArrow();
    this.shouldHaveForwardArrow && this.appendForwardArrow();
  }

  private prependBackArrow() {
    const arrowIcon = $$('div', { className: 'coveo-dynamic-hierarchical-facet-value-arrow-left' }, SVGIcons.icons.arrowDown);
    this.button.prepend(arrowIcon.el);
  }

  private appendForwardArrow() {
    const arrowIcon = $$('div', { className: 'coveo-dynamic-hierarchical-facet-value-arrow-right' }, SVGIcons.icons.arrowDown);
    this.button.append(arrowIcon.el);
  }

  private get shouldHaveMargin() {
    return !this.facetValue.isSelected && this.facetValue.path.length > 1 && !this.facetValue.children.length;
  }

  private get shouldHaveBackArrow() {
    return this.facet.values.hasSelectedValue && !this.facetValue.isSelected && !!this.facetValue.children.length;
  }

  private get shouldHaveForwardArrow() {
    return !this.facetValue.isLeafValue && !this.facetValue.isSelected && !this.facetValue.children.length;
  }

  private get shouldShowWhenCollapsed() {
    const isParentOfTheSelectedValue = Utils.arrayEqual(this.facetValue.path, this.facet.values.selectedPath.slice(0, -1));
    return this.facetValue.isSelected || isParentOfTheSelectedValue;
  }

  private selectAction() {
    this.facet.selectPath(this.facetValue.path);
    this.facet.enableFreezeFacetOrderFlag();
    this.facet.enablePreventAutoSelectionFlag();
    this.facet.scrollToTop();
    this.facet.triggerNewQuery(() => this.facetValue.logSelectActionToAnalytics());
  }
}
