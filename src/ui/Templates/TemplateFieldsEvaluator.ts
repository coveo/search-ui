import { IQueryResult } from '../../rest/QueryResult';
import { IFieldsToMatch } from './Template';
import { each, find } from 'underscore';

export class TemplateFieldsEvaluator {
  public static evaluateFieldsToMatch(toMatches: IFieldsToMatch[], result: IQueryResult): boolean {
    let templateShouldBeLoaded = true;
    if (!toMatches) return true;
    each(toMatches, (toMatch: IFieldsToMatch) => {
      let matchAtLeastOnce = false;
      if (!toMatch.values) {
        matchAtLeastOnce = result.raw[toMatch.field] != null;
      } else {
        each(toMatch.values, value => {
          if (!matchAtLeastOnce) {
            const fieldValue: string | string[] = result.raw[toMatch.field];
            const fieldValues = TemplateFieldsEvaluator.getFieldValueAsArray(fieldValue);
            matchAtLeastOnce = TemplateFieldsEvaluator.isMatch(fieldValues, value);
          }
        });
      }
      templateShouldBeLoaded = templateShouldBeLoaded && (toMatch.reverseCondition ? !matchAtLeastOnce : matchAtLeastOnce);
    });
    return templateShouldBeLoaded;
  }

  private static getFieldValueAsArray(fieldValue: string | string[]): string[] {
    return typeof fieldValue === 'string' ? [fieldValue] : fieldValue;
  }

  private static isMatch(fieldValues: string[], value: string) {
    return find(fieldValues, fieldValue => fieldValue.toLowerCase() == value.toLowerCase()) != undefined;
  }
}
