import { IQueryResult } from '../../rest/QueryResult';
import { $$, Dom } from '../../utils/Dom';
import { Component } from '../Base/Component';
import { SearchInterface } from '../SearchInterface/SearchInterface';

export interface ResultToRender {
  resultElement: HTMLElement;
  componentsInside: Component[];
}

export class ResultContainer {
  public static resultCurrentlyBeingRendered: IQueryResult = null;

  public resultContainerElement: Dom;

  constructor(resultContainer: HTMLElement, private searchInterface: SearchInterface) {
    this.resultContainerElement = $$(resultContainer);
  }

  public empty() {
    this.searchInterface.detachComponentsInside(this.resultContainerElement.el);
    this.resultContainerElement.el.innerHTML = '';
  }

  public addClass(classToAdd: string) {
    this.resultContainerElement.addClass(classToAdd);
  }

  public isEmpty() {
    return this.resultContainerElement.isEmpty();
  }

  public hideChildren() {
    this.resultContainerElement.children().forEach(child => $$(child).hide());
  }

  public getResultElements() {
    return this.resultContainerElement.findAll('.CoveoResult');
  }

  public get el() {
    return this.resultContainerElement.el;
  }
}
