import { any, clone, each, map, sortBy, without } from 'underscore';
import { IBuildingQueryEventArgs, IPreprocessResultsEventArgs, QueryEvents } from '../../events/QueryEvents';
import { exportGlobally } from '../../GlobalExports';
import { Assert } from '../../misc/Assert';
import { IQuery } from '../../rest/Query';
import { IQueryResult } from '../../rest/QueryResult';
import { IQueryResults } from '../../rest/QueryResults';
import { $$ } from '../../utils/Dom';
import { Utils } from '../../utils/Utils';
import { Component } from '../Base/Component';
import { IComponentBindings } from '../Base/ComponentBindings';
import { ComponentOptions } from '../Base/ComponentOptions';
import { IFieldOption, IQueryExpression } from '../Base/IComponentOptions';
import { Initialization } from '../Base/Initialization';
import { QueryBuilder } from '../Base/QueryBuilder';
import { SortCriteria } from '../Sort/SortCriteria';

export interface IFoldingOptions {
  field?: IFieldOption;
  child?: IFieldOption;
  parent?: IFieldOption;

  childField?: IFieldOption;
  parentField?: IFieldOption;

  range?: number;
  rearrange?: SortCriteria;

  enableExpand?: boolean;
  expandExpression?: IQueryExpression;
  maximumExpandedResults?: number;

  /**
   * Manage folding for each results individually
   */
  getResult?: (result: IQueryResult) => IQueryResult;
  /**
   * Manage folding of all more results
   */
  getMoreResults?: (results: IQueryResult[]) => IQueryResult[];
}

interface IResultNode {
  score: number;
  parent?: IResultNode;
  result: IQueryResult;
  children: IResultNode[];
}

/**
 * The `Folding` component makes it possible to render hierarchic representations of search results sharing a common
 * [`field`]{@link Folding.options.field}.
 *
 * This component has no visual impact on its own. It simply folds certain search results so that the
 * [`ResultFolding`]{@link ResultFolding} and [`ResultAttachments`]{@link ResultAttachments} components can then nicely
 * render them within result templates (see [Result Templates](https://docs.coveo.com/en/413/)).
 *
 * A typical use case of the `Folding` component is to fold email conversations and message board threads results in a
 * result set in order to display them in a convenient format. Messages belonging to a single conversation typically
 * have a unique conversation ID. By indexing this ID on a field, you can use it to fold search results (see
 * [Folding Results](https://docs.coveo.com/en/428/)).
 *
 * **Note:**
 * > There can only be one `Folding` component per [`Tab`]{@link Tab} component.
 *
 */
export class Folding extends Component {
  static ID = 'Folding';

  static doExport = () => {
    exportGlobally({
      Folding: Folding
    });
  };

