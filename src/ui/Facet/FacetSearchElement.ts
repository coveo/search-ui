import { $$ } from '../../utils/Dom';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';
import { Component } from '../Base/Component';
import { l } from '../../strings/Strings';
import { EventsUtils } from '../../utils/EventsUtils';

export interface FacetSearchElement {
  search: HTMLElement;
  magnifier: HTMLElement;
  wait: HTMLElement;
  clear: HTMLElement;
  middle: HTMLElement;
}
export class FacetSearchElement {
  public search: HTMLElement;
  public magnifier: HTMLElement;
  public wait: HTMLElement;
  public clear: HTMLElement;
  public middle: HTMLElement;
  public input: HTMLElement;
  public searchBarIsAnimating: boolean;

  constructor(private handleFacetSearchKeyUp, private handleFacetSearchClear, private handleFacetSearchFocus) {
    this.search = document.createElement('div');
    $$(this.search).addClass('coveo-facet-search');

    this.magnifier = document.createElement('div');
    this.magnifier.innerHTML = SVGIcons.icons.search;
    $$(this.magnifier).addClass('coveo-facet-search-magnifier');
    SVGDom.addClassToSVGInContainer(this.magnifier, 'coveo-facet-search-magnifier-svg');
    this.search.appendChild(this.magnifier);

    this.wait = document.createElement('div');
    this.wait.innerHTML = SVGIcons.icons.loading;
    $$(this.wait).addClass('coveo-facet-search-wait-animation');
    SVGDom.addClassToSVGInContainer(this.wait, 'coveo-facet-search-wait-animation-svg');
    this.search.appendChild(this.wait);
    this.hideFacetSearchWaitingAnimation();

    this.clear = $$(
      'div',
      { className: 'coveo-facet-search-clear', title: l('Clear', l('Search')) },
      SVGIcons.icons.checkboxHookExclusionMore
    ).el;
    SVGDom.addClassToSVGInContainer(this.clear, 'coveo-facet-search-clear-svg');
    this.clear.style.display = 'none';
    this.search.appendChild(this.clear);

    this.middle = document.createElement('div');
    $$(this.middle).addClass('coveo-facet-search-middle');
    this.search.appendChild(this.middle);

    this.input = document.createElement('input');
    this.input.setAttribute('type', 'text');
    this.input.setAttribute('autocapitalize', 'off');
    this.input.setAttribute('autocorrect', 'off');
    $$(this.input).addClass('coveo-facet-search-input');
    Component.pointElementsToDummyForm(this.input);
    this.middle.appendChild(this.input);

    $$(this.input).on('keyup', (e: KeyboardEvent) => this.handleFacetSearchKeyUp(e));
    $$(this.clear).on('click', (e: Event) => this.handleFacetSearchClear());
    $$(this.input).on('focus', (e: Event) => this.handleFacetSearchFocus());

    this.detectSearchBarAnimation();
  }
  public hideFacetSearchWaitingAnimation() {
    $$(this.magnifier).show();
    $$(this.wait).hide();
  }
  public detectSearchBarAnimation() {
    EventsUtils.addPrefixedEvent(this.search, 'AnimationStart', event => {
      if (event.animationName == 'grow') {
        this.searchBarIsAnimating = true;
      }
    });

    EventsUtils.addPrefixedEvent(this.search, 'AnimationEnd', event => {
      if (event.animationName == 'grow') {
        this.searchBarIsAnimating = false;
      }
    });
  }
}
