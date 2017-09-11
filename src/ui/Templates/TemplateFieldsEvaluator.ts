import { IQueryResult } from '../../rest/QueryResult';
import { IFieldsToMatch } from './Template';
import * as _ from 'underscore';

export class TemplateFieldsEvaluator {
  public static evaluateFieldsToMatch(toMatches: IFieldsToMatch[], result: IQueryResult): boolean {
    let templateShouldBeLoaded = true;
    _.each(toMatches, (toMatch: IFieldsToMatch) => {
      let matchAtLeastOnce = false;
      if (!toMatch.values) {
        matchAtLeastOnce = result.raw[toMatch.field] != null;
      } else {
        _.each(toMatch.values, value => {
          if (!matchAtLeastOnce) {
            matchAtLeastOnce = result.raw[toMatch.field] && result.raw[toMatch.field].toLowerCase() == value.toLowerCase();
          }
        });
      }
      templateShouldBeLoaded = templateShouldBeLoaded && matchAtLeastOnce;
    });
    return templateShouldBeLoaded;
  }
}
