import {SearchInterface} from '../SearchInterface/SearchInterface';
import {Template} from '../Templates/Template';
import {IQueryResult} from '../../rest/QueryResult';
import {Component} from '../Base/Component';

export class StandaloneResult {
  public element: HTMLElement;

  constructor(public searchInterface: SearchInterface, resultTemplate: Template, public result: IQueryResult) {
    this.element = resultTemplate.instantiateToElement(result);
    this.element['CoveoResult'] = result;
    Component.bindResultToElement(this.element, result);
  }
}