  /**
   * The options for the component
   * @componentOptions
   */
  static options: IFoldingOptions = {
    /**
     * Specifies the name of the field on which to do the folding.
     *
     * Specifying a value for this option is required for this component to work.
     *
     * **Note:**
     * > In an Elasticsearch index, the corresponding field must be configured as a *Facet* field
     * > (see [Add or Edit Fields](https://docs.coveo.com/en/1982/)).
     * > This limitation does not apply to Coveo indexes.
     *
     * Default value is `@foldingcollection`.
     */
    field: ComponentOptions.buildFieldOption({ defaultValue: '@foldingcollection' }),
    /**
     * Specifies the field that determines whether a certain result is a child of another top result.
     *
     * **Note:**
     * > In the index, the values of the corresponding field must:
     * > - Contain alphanumerical characters only.
     * > - Contain no more than 60 characters.
     *
     * Default value is `@foldingchild`.
     */
    child: ComponentOptions.buildFieldOption({ defaultValue: '@foldingchild' }),
    /**
     * Specifies the field that determines whether a certain result is a top result containing other child results.
     *
     * **Note:**
     * > In the index, the values of the corresponding field must:
     * > - Contain alphanumerical characters only.
     * > - Contain no more than 60 characters.
     *
     * Default value is `@foldingparent`.
     */
    parent: ComponentOptions.buildFieldOption({ defaultValue: '@foldingparent' }),

    /**
     * This option is deprecated. Instead, use the {@link Folding.options.parent} option.
     * @deprecated
     */
    childField: ComponentOptions.buildFieldOption({
      deprecated: 'This option is deprecated. Instead, use the data-parent option.'
    }),
    /**
     * This option is deprecated. Instead, use the {@link Folding.options.child} option.
     * @deprecated
     */
    parentField: ComponentOptions.buildFieldOption({
      deprecated: 'This option is deprecated. Instead, use the data-child option.'
    }),

    /**
     * Specifies the maximum number of child results to fold.
     *
     * **Example:**
     * > For an email thread with a total of 20 messages, using the default value of `2` means that the component loads
     * > up to a maximum of 2 child messages under the original message, unless the end user expands the entire
     * > conversation using the **Show More** link (see the [`enableExpand`]{@link Folding.options.enableExpand}
     * > option).
     *
     * Default value is `2`. Minimum value is `0`.
     */
    range: ComponentOptions.buildNumberOption({ defaultValue: 2, min: 0 }),

    /**
     * Specifies the sort criteria to apply to the top result and its child results (e.g., `date ascending`,
     * `@myfield descending`, etc.). See [sortCriteria](https://docs.coveo.com/en/1461/#RestQueryParameters-sortCriteria).
     *
     * This option works from the results returned by the index. This means that if only the three most relevant folded results are returned by the index
     * and you choose to rearrange the folded results by date, then the three most relevant results will be rearranged by date,
     * meaning that the first folded result is not necessarily the oldest or newest item.
     *
     * However, since clicking on the `Show More` button triggers a new query, you would receive new results based on the sort criteria of this option.
     *
     * **Example**
     * > If you are folding email results by conversation and you specify `date descending` as the `rearrange` value of
     * > the `Folding` component, the component re-arranges email conversations so that the newest email is always the
     * > top result. Specifying `date ascending` instead always makes the original email the top result, as it is also
     * > necessarily the oldest.
     *
     * By default, the component displays the results in the order that the index returns them.
     */
    rearrange: ComponentOptions.buildCustomOption(value => (Utils.isNonEmptyString(value) ? SortCriteria.parse(value) : null)),

    /**
     * Specifies whether to add a callback function on the top result, allowing to make an additional query to load all
     * of its child results (e.g., to load all conversations of a given thread).
     *
     * Concretely, the [`ResultFolding`]{@link ResultFolding} component uses this for its **Show More** link.
     *
     * See also the [`expandExpression`]{@link Folding.options.expandExpression} and
     * [`maximumExpandedResults`]{@link Folding.options.maximumExpandedResults} options.
     *
     * Default value is `true`.
     */
    enableExpand: ComponentOptions.buildBooleanOption({ defaultValue: true }),
    /**
     * If the [`enableExpand`]{@link Folding.options.enableExpand} option is `true`, specifies a custom constant
     * expression to send when querying the expanded results.
     *
     * Default value is `undefined`.
     */
    expandExpression: ComponentOptions.buildQueryExpressionOption({ depend: 'enableExpand' }),

    /**
     * If the [`enableExpand`]{@link Folding.options.enableExpand} option is `true`, specifies the maximum number of
     * results to load when expanding.
     *
     * Default value is `100`. Minimum value is `1`.
     */
    maximumExpandedResults: ComponentOptions.buildNumberOption({ defaultValue: 100, min: 1, depend: 'enableExpand' }),

    /**
     * Specifies the function that manages the individual folding of each result.
     *
     * Default value is:
     *
     * ```javascript
     * var results = result.childResults || [];
     * // Add the top result at the top of the list.
     * results.unshift(result);
     * // Empty childResults just to clean it.
     * result.childResults = [];
     * // Fold those results.
     * results = Coveo.Folding.foldWithParent(results);
     * // The first result is the top one.
     * var topResult = results.shift();
     * // All other results are childResults.
     * topResult.childResults = results;
     * return topResult;
     * ```
     *
     * You can pre-process all the result with this option in the [`init`]{@link init} call of your search interface:
     *
     * ```javascript
     * Coveo.init(document.querySelector('#search'), {
     *    Folding: {
     *      getResult: function(result) {
     *        result = Coveo.Folding.defaultGetResult(result);
     *        // Your code here
     *      }
     *    }
     * })
     * ```
     */
    getResult: ComponentOptions.buildCustomOption<(result: IQueryResult) => IQueryResult>(() => {
      return null;
    }),

    /**
     * Specifies the function that manages the folding of all results.
     *
     * Default value is:
     *
     * ```javascript
     * Coveo.Folding.defaultGetMoreResults = function(results) {
     *    // The results are flat, just do the folding.
     *    return Coveo.Folding.foldWithParent(results);
     * }
     * ```
     */
    getMoreResults: ComponentOptions.buildCustomOption<(results: IQueryResult[]) => IQueryResult[]>(() => {
      return null;
    })
  };

