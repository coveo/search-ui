/// <reference path='Facet.ts' />
import { StringUtils } from '../../utils/StringUtils';
import { QueryUtils } from '../../utils/QueryUtils';
import { FileTypes } from '../Misc/FileTypes';
import { DateUtils } from '../../utils/DateUtils';
import { Utils } from '../../utils/Utils';
import { $$ } from '../../utils/Dom';
import * as _ from 'underscore';
import FacetModuleDefinition = require('./Facet');
import { l } from '../../strings/Strings';

export class FacetUtils {
  static getRegexToUseForFacetSearch(value: string, ignoreAccent: boolean) {
    return new RegExp(StringUtils.stringToRegex(value, ignoreAccent), 'i');
  }

  static getDisplayValueFromValueCaption(value: string, field: string, valueCaption: Record<string, string>) {
    const returnValue = this.tryToGetTranslatedCaption(field, value, false);
    return valueCaption[value] || returnValue;
  }

  static getValuesToUseForSearchInFacet(original: string, facet: FacetModuleDefinition.Facet): string[] {
    let ret = [original];
    let regex = this.getRegexToUseForFacetSearch(original, facet.options.facetSearchIgnoreAccents);
    if (facet.options.valueCaption) {
      _.chain(facet.options.valueCaption)
        .pairs()
        .filter(pair => {
          return regex.test(pair[1]);
        })
        .each(match => {
          ret.push(match[0]);
        });
      if (
        QueryUtils.isStratusAgnosticField(<string>facet.options.field, '@objecttype') ||
        QueryUtils.isStratusAgnosticField(<string>facet.options.field, '@filetype')
      ) {
        _.each(FileTypes.getFileTypeCaptions(), (value: string, key: string) => {
          if (!(key in facet.options.valueCaption) && regex.test(value)) {
            ret.push(key);
          }
        });
      }
    } else if (
      QueryUtils.isStratusAgnosticField(<string>facet.options.field, '@objecttype') ||
      QueryUtils.isStratusAgnosticField(<string>facet.options.field, '@filetype')
    ) {
      _.each(
        _.filter(_.pairs(FileTypes.getFileTypeCaptions()), pair => {
          return regex.test(pair[1]);
        }),
        match => {
          ret.push(match[0]);
        }
      );
    } else if (QueryUtils.isStratusAgnosticField(<string>facet.options.field, '@month')) {
      _.each(_.range(1, 13), month => {
        if (regex.test(DateUtils.monthToString(month - 1))) {
          ret.push(('0' + month.toString()).substr(-2));
        }
      });
    }
    return ret;
  }

  static buildFacetSearchPattern(values: string[]) {
    values = _.map(values, value => {
      return Utils.escapeRegexCharacter(value);
    });
    values[0] = '.*' + values[0] + '.*';
    return values.join('|');
  }

  static needAnotherFacetSearch(
    currentSearchLength: number,
    newSearchLength: number,
    oldSearchLength: number,
    desiredSearchLength: number
  ) {
    // Something was removed (currentSearch < newSearch)
    // && we might want to display more facet search result(currentSearch < desiredSearch)
    // && the new query returned more stuff than the old one so there's still more results(currentSearchLength > oldLength)
    return currentSearchLength < newSearchLength && currentSearchLength < desiredSearchLength && currentSearchLength > oldSearchLength;
  }

  static addNoStateCssClassToFacetValues(facet: FacetModuleDefinition.Facet, container: HTMLElement) {
    // This takes care of adding the correct css class on each facet value checkbox (empty white box) if at least one value is selected in that facet
    if (facet.values.getSelected().length != 0) {
      let noStates = $$(container).findAll('li:not(.coveo-selected)');
      _.each(noStates, noState => {
        $$(noState).addClass('coveo-no-state');
      });
    }
  }

  static tryToGetTranslatedCaption(field: string, value: string, fallbackOnLocalization = true) {
    let found: string;

    if (QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@filetype')) {
      found = FileTypes.getFileType(value, fallbackOnLocalization).caption;
    } else if (QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@objecttype')) {
      found = FileTypes.getObjectType(value, fallbackOnLocalization).caption;
    } else if (FacetUtils.isMonthFieldValue(field, value)) {
      const month = parseInt(value, 10);
      found = DateUtils.monthToString(month - 1);
    } else if (fallbackOnLocalization) {
      found = l(value);
    }
    return found != undefined && Utils.isNonEmptyString(found) ? found : value;
  }

  static isMonthFieldValue(field: string, value: string) {
    if (!QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@month')) {
      return false;
    }

    const asInt = parseInt(value, 10);

    if (isNaN(asInt)) {
      return false;
    }

    if (asInt < 1 || asInt > 12) {
      return false;
    }

    return true;
  }
}
