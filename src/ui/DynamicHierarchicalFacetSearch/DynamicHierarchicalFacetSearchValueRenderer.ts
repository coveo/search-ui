import { IDynamicHierarchicalFacet } from '../DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { DynamicHierarchicalFacetSearchValue } from './DynamicHierarchicalFacetSearchValue';
import { $$ } from '../../utils/Dom';

const PATH_START_LENGTH = 1;
const PATH_END_LENGTH = 2;
const PATH_SEPARATOR = '/';

export class DynamicHierarchicalFacetSearchValueRenderer {
  constructor(private facetValue: DynamicHierarchicalFacetSearchValue, private facet: IDynamicHierarchicalFacet) {}

  private get pathToRender() {
    const fullPath = this.facetValue.fullPath;
    if (fullPath.length > PATH_START_LENGTH + PATH_END_LENGTH) {
      return [...fullPath.slice(0, PATH_START_LENGTH), '...', ...fullPath.slice(-PATH_END_LENGTH)];
    }
    return fullPath;
  }

  public render() {
    const element = $$('div', { className: 'coveo-dynamic-hierarchical-facet-search-value' }, this.renderHeader(), this.renderPath());

    return element.el;
  }

  public selectAction() {
    this.facet.selectPath(this.facetValue.fullPath);
    this.facet.enableFreezeFacetOrderFlag();
    this.facet.enablePreventAutoSelectionFlag();
    this.facet.scrollToTop();
    this.facet.triggerNewQuery(() => this.facetValue.logSelectActionToAnalytics());
  }

  private renderHeader() {
    return $$(
      'span',
      { className: 'coveo-dynamic-hierarchical-facet-search-value-header', ariaHidden: true },
      this.renderLabel(),
      this.renderResultsCount()
    );
  }

  private renderLabel() {
    return $$('span', { className: 'coveo-dynamic-hierarchical-facet-search-value-label' }, this.facetValue.displayValue);
  }

  private renderResultsCount() {
    const element = $$('span', { className: 'coveo-dynamic-hierarchical-facet-search-value-results-count' });
    element.text(`(${this.facetValue.numberOfResults})`);
    return element;
  }

  private renderPath() {
    const element = $$('ul', { className: 'coveo-dynamic-hierarchical-facet-search-value-path', ariaHidden: true });
    this.pathToRender.forEach((part, index) => {
      if (index > 0) {
        element.append(this.renderPathSeparator().el);
      }
      element.append(this.renderPathPart(part).el);
    });
    return element;
  }

  private renderPathPart(part: string) {
    const element = $$('li', { className: 'coveo-dynamic-hierarchical-facet-search-value-path-part' });
    element.text(part);
    return element;
  }

  private renderPathSeparator() {
    return $$('span', { className: 'coveo-dynamic-hierarchical-facet-search-value-path-separator', role: 'separator' }, PATH_SEPARATOR);
  }
}
