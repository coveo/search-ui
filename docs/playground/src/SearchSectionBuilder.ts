import { $$, Dom } from '../../../src/utils/Dom';
import { SectionBuilder } from './SectionBuilder';

export class SearchSectionBuilder extends SectionBuilder {
  public searchbox: Dom;
  public settings: Dom;

  private enableOmnibox = true;
  private enableQuerySuggest = true;

  constructor(
    sectionParameter = $$('div', {
      className: 'coveo-search-section'
    })
  ) {
    super();
    this.section = sectionParameter;

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

  public build() {
    const built = super.build();
    this.searchbox.setAttribute('data-enable-omnibox', this.enableOmnibox.toString());
    this.searchbox.setAttribute('data-enable-query-suggest-addon', this.enableQuerySuggest.toString());
    return built;
  }
}
