import { IDynamicHierarchicalFacet } from '../DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { DynamicHierarchicalFacetSearchValue } from './DynamicHierarchicalFacetSearchValue';
import { $$ } from '../../utils/Dom';
import { l } from '../../strings/Strings';

const PATH_START_LENGTH = 1;
const PATH_END_LENGTH = 2;
const PATH_SEPARATOR = '/';

export class DynamicHierarchicalFacetSearchValueRenderer {
  constructor(private facetValue: DynamicHierarchicalFacetSearchValue, private facet: IDynamicHierarchicalFacet) {}

  private get pathToRender(): { start: string[]; end?: string[] } {
    const parentPath = this.facetValue.fullPath.slice(0, -1);
    if (!parentPath.length) {
      return { start: [this.facet.options.clearLabel] };
    }
    if (parentPath.length > PATH_START_LENGTH + PATH_END_LENGTH) {
      return { start: parentPath.slice(0, PATH_START_LENGTH), end: parentPath.slice(-PATH_END_LENGTH) };
    }
    return { start: parentPath };
  }

  private get label() {
    const { start, end } = this.pathToRender;
    return l(
      'HierarchicalFacetValueIndentedUnder',
      l(
        'SelectValueWithResultCount',
        this.facetValue.displayValue,
        l('ResultCount', this.facetValue.numberOfResults, this.facetValue.numberOfResults)
      ),
      [...start, ...(end || [])].reverse().join(', ')
    );
  }

  public render() {
    const element = $$(
      'div',
      { className: 'coveo-dynamic-hierarchical-facet-search-value', ariaLabel: this.label },
      this.renderHeader(),
      this.renderPath()
    );

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
      'header',
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
    const { start, end } = this.pathToRender;
    start.forEach((part, index) => {
      if (index > 0) {
        element.append(this.renderPathSeparator().el);
      }
      element.append(this.renderPathPart(part).el);
    });
    if (end) {
      element.append(this.renderPathSeparator().el);
      element.append(this.renderEllipsis().el);
      end.forEach(part => {
        element.append(this.renderPathSeparator().el);
        element.append(this.renderPathPart(part).el);
      });
    }
    return element;
  }

  private renderEllipsis() {
    return $$('li', { className: 'coveo-dynamic-hierarchical-facet-search-value-path-ellipsis' }, '...');
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
