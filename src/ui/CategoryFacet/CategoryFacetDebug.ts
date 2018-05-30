import { CategoryFacet } from './CategoryFacet';
import { IBuildingQueryEventArgs, QueryEvents, IQuerySuccessEventArgs } from '../../events/QueryEvents';
import { AllowedValuesPatternType } from '../../rest/AllowedValuesPatternType';
import { IGroupByResult } from '../../rest/GroupByResult';
import { Utils } from '../../utils/Utils';
import { QueryBuilder } from '../Base/QueryBuilder';
import { sortBy, chain } from 'underscore';
import { Logger } from '../../misc/Logger';

class PathMap {
  get: (key: string) => PathMap;
  set: (key: string, value?: PathMap) => void;
}

export class CategoryFacetDebug {
  private positionInQuery: [number, number];
  constructor(private categoryFacet: CategoryFacet) {
    this.categoryFacet.bind.onRootElement<IBuildingQueryEventArgs>(QueryEvents.buildingQuery, args => this.addGroupBy(args));
    this.categoryFacet.bind.onRootElement<IQuerySuccessEventArgs>(QueryEvents.querySuccess, args => {
      args.results.groupByResults
        .slice(this.positionInQuery[0], this.positionInQuery[1])
        .forEach(groupByResult => CategoryFacetDebug.analyzeResults(groupByResult, this.categoryFacet.options.delimitingCharacter));
    });
  }

  private addGroupBy(args: IBuildingQueryEventArgs) {
    const firstPositionInQuery = args.queryBuilder.groupByRequests.length;
    if (this.categoryFacet.activePath.length == 0) {
      this.positionInQuery = [firstPositionInQuery, firstPositionInQuery + 1];
      this.addGroupByForEmptyPath(args.queryBuilder);
    } else {
      const path = this.categoryFacet.activePath;
      this.positionInQuery = [firstPositionInQuery, firstPositionInQuery + path.length];
      this.addGroupByForEachPathElement(args.queryBuilder, path);
    }
  }

  private addGroupByForEmptyPath(queryBuilder: QueryBuilder) {
    queryBuilder.groupByRequests.push({
      field: this.categoryFacet.options.field as string,
      injectionDepth: this.categoryFacet.options.injectionDepth
    });
  }

  private addGroupByForEachPathElement(queryBuilder: QueryBuilder, path: string[]) {
    path.forEach(pathElement => {
      queryBuilder.groupByRequests.push({
        field: this.categoryFacet.options.field as string,
        allowedValues: [`.*${Utils.escapeRegexCharacter(pathElement)}.*`],
        allowedValuesPatternType: AllowedValuesPatternType.Regex
      });
    });
  }

  /**
   *  This method expects group by results from a hierarchical field. It will find values with missing parents and values that are
   * potentially missing values in their path. It will log any issue found in the console.
   * @param groupByResults Group by results on a hierarhical field.
   */
  public static analyzeResults(groupByResults: IGroupByResult, delimiter: string) {
    const root: PathMap = new Map<string, PathMap>();
    const logger = new Logger(CategoryFacet);
    const orphans = [];
    let paths = chain(groupByResults.values)
      .pluck('value')
      .map((value: string) => value.split(delimiter))
      .sortBy(value => value.length)
      .value();

    paths = sortBy(paths, value => value.length);
    paths.forEach(path => {
      if (path.length == 1) {
        root.set(path[0], new Map<string, PathMap>());
      } else {
        let pathIsValid = true;
        const parentsOnly = path.slice(0, -1);
        let currentNode = root;
        parentsOnly.forEach(value => {});
        for (let i = 0; i < parentsOnly.length; i++) {
          currentNode = currentNode.get(parentsOnly[i]);
          if (!currentNode) {
            const formattedOrphan = path.join(delimiter);
            orphans.push(formattedOrphan);
            logger.error(`Value ${formattedOrphan} has no parents.`);
            pathIsValid = false;
            break;
          }
        }
        if (pathIsValid) {
          currentNode.set(path.slice(-1)[0], new Map<string, PathMap>());
        }
      }
    });
    return orphans;
  }
}
