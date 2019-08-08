import { IQueryResults } from '../../rest/QueryResults';
import { IQueryResult } from '../../rest/QueryResult';
import { Assert, QueryUtils, Component, Initialization, QueryStateModel } from '../../Core';
import { IInitResult } from '../Base/Initialization';
import { Template } from './Template';
import { SearchInterface } from '../../ui/SearchInterface/SearchInterface';
import { ResultList } from '../ResultList/ResultList';
import { RendererValidLayout } from '../ResultLayoutSelector/ValidLayout';
import { pluck, sortBy, map } from 'underscore';
import { $$ } from '../../utils/Dom';
import { Logger } from '../../misc/Logger';

export interface ITemplateToHtml {
  resultTemplate: Template;
  queryStateModel: QueryStateModel;
  searchInterface: SearchInterface;
}

export class TemplateToHtml {
  constructor(public args: ITemplateToHtml) {}

  public async buildResults(
    results: IQueryResults,
    layout: RendererValidLayout,
    currentlyDisplayedResults: IQueryResult[]
  ): Promise<HTMLElement[]> {
    const res: { elem: HTMLElement; idx: number }[] = [];
    const resultsPromises = map(results.results, (result: IQueryResult, index: number) => {
      return this.buildResult(result, layout, currentlyDisplayedResults).then((resultElement: HTMLElement) => {
        if (resultElement != null) {
          res.push({ elem: resultElement, idx: index });
        }
        ResultList.resultCurrentlyBeingRendered = null;
        return resultElement;
      });
    });

    // We need to sort by the original index order, because in lazy loading mode, it's possible that results does not gets rendered
    // in the correct order returned by the index, depending on the time it takes to load all the results component for a given result template
    return Promise.all(resultsPromises).then(() => {
      return pluck(sortBy(res, 'idx'), 'elem');
    });
  }

  public async buildResult(
    result: IQueryResult,
    layout: RendererValidLayout,
    currentlyDisplayedResults: IQueryResult[]
  ): Promise<HTMLElement> {
    Assert.exists(result);
    QueryUtils.setStateObjectOnQueryResult(this.args.queryStateModel.get(), result);
    QueryUtils.setSearchInterfaceObjectOnQueryResult(this.args.searchInterface, result);
    ResultList.resultCurrentlyBeingRendered = result;
    const resultElement = await this.createHtmlElement(result, layout);

    if (resultElement != null) {
      Component.bindResultToElement(resultElement, result);
    }
    currentlyDisplayedResults.push(result);

    await this.autoCreateComponentsInsideResult(resultElement, result).initResult;

    this.verifyChildren(resultElement);
    return resultElement;
  }

  public autoCreateComponentsInsideResult(element: HTMLElement, result: IQueryResult): IInitResult {
    Assert.exists(element);
    return Initialization.automaticallyCreateComponentsInsideResult(element, result);
  }

  private createHtmlElement(result: IQueryResult, layout: RendererValidLayout) {
    return this.args.resultTemplate.instantiateToElement(result, {
      wrapInDiv: true,
      checkCondition: true,
      currentLayout: layout,
      responsiveComponents: this.args.searchInterface.responsiveComponents
    });
  }

  private verifyChildren(element: HTMLElement) {
    const containsResultLink = !!$$(element).find('.CoveoResultLink');
    if (containsResultLink) {
      return;
    }

    const msg = `Result does not contain a "CoveoResultLink" component, please verify the result template`;
    new Logger(element).warn(msg, this.args.resultTemplate);
  }
}