  /**
   * Creates a new `Folding` component.
   * @param element The HTMLElement on which to instantiate the component.
   * @param options The options for the `Folding` component.
   * @param bindings The bindings that the component requires to function normally. If not set, these will be
   * automatically resolved (with a slower execution time).
   */
  constructor(public element: HTMLElement, public options: IFoldingOptions, bindings?: IComponentBindings) {
    super(element, Folding.ID, bindings);

    this.options = ComponentOptions.initComponentOptions(element, Folding, options);

    Assert.check(Utils.isCoveoField(<string>this.options.field), this.options.field + ' is not a valid field');
    Assert.exists(this.options.maximumExpandedResults);

    this.swapParentChildFoldingFields();

    this.bind.onRootElement(QueryEvents.buildingQuery, this.handleBuildingQuery);
    this.bind.onRootElement(QueryEvents.preprocessResults, this.handlepreprocessResults);
  }

  // From a list of results, return a list of results and their attachments
  // We use parentResult to build a tree of result
  static foldWithParent(queryResults: IQueryResult[]): IQueryResult[] {
    const rootNode: IResultNode = {
      score: Number.NEGATIVE_INFINITY,
      children: [],
      result: <IQueryResult>{
        raw: false
      }
    };

    each(queryResults, (queryResult: IQueryResult, i: number) => {
      let resultNode = Folding.findUniqueId(rootNode.children, queryResult.uniqueId);
      // If he have no parent or is parent is him self, add it to the root
      if (queryResult.parentResult == null || queryResult.parentResult.uniqueId == queryResult.uniqueId) {
        // Add it only if he do not exist
        if (resultNode == null) {
          resultNode = {
            result: queryResult,
            score: i,
            children: []
          };
          rootNode.children.push(resultNode);
          resultNode.parent = rootNode;
        }
      } else {
        // If the resultNode already exist
        if (resultNode != null) {
          resultNode.score = Math.min(i, resultNode.score);
          // Remove himself from his parent because it will be added in his parent. This allowed to remove duplicate.
          resultNode.parent.children = without(resultNode.parent.children, resultNode);
        } else {
          resultNode = {
            result: queryResult,
            score: i,
            children: []
          };
        }

        let parentResult = Folding.findUniqueId(rootNode.children, queryResult.parentResult.uniqueId);
        // If the parent does not already exist, create it and add it the root
        if (parentResult == null) {
          parentResult = {
            result: queryResult.parentResult,
            score: Number.POSITIVE_INFINITY,
            children: []
          };
          rootNode.children.push(parentResult);
          parentResult.parent = rootNode;
        }
        // Add the resultNode to parent
        parentResult.children.push(resultNode);
        resultNode.parent = parentResult;
        let parent = parentResult;
        while (parent != null && resultNode.score < parent.score) {
          parent.score = resultNode.score;
          parent = parent.parent;
        }
      }
    });
    const rootResult = Folding.resultNodeToQueryResult(rootNode);
    // Remove the root from all results
    each(rootResult.attachments, attachment => (attachment.parentResult = null));
    return rootResult.attachments;
  }

