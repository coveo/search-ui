import 'styling/_MissingTerms';
import { exportGlobally } from '../../GlobalExports';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { $$, Initialization } from '../../Core';
import { Dom } from '../../utils/Dom';
import { analyticsActionCauseList, IAnalyticsIncludeMissingTerm } from '../Analytics/AnalyticsActionListMeta';
import { IQueryResult } from '../../rest/QueryResult';
import XRegExp = require('xregexp');

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

  /* Used to split terms and phrases. Match characters that can separate words or caracter for chinese, japanese and korean.
  * Han: Unicode script for chinesse caracter
  * We only need to import 1 asian script because what is important here is the space between the caracter and any script will contain it
  */
  private wordBoundary = '(([\\p{Han}])?([^(\\p{Latin}-)])|^|$)';

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
      const regex = this.createWordBoundryDelimitedRegex(term);
      return regex.test(this.queryStateModel.get('q'));
    });
  }
  /**
   * Re-injects a term as an exact phrase match expression in the query.
   */
  public includeTermInQuery(term: string) {
    if (this.missingTerms.indexOf(term) === -1) {
      this.logger.warn(
        'The term to re-inject is not present in the missing terms',
        `You tried to inject "${term}" but the possible term to inject are: ${this.missingTerms.toString()}`
      );
      return;
    }

    let newQuery: string = this.queryStateModel.get('q');
    const regex = this.createWordBoundryDelimitedRegex(term);
    let stillhasResults = true;
    while (stillhasResults) {
      const results = regex.exec(newQuery);
      stillhasResults = results !== null;
      if (stillhasResults) {
        const offset = results[0].indexOf(term);
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
      return this.makeTermClickableIfEnabled(term);
    });
    return terms;
  }

  private executeNewQuery(missingTerm: string) {
    this.usageAnalytics.logSearchEvent<IAnalyticsIncludeMissingTerm>(analyticsActionCauseList.missingTermClick, {
      missingTerm: missingTerm
    });
    this.queryController.executeQuery();
  }

  private makeTermClickableIfEnabled(term: string): Dom {
    if (this.options.clickable) {
      const termElement = $$('button', { className: 'coveo-missing-term clickable' }, term);
      termElement.on('click', () => {
        this.includeTermInQuery(term);
        this.executeNewQuery(term);
      });
      return termElement;
    } else {
      return $$('span', { className: 'coveo-missing-term' }, term);
    }
  }

  private createWordBoundryDelimitedRegex(term: string): RegExp {
    return XRegExp(`${this.wordBoundary}(${term})${this.wordBoundary}`, 'g');
  }
}
Initialization.registerAutoCreateComponent(MissingTerms);
