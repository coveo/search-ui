import { Template } from '../Templates/Template';
import { IQueryResult } from '../../rest/QueryResult';
import { Component } from '../Base/Component';
import { IResultListOptions } from './ResultList';
import _ = require('underscore');

export class ResultListRenderer {
  constructor(protected resultListOptions: IResultListOptions, protected autoCreateComponentsFn: Function) {
  }

  renderResults(resultElements: HTMLElement[], append = false, resultDisplayedCallback: (result: IQueryResult, resultElem: HTMLElement) => any) {
    this.beforeRenderingResults(resultElements, append);
    _.each(resultElements, (resultElement) => {
      this.resultListOptions.resultContainer.appendChild(resultElement);
      resultDisplayedCallback(Component.getResult(resultElement), resultElement);
    });
    this.afterRenderingResults(resultElements, append);
  }

  protected beforeRenderingResults(resultElements: HTMLElement[], append: boolean) {
  }

  protected afterRenderingResults(resultElements: HTMLElement[], append: boolean) {
  }
}
