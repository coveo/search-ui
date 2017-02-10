/// <reference path="Facet.ts" />
/// <reference path="FacetSettings.ts" />

import { Facet } from './Facet';
import { FacetSlider } from '../FacetSlider/FacetSlider';
import { IFacetSettingsKlass, FacetSettings } from './FacetSettings';
import { IFacetSortKlass, FacetSort } from './FacetSort';
import { $$ } from '../../utils/Dom';
import { FacetUtils } from './FacetUtils';
import { l } from '../../strings/Strings';
import { IAnalyticsFacetOperatorMeta, IAnalyticsFacetMeta, analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';

export interface IFacetHeaderOptions {
  facetElement: HTMLElement;
  title: string;
  field: string;
  enableClearElement: boolean;
  enableCollapseElement: boolean;
  icon?: string;
  facet?: Facet;
  facetSlider?: FacetSlider;
  settingsKlass?: IFacetSettingsKlass;
  sortKlass?: IFacetSortKlass;
  availableSorts?: string[];
  isNewDesign: boolean;
}

export class FacetHeader {
  public element: HTMLElement;
  public iconElement: HTMLElement;
  public waitElement: HTMLElement;
  public collapseElement: HTMLElement;
  public expandElement: HTMLElement;
  public operatorElement: HTMLElement;
  public eraserElement: HTMLElement;
  public settings: FacetSettings;
  public sort: FacetSort;

  constructor(public options: IFacetHeaderOptions) {
    this.element = document.createElement('div');
    $$(this.element).addClass('coveo-facet-header');
  }

  public build(): HTMLElement {
    if (this.options.isNewDesign) {
      return this.buildNewDesign();
    } else {
      return this.buildOldDesign();
    }
  }


  public switchToAnd(): void {
    if (this.options.facet) {
      this.options.facet.options.useAnd = true;
      this.rebuildOperatorToggle();
      this.updateOperatorQueryStateModel();
    }
  }

  public switchToOr(): void {
    if (this.options.facet) {
      this.options.facet.options.useAnd = false;
      this.rebuildOperatorToggle();
      this.updateOperatorQueryStateModel();
    }
  }

  public collapseFacet(): void {
    if (this.collapseElement && this.expandElement) {
      $$(this.collapseElement).hide();
      $$(this.expandElement).show();
    }
    $$(this.options.facetElement).addClass('coveo-facet-collapsed');
  }

  public expandFacet(): void {
    if (this.collapseElement && this.expandElement) {
      $$(this.expandElement).hide();
      $$(this.collapseElement).show();
    }
    $$(this.options.facetElement).removeClass('coveo-facet-collapsed');
    if (this.options.facet) {
      FacetUtils.clipCaptionsToAvoidOverflowingTheirContainer(this.options.facet);
    }
  }

  public updateOperatorQueryStateModel(): void {
    if (this.options.facet && this.options.facet.options.enableTogglingOperator) {
      var valueToSet = '';
      if (this.options.facet.getSelectedValues().length != 0 || this.options.facet.getExcludedValues().length != 0) {
        valueToSet = this.options.facet.options.useAnd ? 'and' : 'or';
      }
      this.options.facet.queryStateModel.set(this.options.facet.operatorAttributeId, valueToSet);
    }
  }

  private buildNewDesign() {
    let titleSection = $$('div', {
      className: 'coveo-facet-header-title-section'
    });
    if (this.options.icon != undefined) {
      this.iconElement = this.buildIcon();
      titleSection.append(this.iconElement);
    }
    titleSection.append(this.buildTitle());
    this.waitElement = this.buildWaitAnimation();
    titleSection.append(this.waitElement);
    this.element.appendChild(titleSection.el);

    let settingsSection = $$('div', {
      className: 'coveo-facet-header-settings-section'
    });

    this.eraserElement = this.buildEraser();
    settingsSection.append(this.eraserElement);

    if (this.options.facet) {
      this.operatorElement = this.buildOperatorToggle();
      settingsSection.append(this.operatorElement);
      $$(this.operatorElement).toggle(this.options.facet.options.enableTogglingOperator);
    }

    if (this.options.settingsKlass) {
      this.sort = this.settings = new this.options.settingsKlass(this.options.availableSorts, this.options.facet);
      settingsSection.append(this.settings.build());
    } else if (this.options.sortKlass) {
      this.sort = new this.options.sortKlass(this.options.availableSorts, this.options.facet);
    }
    this.element.appendChild(settingsSection.el);

    return this.element;
  }

  private buildOldDesign() {
    this.element.appendChild(this.buildIcon());
    this.element.appendChild(this.buildWaitAnimation());

    if (this.options.settingsKlass) {
      this.sort = this.settings = new this.options.settingsKlass(this.options.availableSorts, this.options.facet);
      this.element.appendChild(this.settings.build());
    } else if (this.options.sortKlass) {
      this.sort = new this.options.sortKlass(this.options.availableSorts, this.options.facet);
    }

    if (this.options.enableCollapseElement) {
      this.collapseElement = this.buildCollapse();
      this.element.appendChild(this.collapseElement);

      this.expandElement = this.buildExpand();
      this.element.appendChild(this.expandElement);
    }

    if (this.options.facet) {
      this.operatorElement = this.buildOperatorToggle();
      this.element.appendChild(this.operatorElement);
      $$(this.operatorElement).toggle(this.options.facet.options.enableTogglingOperator);
    }

    this.eraserElement = this.buildEraser();
    this.element.appendChild(this.eraserElement);
    this.element.appendChild(this.buildTitle());

    return this.element;
  }

  private rebuildOperatorToggle(): void {
    var newElement = this.buildOperatorToggle();
    if (this.operatorElement) {
      $$(this.operatorElement).replaceWith(newElement);
    }
    this.operatorElement = newElement;
  }

  private buildIcon(): HTMLElement {
    var cssClassForIcon;
    if (this.options.icon) {
      cssClassForIcon = 'coveo-icon-custom ' + this.options.icon;
    } else {
      cssClassForIcon = 'coveo-icon ' + this.options.field.substr(1);
    }
    this.iconElement = document.createElement('div');
    $$(this.iconElement).addClass(cssClassForIcon);
    return this.iconElement;
  }

  private buildWaitAnimation(): HTMLElement {
    this.waitElement = document.createElement('div');
    $$(this.waitElement).addClass('coveo-facet-header-wait-animation');

    if (this.options.isNewDesign) {
      this.waitElement.style.visibility = 'hidden';
    } else {
      $$(this.waitElement).hide();
    }
    return this.waitElement;
  }

  private buildCollapse(): HTMLElement {
    var icon = document.createElement('span');
    $$(icon).addClass('coveo-icon');

    var collapse = document.createElement('div');
    collapse.setAttribute('title', l('Collapse'));
    $$(collapse).addClass('coveo-facet-header-collapse');
    collapse.appendChild(icon);

    $$(collapse).on('click', () => this.collapseFacet());

    return collapse;
  }

  private buildExpand(): HTMLElement {
    var icon = document.createElement('span');
    $$(icon).addClass('coveo-icon');

    var expand = document.createElement('div');
    expand.setAttribute('title', l('Expand'));
    $$(expand).hide();
    $$(expand).addClass('coveo-facet-header-expand');
    expand.appendChild(icon);
    $$(expand).on('click', () => this.expandFacet());
    return expand;
  }

  private buildOperatorToggle(): HTMLElement {
    var icon = document.createElement('span');
    $$(icon).addClass(['coveo-' + (this.options.facet.options.useAnd ? 'and' : 'or'), 'coveo-icon']);

    var toggle = document.createElement('div');
    toggle.setAttribute('title', l('SwitchTo', this.options.facet.options.useAnd ? l('Or') : l('And')));
    $$(toggle).addClass('coveo-facet-header-operator');
    toggle.appendChild(icon);
    $$(toggle).on('click', () => this.handleOperatorClick());

    return toggle;
  }

  private handleOperatorClick(): void {
    if (this.options.facet.options.useAnd) {
      this.options.facet.switchToOr();
    } else {
      this.options.facet.switchToAnd();
    }
    if (this.options.facet.getSelectedValues().length != 0) {
      var operatorNow = this.options.facet.options.useAnd ? 'AND' : 'OR';
      var operatorBefore = this.options.facet.options.useAnd ? 'OR' : 'AND';
      this.options.facet.triggerNewQuery(() => this.options.facet.usageAnalytics.logSearchEvent<IAnalyticsFacetOperatorMeta>(analyticsActionCauseList.facetToggle, {
        facetId: this.options.facet.options.id,
        facetOperatorBefore: operatorBefore,
        facetOperatorAfter: operatorNow,
        facetTitle: this.options.title
      }));
    }
  }

  private buildTitle(): HTMLElement {
    var title = $$('div', {
      title: this.options.title,
      className: 'coveo-facet-header-title'
    });
    title.text(this.options.title);
    return title.el;
  }

  public buildEraser(): HTMLElement {
    var icon = document.createElement('span');
    $$(icon).addClass('coveo-icon');

    var eraser = document.createElement('div');
    eraser.setAttribute('title', l('Clear', this.options.title));
    eraser.appendChild(icon);
    $$(eraser).addClass('coveo-facet-header-eraser');
    $$(eraser).on('click', () => {
      var cmp = this.options.facet || this.options.facetSlider;
      cmp.reset();
      cmp.usageAnalytics.logSearchEvent<IAnalyticsFacetMeta>(analyticsActionCauseList.facetClearAll, {
        facetId: cmp.options.id,
        facetTitle: cmp.options.title
      });
      cmp.queryController.executeQuery();
    });
    return eraser;
  }
}
