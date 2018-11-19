import { Component } from '../ui/Base/Component';
import { ResultList } from '../ui/ResultList/ResultList';
import { $$ } from './Dom';
import { find } from 'underscore';

export class ResultListUtils {
  public static isInfiniteScrollActive(root: HTMLElement) {
    const resultList = ResultListUtils.getActiveResultList(root);
    return resultList ? !!resultList.options.enableInfiniteScroll : false;
  }

  private static getActiveResultList(root: HTMLElement) {
    const resultLists = ResultListUtils.getResultLists(root);
    return find(resultLists, resultList => !resultList.disabled);
  }

  private static getResultLists(root: HTMLElement) {
    const resultListCssClass = Component.computeCssClassName(ResultList);

    return $$(root)
      .findAll(`.${resultListCssClass}`)
      .map(el => <ResultList>Component.get(el, ResultList));
  }
}
