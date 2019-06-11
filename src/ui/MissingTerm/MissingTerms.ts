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
  numberOfResults?: number;
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
    caption: ComponentOptions.buildLocalizedStringOption({ defaultValue: 'Missing' }),
    /**
     * The maximum number of missing term to be displayed
     *
     * **Default:** `5`
     * **Minimum value:** `1`
     */
    numberOfResults: ComponentOptions.buildNumberOption({
      defaultValue: 5,
      min: 1
    })
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
  private termForcedToAppear: Array<string> = [];

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
   * Inject a term in the advanced query.
   */
  public addTermForcedToAppear(term: string) {
    if (this.missingTerms.indexOf(term) === -1) {
      this.logger.warn(
        'The term to re-inject is not present in the missing terms',
        `You tried to inject "${term}" but the possible term to inject are: ${this.missingTerms.toString()}`,
        'The query exited the function'
      );
      return;
    }
    this.updateTermForcedToAppear();
    this.termForcedToAppear.push(term);
    this.queryStateModel.set('missingTerm', [...this.termForcedToAppear]);
  }

  private updateTermForcedToAppear() {
    this.termForcedToAppear = [...this.queryStateModel.get('missingTerm')];
  }

  private addMissingTerms() {
    if (this.missingTerms.length === 0) {
      return;
    }
    const missingTermelement = this.buildContainer().el;
    if (missingTermelement) {
      this.hideMissingTermIfNumberOfResult(missingTermelement);
      $$(this.element).append(missingTermelement);
    }
  }

  private buildContainer(): Dom {
    const resultCell = $$('div', { className: 'coveo-result-cell' }, this.buildCaption());
    this.buildMissingTerms().forEach(term => {
      if (term) {
        resultCell.append(term.el);
      }
    });
    if (resultCell.el.childElementCount > 1) {
      return $$('div', { className: 'coveo-result-row' }, resultCell);
    }
  }

  private buildCaption(): Dom {
    return $$('span', { className: 'coveo-field-caption' }, this.options.caption);
  }

  private buildMissingTerms(): Dom[] {
    const terms: Dom[] = this.missingTerms.map(term => {
      if (this.hideMissingTermifFeaturedResults(term) || this.hideMissingTermIfWildcard(term)) {
        return;
      }
      return this.makeTermClickableIfEnabled(term);
    });
    return terms;
  }

  private executeNewQuery(missingTerm: string = this.queryStateModel.get('q')) {
    this.usageAnalytics.logSearchEvent<IAnalyticsIncludeMissingTerm>(analyticsActionCauseList.missingTermClick, {
      missingTerm: missingTerm
    });
    this.queryController.executeQuery();
  }

  private makeTermClickableIfEnabled(term: string): Dom {
    if (this.options.clickable) {
      const termElement = $$('button', { className: 'coveo-missing-term clickable' }, term);
      termElement.on('click', () => {
        this.addTermForcedToAppear(term);
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

  private hideMissingTermifFeaturedResults(term: string): boolean {
    this.updateTermForcedToAppear();
    return this.termForcedToAppear.indexOf(term) !== -1;
  }

  private hideMissingTermIfWildcard(term): boolean {
    const query = this.queryStateModel.get('q');
    const regxStarWildcard = XRegExp(`(\\*${term})|${term}\\*`);
    const regxxQuestionMarkWildcard = XRegExp(`(\\?${term})|${term}\\?`);

    const foundStar = this.queryController.getLastQuery().wildcards && regxStarWildcard.test(query);
    const foundQuestionMark = this.queryController.getLastQuery().questionMark && regxxQuestionMarkWildcard.test(query);

    return foundStar || foundQuestionMark;
  }

  private hideMissingTermIfNumberOfResult(element: HTMLElement) {
    const allMissingTerms = $$(element).findAll('.coveo-missing-term');
    if (allMissingTerms.length <= this.options.numberOfResults) {
      return;
    }
    for (let index = this.options.numberOfResults; index < allMissingTerms.length; index++) {
      allMissingTerms[index].style.display = 'none';
    }
    const showMore = $$(
      'button',
      { className: 'coveo-missing-term-show-more' },
      `${allMissingTerms.length - this.options.numberOfResults} more...`
    );
    const resultCell = $$(element).find('.coveo-result-cell');
    showMore.on('click', () => {
      this.showMissingTerm();
    });
    resultCell.appendChild(showMore.el);
  }

  private showMissingTerm() {
    const showMore = $$(this.element).find('.coveo-missing-term-show-more');
    showMore.parentNode.removeChild(showMore);
    const allMissingTerms = $$(this.element).findAll('.coveo-missing-term');
    for (let index = this.options.numberOfResults; index < allMissingTerms.length; index++) {
      allMissingTerms[index].removeAttribute('style');
    }
  }
}
Initialization.registerAutoCreateComponent(MissingTerms);
