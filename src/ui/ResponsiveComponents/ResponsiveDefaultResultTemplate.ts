import { IResponsiveComponent, IResponsiveComponentOptions, ResponsiveComponentsManager } from './ResponsiveComponentsManager';
import { SearchInterface } from '../SearchInterface/SearchInterface';
import { ResultList } from '../ResultList/ResultList';
import { $$, Dom } from '../../utils/Dom';
import { Component } from '../Base/Component';
import { Logger } from '../../misc/Logger';
import { ResponsiveDropdown } from './ResponsiveDropdown/ResponsiveDropdown';

export class ResponsiveDefaultResultTemplate implements IResponsiveComponent {
  private searchInterface: SearchInterface;
  private resultList: ResultList;

  private currentMode: string;

  public static init(root: HTMLElement, component: ResultList, options: IResponsiveComponentOptions) {
    if (!$$(root).find(`.${Component.computeCssClassName(ResultList)}`)) {
      let logger = new Logger('ResponsiveDefaultResultTemplate');
      logger.trace('No ResultLayout component found : Cannot instantiate ResponsiveResultLayout');
      return;
    }
    ResponsiveComponentsManager.register(ResponsiveDefaultResultTemplate, $$(root), ResultList.ID, component, options);
  }

  constructor(public coveoRoot: Dom, public ID: string, options: IResponsiveComponentOptions, responsiveDropdown?: ResponsiveDropdown) {
    this.searchInterface = <SearchInterface>Component.get(this.coveoRoot.el, SearchInterface, false);
    this.currentMode = 'large';
  }

  public registerComponent(accept: ResultList) {
    if (accept instanceof ResultList) {
      this.resultList = accept;
      return true;
    }
    return false;
  }

  public handleResizeEvent() {
    let lastResults = this.resultList.queryController.getLastResults();
    if (this.needSmallMode()) {
      $$(this.resultList.options.resultContainer).addClass('coveo-card-layout-container');
      $$(this.resultList.options.resultContainer).removeClass(`coveo-list-layout-container`);
      if (this.currentMode != 'small') {
        if (lastResults) {
          this.resultList.buildResults(lastResults).then((elements: HTMLElement[]) => {
            this.resultList.renderResults(elements);
          });
        }
        this.currentMode = 'small';
      }
    } else {
      $$(this.resultList.options.resultContainer).removeClass('coveo-card-layout-container');
      $$(this.resultList.options.resultContainer).addClass(`coveo-list-layout-container`);
      if (this.currentMode != 'large') {
        if (lastResults) {
          this.resultList.buildResults(lastResults).then((elements: HTMLElement[]) => {
            this.resultList.renderResults(elements);
          });
        }
        this.currentMode = 'large';
      }
    }
  }

  private needSmallMode(): boolean {
    return this.coveoRoot.width() <= this.searchInterface.responsiveComponents.getSmallScreenWidth();
  }
}
