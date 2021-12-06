import 'styling/_MissingTerms';
import { $$, Initialization, l } from '../../Core';
import { exportGlobally } from '../../GlobalExports';
import { IQueryResult } from '../../rest/QueryResult';
import { Dom } from '../../utils/Dom';
import { analyticsActionCauseList, IAnalyticsMissingTerm } from '../Analytics/AnalyticsActionListMeta';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { MissingTermManager } from './MissingTermManager';
import XRegExp = require('xregexp');
import { intersection } from 'underscore';

export interface IMissingTermsOptions {
  caption?: string;
  clickable?: boolean;
  numberOfTerms?: number;
}

/**
 * This [result template component](https://docs.coveo.com/en/513/#using-result-template-components) renders a list of query terms
 * that were not matched by the associated result item.
 *
 * @availablesince [July 2019 Release (v2.6459)](https://docs.coveo.com/en/2938/)
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
    caption: ComponentOptions.buildLocalizedStringOption({
      localizedString: () => l('Missing')
    }),
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

  private get absentTerms() {
    let absentTerms = this.result.absentTerms;

    if (this.result.attachments) {
      absentTerms = this.intersectAbsentTerms(absentTerms, this.result.attachments);
    }

    if (this.result.childResults) {
      absentTerms = this.intersectAbsentTerms(absentTerms, this.result.childResults);
    }

    return absentTerms;
  }

  private intersectAbsentTerms(absentTerms: string[], results: IQueryResult[]) {
    return intersection(absentTerms, ...results.map(result => result.absentTerms));
  }

  /**
   * Returns all original basic query expression terms that were not matched by the result item the component instance is associated with.
   */
  public get missingTerms(): string[] {
    const terms = [];

    for (const term of this.absentTerms) {
      const regex = this.createWordBoundaryDelimitedRegex(term);
      const query = this.queryStateModel.get('q');
      const result = regex.exec(query);

      if (result) {
        const originalKeywordInQuery = result[4];
        terms.push(originalKeywordInQuery);
      }
    }

    return terms;
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
    this.queryStateModel.set('missingTerms', [...this.termForcedToAppear]);
  }

  private updateTermForcedToAppear() {
    this.termForcedToAppear = [...this.queryStateModel.get('missingTerms')];
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
    const validTerms = this.missingTerms.filter(term => this.isValidTerm(term));
    const terms: Dom[] = validTerms.map(term => {
      return this.makeTermClickableIfEnabled(term);
    });
    return terms;
  }

  private executeNewQuery(missingTerm: string = this.queryStateModel.get('q')) {
    this.queryController.executeQuery();
  }

  private makeTermClickableIfEnabled(term: string): Dom {
    if (this.options.clickable) {
      const termElement = $$('button', { className: 'coveo-missing-term coveo-clickable', type: 'button' }, term);
      termElement.on('click', () => {
        this.addTermForcedToAppear(term);
        this.logAnalyticsAddMissingTerm(term);
        this.executeNewQuery(term);
      });
      return termElement;
    } else {
      return $$('span', { className: 'coveo-missing-term' }, term);
    }
  }

  private createWordBoundaryDelimitedRegex(term: string): RegExp {
    return XRegExp(`${MissingTermManager.wordBoundary}(${term})${MissingTermManager.wordBoundary}`, 'gi');
  }

  private containsFeaturedResults(term: string): boolean {
    this.updateTermForcedToAppear();
    return this.termForcedToAppear.indexOf(term) !== -1;
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
    const showMore = $$(
      'button',
      { className: 'coveo-missing-term-show-more coveo-clickable', type: 'button' },
      l('NMore', [nbMoreResults])
    );

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

  private isValidTerm(term: string) {
    return this.isNonBoundaryTerm(term) && !this.containsFeaturedResults(term);
  }

  private isNonBoundaryTerm(term: string) {
    //p{L} is a Unicode script that matches any character in any language.
    const wordWithBreakpoints = `\\p{L}*[-'?\*’.~=,\/\\\\:\`;_!&\(\)]+\\p{L}*`;
    const regex = XRegExp(wordWithBreakpoints, 'gi');
    const query = this.queryStateModel.get('q');
    const matches = query.match(regex) || [];
    return matches.every((word: string) => {
      return word.indexOf(term) === -1;
    });
  }

  private logAnalyticsAddMissingTerm(term: string) {
    this.usageAnalytics.logSearchEvent<IAnalyticsMissingTerm>(analyticsActionCauseList.addMissingTerm, {
      missingTerm: term
    });
  }
}
Initialization.registerAutoCreateComponent(MissingTerms);
