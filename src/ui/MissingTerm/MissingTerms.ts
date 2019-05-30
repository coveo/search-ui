import 'styling/_MissingTerms';
import { exportGlobally } from '../../GlobalExports';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { $$, Initialization } from '../../Core';
import { Dom } from '../../utils/Dom';
import { analyticsActionCauseList, IAnalyticsIncludeMissingTerm } from '../Analytics/AnalyticsActionListMeta';
import { IQueryResult } from '../../rest/QueryResult';

export interface IMissingTermsOptions {
  caption?: string;
  clickable?: boolean;
}

/**
 * This [result template component](https://docs.coveo.com/en/513/#using-result-template-components) renders a list of query terms
 * that were not matched by its associated result item.
 */
export class MissingTerms extends Component {
  static ID = 'MissingTerms';
  static options: IMissingTermsOptions = {
    /**
     * Whether to allow the end-user to click a missing term to re-inject it in the query as
     * an exact phrase match (i.e., as an expression between double quote characters).
     *
     * **Default:** `true`
     */
    clickable: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * The text to display before missing terms.
     *
     * **Default:** The localized string for `Missing`.
     */
    caption: ComponentOptions.buildLocalizedStringOption({ defaultValue: 'Missing' })
  };

  static doExport = () => {
    exportGlobally({
      MissingTerms: MissingTerms
    });
  };
  // \u2011: http://graphemica.com/%E2%80%91
  // Used to split terms and phrases. Should match characters that can separate words.
  private wordBoundary = "(|^|[\\.\\-\\u2011\\s~=,.\\|\\/:'`’;_()!?&+])";

  /**
   * Creates a new `MissingTerms` component instance.
   * @param element The element on which to instantiate the component.
   * @param options The configuration options for the component.
   * @param bindings The bindings required by the component to function normally. If not set, these will be automatically resolved (with a slower execution time).
   * @param result The query result item to associate the component with.
   */
  constructor(
    public element: HTMLElement,
    public options?: IMissingTermsOptions,
    bindings?: IComponentBindings,
    public result?: IQueryResult
  ) {
    super(element, MissingTerms.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, MissingTerms, options);
    this.addMissingTerms();
  }
  /**
   *Returns all original basic query expression terms that were not matched by the result item the component instance is associated with.
   */
  public get missingTerms(): string[] {
    return this.result.absentTerms.filter(term => {
      const regex = new RegExp(`${this.wordBoundary}${term}${this.wordBoundary}`);
      const a = this.queryStateModel.get('q');
      return regex.test(a);
    });
  }
  /**
   * @param term : The `string` to be re-injected in the query as exact match
   *
   * Re-injects a term as an exact phrase match expression in the query.
   */
  public includeTermInQuery(term: string) {
    if (this.missingTerms.indexOf(term) === -1) {
      return;
    }

    let newQuery: string = this.queryStateModel.get('q');
    const regex = new RegExp(`${this.wordBoundary}${term}${this.wordBoundary}`, 'g');
    let stillhasResults = true;
    let results: RegExpExecArray;
    while (stillhasResults) {
      results = regex.exec(newQuery);
      stillhasResults = results !== null;
      if (stillhasResults) {
        const offset = results[1].length + results[2].length;
        newQuery = [newQuery.slice(0, results.index + offset), '"', term, '"', newQuery.slice(results.index + term.length + offset)].join(
          ''
        );
      }
    }
    this.queryStateModel.set('q', newQuery);
  }

  private addMissingTerms() {
    if (this.missingTerms.length === 0) {
      return;
    }
    $$(this.element).append(this.buildContainer().el);
  }

  private buildContainer(): Dom {
    const resultCell = $$('div', { className: 'coveo-result-cell' }, this.buildCaption());
    this.buildMissingTerms().forEach(term => {
      resultCell.append(term.el);
    });

    return $$('div', { className: 'coveo-result-row' }, resultCell);
  }

  private buildCaption(): Dom {
    return $$('span', { className: 'coveo-field-caption' }, this.options.caption);
  }

  private buildMissingTerms(): Dom[] {
    const terms: Dom[] = this.missingTerms.map(term => {
      return this.clickableButtonIfEnable(term);
    });
    return terms;
  }

  private executeNewQuery(missingTerm: string) {
    this.usageAnalytics.logSearchEvent<IAnalyticsIncludeMissingTerm>(analyticsActionCauseList.missingTermsSearch, {
      missingTerm: missingTerm
    });
    this.queryController.executeQuery();
  }

  private clickableButtonIfEnable(term: string): Dom {
    if (this.options.clickable) {
      const termElement = $$('button', { className: 'coveo-missing-term' }, term);
      termElement.on('click', () => {
        this.includeTermInQuery(term);
        this.executeNewQuery(term);
      });
      termElement.addClass('clickable');
      return termElement;
    } else {
      return $$('span', { className: 'coveo-missing-term' }, term);
    }
  }
}
Initialization.registerAutoCreateComponent(MissingTerms);