  // 99.9% of the folding case will be alright with those default functions.
  // Otherwise use the options getResult and getMoreResults
  public static defaultGetResult(result: IQueryResult) {
    let results: IQueryResult[] = result.childResults || [];
    // Add the top result at the top of the list
    results.unshift(result);
    // Empty childResults just to make it more clean
    result.childResults = [];
    // Fold those results
    results = Folding.foldWithParent(results);
    // The first result is the top one
    const topResult = results.shift();
    // All other the results are childResults
    topResult.childResults = results;

    return topResult;
  }

  public static defaultGetMoreResults(results: IQueryResult[]) {
    // The result are flat, just do the fold
    return Folding.foldWithParent(results);
  }

  // Convert ResultNode to QueryResult
  private static resultNodeToQueryResult(resultNode: IResultNode): IQueryResult {
    const result = resultNode.result;
    result.attachments = map(sortBy(resultNode.children, 'score'), Folding.resultNodeToQueryResult);
    result.parentResult = resultNode.parent != null ? resultNode.parent.result : null;
    return result;
  }

  private static findUniqueId(resultNodes: IResultNode[], uniqueId: string): IResultNode {
    for (let i = 0; i < resultNodes.length; i++) {
      if (resultNodes[i].result.uniqueId == uniqueId) {
        return resultNodes[i];
      }
      const resultNode = Folding.findUniqueId(resultNodes[i].children, uniqueId);
      if (resultNode != null) {
        return resultNode;
      }
    }
    return null;
  }

  private swapParentChildFoldingFields() {
    // Swap "old" childField and parentField and assign them to the "new" parent option
    // This needs to be done because connectors push the default data in *reverse* order compared to what the index expect.
    if (this.options.childField != null) {
      this.logger.warn('Detecting usage of deprecated option "childField". Assigning it automatically to the "parent" option instead.');
      this.logger.warn('The option definition was changed to support universal folding across all sources.');
      this.logger.warn('To remove this warning, rename the "childField" option (data-child-field) to "parent" (data-parent).');
      this.options.parent = this.options.childField;
    }

    if (this.options.parentField != null) {
      this.logger.warn('Detecting usage of deprecated option "parentField". Assigning it automatically to the "child" option instead.');
      this.logger.warn('The option definition was changed to support universal folding across all sources.');
      this.logger.warn('To remove this warning, rename the "parentField" option (data-parent-field) to "child" (data-child).');
      this.options.child = this.options.parentField;
    }
  }

  private handleBuildingQuery(data: IBuildingQueryEventArgs) {
    Assert.exists(data);

    if (!this.disabled) {
      data.queryBuilder.childField = <string>this.options.parent;
      data.queryBuilder.parentField = <string>this.options.child;
      data.queryBuilder.filterField = <string>this.options.field;
      data.queryBuilder.filterFieldRange = this.options.range;

      data.queryBuilder.requiredFields.push(<string>this.options.field);
      if (this.options.parent != null) {
        data.queryBuilder.requiredFields.push(<string>this.options.parent);
      }
      if (this.options.child != null) {
        data.queryBuilder.requiredFields.push(<string>this.options.child);
      }
    }
  }

