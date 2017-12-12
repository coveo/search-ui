import { IQueryResult } from '../../rest/QueryResult';
import { Component } from '../Base/Component';
import { IResultListOptions } from './ResultList';
import _ = require('underscore');

export class ResultListRenderer {
  constructor(protected resultListOptions: IResultListOptions, protected autoCreateComponentsFn: Function) {}

  renderResults(
    resultElements: HTMLElement[],
    append = false,
    resultDisplayedCallback: (result: IQueryResult, resultElem: HTMLElement) => any
  ) {
    return Promise.all([this.getStartFragment(resultElements, append), this.getEndFragment(resultElements, append)]).then(
      ([startFrag, endFrag]) => {
        const resultsFragment = document.createDocumentFragment();
        if (startFrag) {
          resultsFragment.appendChild(startFrag);
        }
        _.each(resultElements, resultElement => {
          resultsFragment.appendChild(resultElement);
          resultDisplayedCallback(Component.getResult(resultElement), resultElement);
        });
        if (endFrag) {
          resultsFragment.appendChild(endFrag);
        }
        this.resultListOptions.resultContainer.appendChild(resultsFragment);
      }
    );
  }

  protected getStartFragment(resultElements: HTMLElement[], append: boolean): Promise<DocumentFragment> {
    return Promise.resolve(document.createDocumentFragment());
  }

  protected getEndFragment(resultElements: HTMLElement[], append: boolean): Promise<DocumentFragment> {
    return Promise.resolve(document.createDocumentFragment());
  }
}
