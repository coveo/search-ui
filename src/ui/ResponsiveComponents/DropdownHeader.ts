import {$$, Dom} from '../../utils/Dom';

export class DropdownHeader {

  private element: Dom;
  constructor(private coveoRoot: Dom) {
    this.element = $$(this.coveoRoot.find('.coveo-recommendation-column'));
    if (!this.element) {
      this.element = $$(this.coveoRoot.find('CoveoRecommendation'));
    }
  }
}