import { $$, Dom } from '../../../utils/Dom';
import { SVGIcons } from '../../../utils/SVGIcons';
import { SVGDom } from '../../../utils/SVGDom';
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
    this.shouldHaveArrow && this.prependArrow();
  }

  private prependArrow() {
    const arrowIcon = $$('div', { className: 'coveo-dynamic-hierarchical-facet-value-arrow' }, SVGIcons.icons.arrowDown);
    SVGDom.addClassToSVGInContainer(arrowIcon.el, 'coveo-dynamic-hierarchical-facet-value-arrow-svg');
    this.button.prepend(arrowIcon.el);
  }

  private get shouldHaveMargin() {
    return !this.facetValue.isSelected && this.facetValue.path.length > 1 && !this.facetValue.children.length;
  }

  private get shouldHaveArrow() {
    return this.facet.values.hasSelectedValue && !this.facetValue.isSelected && !!this.facetValue.children.length;
  }

  private get shouldShowWhenCollapsed() {
    return Utils.arrayEqual(this.facetValue.path, this.facet.values.selectedPath.slice(0, -1));
  }

  private selectAction() {
    this.facet.selectPath(this.facetValue.path);
    this.facet.enableFreezeFacetOrderFlag();
    this.facet.enablePreventAutoSelectionFlag();
    this.facet.scrollToTop();
    this.facet.triggerNewQuery(() => this.facetValue.logSelectActionToAnalytics());
  }
}
