import { IQueryResult } from '../../rest/QueryResult';
import { StringUtils } from '../../utils/StringUtils';
import { ResponsiveComponents } from '../ResponsiveComponents/ResponsiveComponents';
import * as _ from 'underscore';

export class TemplateConditionEvaluator {
  static getFieldFromString(text: string) {
    const acceptableCharacterInFieldName = '[a-z0-9_]';
    const fieldWithAtSymbolPrefix = `@(${acceptableCharacterInFieldName}+)\\b`;
    const rawFieldAccessedUsingDotOperator = `\\braw\\.(${acceptableCharacterInFieldName}+)\\b`;
    const fieldBetweenDoubleQuotes = `"[^"]*?(${acceptableCharacterInFieldName}+)[^"]*?"`;
    const fieldBetweenSingleQuotes = `'[^']*?(${acceptableCharacterInFieldName}+)[^']*?'`;
    const rawFieldAccessedUsingString = `\\braw\\[(?:${fieldBetweenDoubleQuotes}|${fieldBetweenSingleQuotes})\\]`;
    const fieldUsedInCondition = `data-condition-field-(?:not-)?(${acceptableCharacterInFieldName}+)=`;
    const fieldMatcher = new RegExp(
      `${fieldWithAtSymbolPrefix}|${rawFieldAccessedUsingDotOperator}|${rawFieldAccessedUsingString}|${fieldUsedInCondition}`,
      'gi'
    );
    const matchedFields = StringUtils.match(text, fieldMatcher);

    return _.map(matchedFields, match => _.find(match.splice(1), field => field));
  }

  static evaluateCondition(condition: string, result: IQueryResult, responsiveComponents = new ResponsiveComponents()): Boolean {
    let templateShouldBeLoaded = true;

    let fieldsInCondition = TemplateConditionEvaluator.getFieldFromString(condition);

    _.each(fieldsInCondition, (fieldInCondition: string) => {
      let matchingFieldValues = TemplateConditionEvaluator.evaluateMatchingFieldValues(fieldInCondition, condition);
      let fieldShouldNotBeNull =
        matchingFieldValues.length != 0 || TemplateConditionEvaluator.evaluateFieldShouldNotBeNull(fieldInCondition, condition);

      if (fieldShouldNotBeNull) {
        templateShouldBeLoaded = templateShouldBeLoaded && result.raw[fieldInCondition] != null;
      }
      if (templateShouldBeLoaded) {
        _.each(matchingFieldValues, (fieldValue: string) => {
          templateShouldBeLoaded = templateShouldBeLoaded && result.raw[fieldInCondition].toLowerCase() == fieldValue.toLowerCase();
        });
      }
    });

    if (templateShouldBeLoaded) {
      if (TemplateConditionEvaluator.evaluateShouldUseSmallScreen(condition)) {
        templateShouldBeLoaded = templateShouldBeLoaded && responsiveComponents.isSmallScreenWidth();
      }
    }
    return templateShouldBeLoaded;
  }

  private static evaluateMatchingFieldValues(field: string, condition: string) {
    let foundForCurrentField = [];
    // try to get the field value in the format raw.filetype == "YouTubeVideo"
    let firstRegexToGetValue = new RegExp(`raw\\.${field}\\s*=+\\s*["|']([a-zA-Z]+)["|']`, 'gi');
    // try to get the field value in the format raw['filetype'] == "YouTubeVideo"
    let secondRegexToGetValue = new RegExp(`raw\\[["|']${field}["|']\\]\\s*=+\\s*["|']([a-zA-Z]+)["|']`, 'gi');

    let matches = StringUtils.match(condition, firstRegexToGetValue).concat(StringUtils.match(condition, secondRegexToGetValue));
    matches.forEach(match => {
      foundForCurrentField = foundForCurrentField.concat(match[1]);
    });
    return _.unique(foundForCurrentField);
  }

  private static evaluateFieldShouldNotBeNull(field: string, condition: string): boolean {
    let firstRegexToMatchNonNull = new RegExp(`raw\\.${field}\\s*!=\\s*(?=null|undefined)`, 'gi');
    let secondRegexToMatchNonNull = new RegExp(`raw\\[["|']${field}["|']\\]\\s*!=\\s*(?=null|undefined)`, 'gi');
    return condition.match(firstRegexToMatchNonNull) != null || condition.match(secondRegexToMatchNonNull) != null;
  }

  private static evaluateShouldUseSmallScreen(condition: string) {
    return condition.match(/Coveo\.DeviceUtils\.isSmallScreenWidth/gi);
  }
}
