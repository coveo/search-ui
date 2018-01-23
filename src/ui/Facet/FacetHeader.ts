import FacetSliderModuleDefinition = require('../FacetSlider/FacetSlider');
import FacetModuleDefinition = require('./Facet');
import { IFacetSettingsKlass, FacetSettings } from './FacetSettings';
import { IFacetSortKlass, FacetSort } from './FacetSort';
import { $$ } from '../../utils/Dom';
import { l } from '../../strings/Strings';
import { IAnalyticsFacetOperatorMeta, IAnalyticsFacetMeta, analyticsActionCauseList } from '../Analytics/AnalyticsActionListMeta';
import 'styling/_FacetHeader';
import { SVGIcons } from '../../utils/SVGIcons';
import { SVGDom } from '../../utils/SVGDom';

export interface IFacetHeaderOptions {
  facetElement: HTMLElement;
  facet?: FacetModuleDefinition.Facet;
  title: string;
  field: string;
  enableClearElement: boolean;
  enableCollapseElement: boolean;
  icon?: string;
  facetSlider?: FacetSliderModuleDefinition.FacetSlider;
  settingsKlass?: IFacetSettingsKlass;
  sortKlass?: IFacetSortKlass;
  availableSorts?: string[];
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
  }

  public updateOperatorQueryStateModel(): void {
    if (this.options.facet && this.options.facet.options.enableTogglingOperator) {
      let valueToSet = '';
      if (this.options.facet.getSelectedValues().length != 0 || this.options.facet.getExcludedValues().length != 0) {
        valueToSet = this.options.facet.options.useAnd ? 'and' : 'or';
      }
      this.options.facet.queryStateModel.set(this.options.facet.operatorAttributeId, valueToSet);
    }
  }

  private rebuildOperatorToggle(): void {
    const newElement = this.buildOperatorToggle();
    if (this.operatorElement) {
      $$(this.operatorElement).replaceWith(newElement);
    }
    this.operatorElement = newElement;
  }

  private buildIcon(): HTMLElement {
    let cssClassForIcon;
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
    this.waitElement = $$('div', { className: 'coveo-facet-header-wait-animation' }, SVGIcons.icons.loading).el;
    SVGDom.addClassToSVGInContainer(this.waitElement, 'coveo-facet-header-wait-animation-svg');
    this.waitElement.style.visibility = 'hidden';
    return this.waitElement;
  }

  private buildOperatorToggle(): HTMLElement {
    const icon = $$('span', { className: 'coveo-' + (this.options.facet.options.useAnd ? 'and' : 'or') }, SVGIcons.icons.orAnd);
    SVGDom.addClassToSVGInContainer(icon.el, 'coveo-or-and-svg');
    const toggle = $$('div', {
      className: 'coveo-facet-header-operator',
      title: l('SwitchTo', this.options.facet.options.useAnd ? l('Or') : l('And'))
    });
    toggle.append(icon.el);
    $$(toggle).on('click', () => this.handleOperatorClick());

    return toggle.el;
  }

  private handleOperatorClick(): void {
    if (this.options.facet.options.useAnd) {
      this.options.facet.switchToOr();
    } else {
      this.options.facet.switchToAnd();
    }
    if (this.options.facet.getSelectedValues().length != 0) {
      const operatorNow = this.options.facet.options.useAnd ? 'AND' : 'OR';
      const operatorBefore = this.options.facet.options.useAnd ? 'OR' : 'AND';
      this.options.facet.triggerNewQuery(() =>
        this.options.facet.usageAnalytics.logSearchEvent<IAnalyticsFacetOperatorMeta>(analyticsActionCauseList.facetToggle, {
          facetId: this.options.facet.options.id,
          facetOperatorBefore: operatorBefore,
          facetOperatorAfter: operatorNow,
          facetTitle: this.options.title
        })
      );
    }
  }

  private buildTitle(): HTMLElement {
    const title = $$('div', {
      title: this.options.title,
      className: 'coveo-facet-header-title'
    });
    title.text(this.options.title);
    return title.el;
  }

  public buildEraser(): HTMLElement {
    const eraser = $$('div', { title: l('Clear', this.options.title), className: 'coveo-facet-header-eraser' }, SVGIcons.icons.mainClear);
    SVGDom.addClassToSVGInContainer(eraser.el, 'coveo-facet-header-eraser-svg');

    eraser.on('click', () => {
      const cmp = this.options.facet || this.options.facetSlider;
      cmp.reset();
      cmp.usageAnalytics.logSearchEvent<IAnalyticsFacetMeta>(analyticsActionCauseList.facetClearAll, {
        facetId: cmp.options.id,
        facetTitle: cmp.options.title
      });
      cmp.queryController.executeQuery();
    });
    return eraser.el;
  }
}
