import { IQueryResults } from '../../rest/QueryResults';
import { IQueryResult } from '../../rest/QueryResult';
import { Assert, QueryUtils, Component, Initialization, QueryStateModel } from '../../Core';
import { IInitResult } from '../Base/Initialization';
import { Template } from './Template';
import { SearchInterface } from '../../ui/SearchInterface/SearchInterface';
import { ResultList } from '../ResultList/ResultList';
import { ValidLayout } from '../ResultLayoutSelector/ValidLayout';

export interface ITemplateToHtml {
  resultTemplate: Template;
  queryStateModel: QueryStateModel;
  searchInterface: SearchInterface;
}

export class TemplateToHtml {
  constructor(public args: ITemplateToHtml) {}

  /**
   * Builds and returns an array of HTMLElement with the given result set.
   * @param results the result set to build an array of HTMLElement from.
   */
  public async buildResults(
    results: IQueryResults,
    layout: ValidLayout,
    currentlyDisplayedResults: IQueryResult[]
  ): Promise<HTMLElement[]> {
    const resultsPromises = results.results.map((result: IQueryResult) => {
      return this.buildResult(result, layout, currentlyDisplayedResults);
    });

    const resultElement = await Promise.all(resultsPromises);
    ResultList.resultCurrentlyBeingRendered = null;
    return resultElement;
  }

  /**
   * Builds and returns an HTMLElement for the given result.
   * @param result the result to build an HTMLElement from.
   * @returns {HTMLElement}
   */
  public async buildResult(result: IQueryResult, layout: ValidLayout, currentlyDisplayedResults: IQueryResult[]): Promise<HTMLElement> {
    Assert.exists(result);
    QueryUtils.setStateObjectOnQueryResult(this.args.queryStateModel.get(), result);
    QueryUtils.setSearchInterfaceObjectOnQueryResult(this.args.searchInterface, result);
    ResultList.resultCurrentlyBeingRendered = result;
    const resultElement = await this.createHtmlElement(result, layout);

    if (resultElement != null) {
      Component.bindResultToElement(resultElement, result);
    }
    currentlyDisplayedResults.push(result);
    return this.autoCreateComponentsInsideResult(resultElement, result).initResult.then(() => {
      return resultElement;
    });
  }

  public autoCreateComponentsInsideResult(element: HTMLElement, result: IQueryResult): IInitResult {
    Assert.exists(element);
    return Initialization.automaticallyCreateComponentsInsideResult(element, result);
  }

  private createHtmlElement(result: IQueryResult, layout: ValidLayout) {
    return this.args.resultTemplate.instantiateToElement(result, {
      wrapInDiv: true,
      checkCondition: true,
      currentLayout: layout,
      responsiveComponents: this.args.searchInterface.responsiveComponents
    });
  }
}
