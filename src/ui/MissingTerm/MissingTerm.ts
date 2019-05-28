import 'styling/_MissingTerm';
import { exportGlobally } from '../../GlobalExports';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { reject } from 'underscore';
import { $$, Initialization } from '../../Core';
import { Dom } from '../../utils/Dom';
import { analyticsActionCauseList, IAnalyticsIncludeMissingTerm } from '../Analytics/AnalyticsActionListMeta';

export interface IMissingTermOptions {
  clickable?: boolean;
}

export class MissingTerm extends Component {
  static ID = 'MissingTerm';
  static options: IMissingTermOptions = {
    /**
     * Enable the user to click on a missing term to force it in the query
     */
    clickable: ComponentOptions.buildBooleanOption({ defaultValue: true })
  };

  static doExport = () => {
    exportGlobally({
      MissingTerm: MissingTerm
    });
  };

  private termsCurrentlyForcedToAppear: string[];

  /**
   * The `MissingTerm` component is responsible for displaying the keyword that was not matched for a result
   */
  constructor(public element: HTMLElement, public options?: IMissingTermOptions, bindings?: IComponentBindings, public result?) {
    super(element, MissingTerm.ID, bindings);

    this.termsCurrentlyForcedToAppear = [];
    this.options = ComponentOptions.initComponentOptions(element, MissingTerm, options);
    this.addMissingTerm();
  }

  private addMissingTerm() {
    if (this.getMissingTerms().length > 0) {
      const container = this.buildContainer();
      $$(this.element).append(container.el);
      const cell = $$(this.element).find('.coveo-result-cell');
      const caption = this.buildCaption();
      cell.appendChild(caption.el);
      this.buildMissingTerms().forEach(term => {
        cell.appendChild(term.el);
      });
    }
  }

  private buildContainer(): Dom {
    return $$('div', { className: 'coveo-result-row' }, $$('div', { className: 'coveo-result-cell' }));
  }

  public getMissingTerms(): string[] {
    // Keeping only user entered keywords (removing thesaurus or other injected keywords)
    let cleanMissingTerms = reject(this.result.absentTerms as string[], term => term.indexOf('permanentid') > -1);

    const userKeywords = this.result.state.q.split(' ');
    cleanMissingTerms = reject(this.result.absentTerms as string[], term => !userKeywords.includes(term));
    return cleanMissingTerms;
  }

  private buildCaption(): Dom {
    return $$('span', { className: 'coveo-field-caption' }, 'Missing:');
  }

  private buildMissingTerms(): Dom[] {
    const terms: Dom[] = this.getMissingTerms().map(term => {
      const missingTerm = $$('span', { className: 'coveo-missing-term' }, term);
      this.addClickableIfEnable(missingTerm, term);
      return missingTerm;
    });
    return terms;
  }

  public includeTermInQuery(term: string) {
    this.termsCurrentlyForcedToAppear.push(term);
    const query: string = this.queryStateModel.get('q');
    const keywordPosition: number = query.indexOf(term);
    const newQuery: string = [query.slice(0, keywordPosition), '"', term, '"', query.slice(keywordPosition + term.length)].join('');
    this.queryStateModel.set('q', newQuery);
  }

  private executeNewQuery(missingTerm: string) {
    this.usageAnalytics.logSearchEvent<IAnalyticsIncludeMissingTerm>(analyticsActionCauseList.missingTermSearch, {
      missingTerm: missingTerm
    });
    this.queryController.executeQuery();
  }

  private addClickableIfEnable(termElement: Dom, term: string) {
    if (this.options.clickable) {
      termElement.addClass('clickable');
      termElement.on('click', () => {
        this.includeTermInQuery(term);
        this.executeNewQuery(term);
      });
    }
  }
}
Initialization.registerAutoCreateComponent(MissingTerm);
