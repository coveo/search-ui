import 'styling/_MissingTerms';
import { exportGlobally } from '../../GlobalExports';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { $$, Initialization, l } from '../../Core';
import { Dom } from '../../utils/Dom';
import { analyticsActionCauseList, IAnalyticsIncludeMissingTerm } from '../Analytics/AnalyticsActionListMeta';
import { IQueryResult } from '../../rest/QueryResult';
import XRegExp = require('xregexp');

export interface IMissingTermsOptions {
  caption?: string;
  clickable?: boolean;
  numberOfTerms?: number;
}

/**
 * This [result template component](https://docs.coveo.com/en/513/#using-result-template-components) renders a list of query terms
 * that were not matched by the associated result item.
 */
export class MissingTerms extends Component {
  static ID = 'MissingTerms';

  /**
   * @componentOptions
   */
  static options: IMissingTermsOptions = {
    /**
     * Whether to allow the end-user to click a missing term to filter out items that do not match this term.
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
    numberOfTerms: ComponentOptions.buildNumberOption({
      defaultValue: 5,
      min: 1
    })
  };

  static doExport = () => {
    exportGlobally({
      MissingTerms: MissingTerms
    });
  };

  // Used to split terms and phrases. Match character that can separate words or caracter for Chinese, Japanese and Korean.
  // Han: Unicode script for Chinesse character
  // We only need to import 1 Asian, charcaters script because what is important here is the space between the caracter and any script will contain it
  private wordBoundary = '(([\\p{Han}])?([^(\\p{Latin}-)])|^|$)';
  private termForcedToAppear: string[];

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
      const regex = this.createWordBoundaryDelimitedRegex(term);
      return regex.test(this.queryStateModel.get('q'));
    });
  }

  /**
   * Injects a term in the advanced part of the query expression (aq) to filter out items that do not match the term.
   * @param term The term to add to the advanced query expression.
   */
  public addTermForcedToAppear(term: string) {
    if (this.missingTerms.indexOf(term) === -1) {
      this.logger.warn(
        `Method execution aborted because the term to inject in aq ("${term}") is not a missing term.`,
        `Allowed missing terms: ${this.missingTerms.toString()}.`
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
    const missingTermElement = this.buildContainer();
    if (missingTermElement.length > 1) {
      this.hideMissingTermsOverTheNumberOfResults(missingTermElement);
      missingTermElement.map(element => {
        $$(this.element).append(element);
      });
    }
  }

  private buildContainer(): HTMLElement[] {
    const elements: HTMLElement[] = [];
    elements.push(this.buildCaption().el);
    this.buildMissingTerms().forEach(term => {
      if (term) {
        elements.push(term.el);
      }
    });
    return elements;
  }

  private buildCaption(): Dom {
    return $$('span', { className: 'coveo-field-caption' }, this.options.caption);
  }

  private buildMissingTerms(): Dom[] {
    const terms: Dom[] = this.missingTerms.map(term => {
      if (this.containsFeaturedResults(term) || this.containsWildcard(term) || this.constainsApostrophe(term)) {
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
      const termElement = $$('button', { className: 'coveo-missing-term coveo-clickable' }, term);
      termElement.on('click', () => {
        this.addTermForcedToAppear(term);
        this.executeNewQuery(term);
      });
      return termElement;
    } else {
      return $$('span', { className: 'coveo-missing-term' }, term);
    }
  }

  private createWordBoundaryDelimitedRegex(term: string): RegExp {
    return XRegExp(`${this.wordBoundary}(${term})${this.wordBoundary}`, 'g');
  }

  private containsFeaturedResults(term: string): boolean {
    this.updateTermForcedToAppear();
    return this.termForcedToAppear.indexOf(term) !== -1;
  }

  private containsWildcard(term): boolean {
    const query = this.queryStateModel.get('q');
    const regxStarWildcard = XRegExp(`(\\*${term})|${term}\\*`);
    const regxQuestionMarkWildcard = XRegExp(`(\\?${term})|${term}\\?`);

    const foundStar = this.queryController.getLastQuery().wildcards && regxStarWildcard.test(query);
    const foundQuestionMark = this.queryController.getLastQuery().questionMark && regxQuestionMarkWildcard.test(query);

    return foundStar || foundQuestionMark;
  }

  private constainsApostrophe(term: string): boolean {
    if (term.length > 1) {
      return false;
    }
    const query = this.queryStateModel.get('q');
    const regxApostrophe = RegExp(`'${term}|${term}'`);

    return regxApostrophe.test(query);
  }

  private hideMissingTermsOverTheNumberOfResults(elements: HTMLElement[]) {
    const allMissingTerms = elements.filter(element => {
      return element.tagName === 'BUTTON';
    });
    if (allMissingTerms.length <= this.options.numberOfTerms) {
      return;
    }
    for (let index = this.options.numberOfTerms; index < allMissingTerms.length; index++) {
      $$(allMissingTerms[index]).hide();
    }
    const nbMoreResults = allMissingTerms.length - this.options.numberOfTerms;
    const showMore = $$('button', { className: 'coveo-missing-term-show-more coveo-clickable' }, l('NMore', [nbMoreResults]));

    showMore.on('click', () => {
      this.showAllHiddenMissingTerms();
    });
    elements.push(showMore.el);
  }

  private showAllHiddenMissingTerms() {
    const showMore = $$(this.element).find('.coveo-missing-term-show-more');
    showMore.parentNode.removeChild(showMore);
    const allMissingTerms = $$(this.element).findAll('.coveo-missing-term');
    for (let index = this.options.numberOfTerms; index < allMissingTerms.length; index++) {
      $$(allMissingTerms[index]).show();
      allMissingTerms[index].removeAttribute('style');
    }
  }
}
Initialization.registerAutoCreateComponent(MissingTerms);
