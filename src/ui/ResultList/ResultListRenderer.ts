import { Template } from '../Templates/Template';
import { IQueryResult } from '../../rest/QueryResult';
import { Component } from '../Base/Component';
import { IResultListOptions } from './ResultList';
import _ = require('underscore');

export class ResultListRenderer {
  constructor(protected resultListOptions: IResultListOptions, protected autoCreateComponentsFn: Function) {
  }

  renderResults(resultElements: HTMLElement[], append = false, resultDisplayedCallback: (result: IQueryResult, resultElem: HTMLElement) => any) {
    const resultsFragment = document.createDocumentFragment();
    this.beforeRenderingResults(resultsFragment, resultElements, append);
    _.each(resultElements, resultElement => {
      resultsFragment.appendChild(resultElement);
      resultDisplayedCallback(Component.getResult(resultElement), resultElement);
    });
    this.afterRenderingResults(resultsFragment, resultElements, append);
    this.resultListOptions.resultContainer.appendChild(resultsFragment);
  }

  protected beforeRenderingResults(container: Node, resultElements: HTMLElement[], append: boolean) {
  }

  protected afterRenderingResults(container: Node, resultElements: HTMLElement[], append: boolean) {
  }
}
