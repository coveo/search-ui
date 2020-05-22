import { IDynamicHierarchicalFacet } from '../DynamicHierarchicalFacet/IDynamicHierarchicalFacet';
import { DynamicHierarchicalFacetSearchValue } from './DynamicHierarchicalFacetSearchValue';
import { $$ } from '../../utils/Dom';
import { l } from '../../strings/Strings';

const PATH_START_LENGTH = 1;
const PATH_END_LENGTH = 2;
const PATH_SEPARATOR = '/';

const VALUE_CLASSNAME = 'coveo-dynamic-hierarchical-facet-search-value';
const HEADER_CLASSNAME = `${VALUE_CLASSNAME}-header`;
const LABEL_CLASSNAME = `${VALUE_CLASSNAME}-label`;
const COUNT_CLASSNAME = `${VALUE_CLASSNAME}-results-count`;
const PATH_CLASSNAME = `${VALUE_CLASSNAME}-path`;
const PATH_ELLIPSIS_CLASSNAME = `${PATH_CLASSNAME}-ellipsis`;
const PATH_PART_CLASSNAME = `${PATH_CLASSNAME}-part`;
const PATH_SEPARATOR_CLASSNAME = `${PATH_CLASSNAME}-separator`;

export const DynamicHierarchicalFacetSearchValueRendererClassNames = {
  VALUE_CLASSNAME,
  HEADER_CLASSNAME,
  LABEL_CLASSNAME,
  COUNT_CLASSNAME,
  PATH_CLASSNAME,
  PATH_ELLIPSIS_CLASSNAME,
  PATH_PART_CLASSNAME,
  PATH_SEPARATOR_CLASSNAME
};

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
    const element = $$('div', { className: VALUE_CLASSNAME, ariaLabel: this.label }, this.renderHeader(), this.renderPath());

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
    return $$('header', { className: HEADER_CLASSNAME, ariaHidden: true }, this.renderLabel(), this.renderResultsCount());
  }

  private renderLabel() {
    return $$('span', { className: LABEL_CLASSNAME }, this.facetValue.displayValue);
  }

  private renderResultsCount() {
    const element = $$('span', { className: COUNT_CLASSNAME });
    element.text(`(${this.facetValue.numberOfResults})`);
    return element;
  }

  private renderPath() {
    const element = $$('ul', { className: PATH_CLASSNAME, ariaHidden: true });
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
    return $$('li', { className: PATH_ELLIPSIS_CLASSNAME }, '...');
  }

  private renderPathPart(part: string) {
    const element = $$('li', { className: PATH_PART_CLASSNAME });
    element.text(part);
    return element;
  }

  private renderPathSeparator() {
    return $$('span', { className: PATH_SEPARATOR_CLASSNAME, role: 'separator' }, PATH_SEPARATOR);
  }
}
