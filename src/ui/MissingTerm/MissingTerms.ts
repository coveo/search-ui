import 'styling/_MissingTerms';
import { exportGlobally } from '../../GlobalExports';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { each } from 'underscore';
import { $$, Initialization } from '../../Core';
import { Dom } from '../../utils/Dom';
import { analyticsActionCauseList, IAnalyticsIncludeMissingTerm } from '../Analytics/AnalyticsActionListMeta';

export interface IMissingTermsOptions {
  caption?: string;
  clickable?: boolean;
}

/**
 * This [result template component](https://docs.coveo.com/en/513/#using-result-template-components) renders a list of query keywords
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
  /**
   * Creates a new `MissingTerms` component instance.
   * @param element The element on which to instantiate the component.
   * @param options The configuration options for the component.
   * @param bindings The bindings required by the component to function normally. If not set, these will be automatically resolved (with a slower execution time).
   * @param result The query result item to associate the component with.
   */

  private wordBoundary = "[\\.\\-\\u2011\\s~=,.\\|\\/:'`’;_()!?&+]";
  constructor(public element: HTMLElement, public options?: IMissingTermsOptions, bindings?: IComponentBindings, public result?) {
    super(element, MissingTerms.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, MissingTerms, options);
    this.addMissingTerms();
  }
  /**
   *
   *
   */
  public get missingTerms(): string[] {
    let cleanMissingTerms: string[] = [];
    each(this.result.absentTerms, (term: string) => {
      const regex = new RegExp(`${this.wordBoundary}${term}${this.wordBoundary}`);
      if (regex.test(this.result.state.q)) {
        cleanMissingTerms.push(term);
      }
    });
    return cleanMissingTerms;
  }
  /**
   * @param term : The `string` to be re-injected in the query as exact match
   *
   * Re-injects a term as an exact phrase match expression in the query.
   */
  public includeTermInQuery(term: string) {
    let newQuery: string = this.queryStateModel.get('q');
    const regex = new RegExp(`${this.wordBoundary}${term}${this.wordBoundary}`, 'g');
    let results;
    while ((results = regex.exec(newQuery)) !== null) {
      newQuery = [newQuery.slice(0, ++results.index), '"', term, '"', newQuery.slice(results.index + term.length)].join('');
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
