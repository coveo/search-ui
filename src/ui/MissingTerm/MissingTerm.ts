import 'styling/_MissingTerm';
import { exportGlobally } from '../../GlobalExports';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { reject } from 'underscore';
import { $$, Initialization } from '../../Core';
import { Dom } from '../../utils/Dom';
import { state } from '../Base/RegisteredNamedMethods';

export interface IMissingTermOptions {}

export class MissingTerm extends Component {
  static ID = 'MissingTerm';
  static options: IMissingTermOptions = {};

  static doExport = () => {
    exportGlobally({
      MissingTerm: MissingTerm
    });
  };

  private termsCurrentlyForcedToAppear: string[];

  constructor(public element: HTMLElement, public options?: IMissingTermOptions, bindings?: IComponentBindings, public result?) {
    super(element, MissingTerm.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, MissingTerm, options);
    this.addMissingTerm();
  }

  private addMissingTerm() {
    if (this.getCleanMissingTerms().length > 0) {
      const container = this.buildContainer();
      $$(this.element).append(container.el);
      let cell = $$(this.element).find('.coveo-result-cell');
      const caption = this.buildCaption();

      cell.appendChild(caption.el);
      this.buildTerms().forEach(term => {
        cell.appendChild(term.el);
      });
    }
  }

  private buildContainer(): Dom {
    return $$('div', { className: 'coveo-result-row' }, $$('div', { className: 'coveo-result-cell' }));
  }

  private getCleanMissingTerms() {
    // Why this rejection?
    let cleanMissingTerms = reject(this.result.absentTerms as string, term => term.indexOf('permanentid') > -1);
    // Keeping only user entered keywords (removing thesaurus or other injected keywords)
    let userKeywords = this.result.state.q.split(' ');
    cleanMissingTerms = reject(cleanMissingTerms, term => !userKeywords.includes(term));
    return cleanMissingTerms;
  }

  private buildCaption() {
    return $$('span', { className: 'coveo-field-caption' }, 'Missing');
  }

  private buildTerms(): Dom[] {
    const terms: Dom[] = this.getCleanMissingTerms().map(term => {
      const missingTerm = $$('span', { className: 'coveo-missing-term' }, term);
      return missingTerm;
    });
    return terms;
  }

  private addForceToAppear(term: string) {
    this.termsCurrentlyForcedToAppear.push(term);
    state(this.element).set();
  }
}

Initialization.registerAutoCreateComponent(MissingTerm);
