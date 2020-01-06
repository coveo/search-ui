import { CategoryFacet } from './CategoryFacet';
import { IBuildingQueryEventArgs, QueryEvents, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { IGroupByResult } from '../../rest/GroupByResult';
import { QueryBuilder } from '../Base/QueryBuilder';
import { sortBy, chain } from 'underscore';
import { Logger } from '../../misc/Logger';
import { IGroupByValue } from '../../rest/GroupByValue';

class PathMap {
  get: (key: string) => PathMap;
  set: (key: string, value?: PathMap) => void;
}

type DebugGroupByPositionInQuery = {
  start: number;
  end: number;
};

export class CategoryFacetDebug {
  private static logger = new Logger(CategoryFacet);
  private positionInQuery: DebugGroupByPositionInQuery;
  constructor(private categoryFacet: CategoryFacet) {
    this.categoryFacet.bind.onRootElement<IBuildingQueryEventArgs>(QueryEvents.buildingQuery, args => this.handleBuildingQuery(args));
    this.categoryFacet.bind.onRootElement<IQuerySuccessEventArgs>(QueryEvents.querySuccess, args => {
      this.handleQuerySuccess(args);
    });
  }

  private handleBuildingQuery(args: IBuildingQueryEventArgs) {
    const firstPositionInQuery = args.queryBuilder.groupByRequests.length;
    if (this.categoryFacet.activePath.length == 0) {
      this.positionInQuery = { start: firstPositionInQuery, end: firstPositionInQuery + 1 };
      this.addGroupByForEmptyPath(args.queryBuilder);
    } else {
      const path = this.categoryFacet.activePath;
      this.positionInQuery = { start: firstPositionInQuery, end: firstPositionInQuery + path.length };
      this.addGroupByForEachPathElement(args.queryBuilder, path);
    }
  }

  private handleQuerySuccess(args: IQuerySuccessEventArgs) {
    args.results.groupByResults
      .slice(this.positionInQuery.start, this.positionInQuery.end)
      .forEach(groupByResult => CategoryFacetDebug.analyzeResults(groupByResult, this.categoryFacet.options.delimitingCharacter));
  }

  private addGroupByForEmptyPath(queryBuilder: QueryBuilder) {
    queryBuilder.groupByRequests.push({
      field: this.categoryFacet.options.field as string,
      injectionDepth: this.categoryFacet.options.injectionDepth
    });
  }

  private addGroupByForEachPathElement(queryBuilder: QueryBuilder, path: string[]) {
    path.forEach(pathElement => {
      this.categoryFacet.categoryFacetQueryController.addDebugGroupBy(queryBuilder, pathElement);
    });
  }

  public static analyzeResults(groupByResults: IGroupByResult, delimiter: string) {
    const treeRoot: PathMap = new Map<string, PathMap>();
    const orphans: string[] = [];

    let paths = this.buildPathsFromGroupByValues(groupByResults.values, delimiter);
    paths = sortBy(paths, value => value.length);

    paths.forEach(path => {
      if (path.length == 1) {
        this.addFirstNodeToTree(treeRoot, path);
      } else {
        let pathIsValid = true;
        const parentsOnly = path.slice(0, -1);
        let currentNode = treeRoot;
        for (const parent of parentsOnly) {
          currentNode = currentNode.get(parent);
          if (!currentNode) {
            this.processOrphan(orphans, path, delimiter);
            pathIsValid = false;
            break;
          }
        }
        if (pathIsValid) {
          this.addValidNodeToTree(currentNode, path);
        }
      }
    });
    return orphans;
  }

  private static buildPathsFromGroupByValues(values: IGroupByValue[], delimiter: string) {
    return chain(values)
      .pluck('value')
      .map((value: string) => value.split(delimiter))
      .sortBy(value => value.length)
      .value();
  }

  private static addFirstNodeToTree(treeRoot: PathMap, path: string[]) {
    treeRoot.set(path[0], new Map<string, PathMap>());
  }

  private static addValidNodeToTree(node: PathMap, path: string[]) {
    node.set(path.slice(-1)[0], new Map<string, PathMap>());
  }

  private static processOrphan(orphans: string[], path: string[], delimiter: string) {
    const formattedOrphan = path.join(delimiter);
    orphans.push(formattedOrphan);
    this.logger.error(`Value ${formattedOrphan} has no parent.`);
  }
}
