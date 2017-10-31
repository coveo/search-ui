import { $$, Dom } from '../../../src/utils/Dom';

export class SearchSectionBuilder {
  public section: Dom;
  public searchbox: Dom;
  public settings: Dom;

  private enableOmnibox = true;
  private enableQuerySuggest = true;

  constructor() {
    this.section = $$('div', {
      className: 'coveo-search-section'
    });

    this.searchbox = $$('div', {
      className: 'CoveoSearchbox'
    });

    this.settings = $$('div', {
      className: 'CoveoSettings'
    });

    this.section.append(this.settings.el);
    this.section.append(this.searchbox.el);
  }

  public withOmnibox() {
    this.enableOmnibox = true;
    return this;
  }

  public withoutOmnibox() {
    this.enableOmnibox = false;
    return this;
  }

  public withQuerySuggest() {
    this.enableQuerySuggest = true;
    return this;
  }

  public withoutQuerySuggest() {
    this.enableQuerySuggest = false;
    return this;
  }

  public withComponent(component: string) {
    this.section.append($$('div', { className: component }).el);
    return this;
  }

  public withDomElement(dom: Dom) {
    this.section.append(dom.el);
    return this;
  }

  public build() {
    this.searchbox.setAttribute('data-enable-omnibox', this.enableOmnibox.toString());
    this.searchbox.setAttribute('data-enable-query-suggest-addon', this.enableQuerySuggest.toString());
    return this.section;
  }
}