  private handlepreprocessResults(data: IPreprocessResultsEventArgs) {
    Assert.exists(data);
    Assert.check(
      !data.results._folded,
      'Two or more Folding components are active at the same time for the same Tab. Cannot process the results.'
    );
    data.results._folded = true;

    const queryResults = data.results;

    const getResult: (result: IQueryResult) => IQueryResult = this.options.getResult || Folding.defaultGetResult;
    queryResults.results = map(queryResults.results, getResult);

    if (this.options.rearrange) {
      queryResults.results.forEach(result => {
        result.childResults = sortBy(result.childResults, result => Utils.getFieldValue(result, this.options.rearrange.sort));
        if (this.shouldBeReversed(result.childResults)) {
          result.childResults = result.childResults.reverse();
        }
      });
    }

    this.addLoadMoreHandler(<IQueryResult[]>queryResults.results, data.query);
  }

  private shouldBeReversed(childResults: IQueryResult[]) {
    if (this.options.rearrange.direction == 'ascending') {
      return false;
    }
    const childMissingSortByValue = any(childResults, childResult => {
      return Utils.isNullOrUndefined(Utils.getFieldValue(childResult, this.options.rearrange.sort));
    });
    if (childMissingSortByValue) {
      return false;
    }
    return true;
  }

  private addLoadMoreHandler(results: IQueryResult[], originalQuery: IQuery) {
    return map(results, result => {
      if (this.options.enableExpand && !Utils.isNullOrUndefined(Utils.getFieldValue(result, <string>this.options.field))) {
        result.moreResults = () => {
          return this.moreResults(result, originalQuery);
        };
      }
      return result;
    });
  }

  private moreResults(result: IQueryResult, originalQuery: IQuery): Promise<IQueryResult[]> {
    const query = clone(originalQuery);
    const builder = new QueryBuilder();

    query.numberOfResults = this.options.maximumExpandedResults;
    const fieldValue = Utils.getFieldValue(result, <string>this.options.field);

    if (Utils.isNonEmptyString(fieldValue)) {
      builder.advancedExpression.addFieldExpression(<string>this.options.field, '=', [fieldValue]);
      query.aq = builder.build().aq;
    }

    if (Utils.isNonEmptyString(originalQuery.q)) {
      // We add keywords to get the highlight and we add @uri to get all results
      // To ensure it plays nicely with query syntax, we ensure that the needed part of the query
      // are correctly surrounded with the no syntax block
      if (originalQuery.enableQuerySyntax) {
        query.q = `( ${originalQuery.q} ) OR @uri`;
      } else {
        query.enableQuerySyntax = true;
        query.q = `( <@- ${originalQuery.q} -@> ) OR @uri`;
      }
    }

    if (Utils.isNonEmptyString(this.options.expandExpression)) {
      query.cq = this.options.expandExpression;
    }

    if (this.options.child != null) {
      query.parentField = <string>this.options.child;
    }

    if (this.options.parent != null) {
      query.childField = <string>this.options.parent;
    }

    query.filterField = null;
    query.filterFieldRange = null;
    query.firstResult = 0;

    if (this.options.rearrange) {
      this.options.rearrange.putInQueryBuilder(builder);
      query.sortCriteria = builder.sortCriteria;
      query.sortField = builder.sortField;
    } else {
      query.sortCriteria = originalQuery.sortCriteria;
      query.sortField = originalQuery.sortField;
    }

    return this.queryController
      .getEndpoint()
      .search(query)
      .then((results: IQueryResults) => {
        this.handlePreprocessMoreResults(results);
        return results.results;
      })
      .catch(e => {
        this.logger.error(`Invalid query performed while trying to retrieve more results for folding.`, e);
        return [];
      });
  }

  private handlePreprocessMoreResults(queryResults: IQueryResults) {
    const getResults: (results: IQueryResult[]) => IQueryResult[] = this.options.getMoreResults || Folding.defaultGetMoreResults;
    queryResults.results = getResults(queryResults.results);
    $$(this.element).trigger(QueryEvents.preprocessMoreResults, {
      results: queryResults
    });
  }
}

Initialization.registerAutoCreateComponent(Folding);
