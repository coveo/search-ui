/// <reference path='Facet.ts' />
import { Facet } from './Facet';
import { StringUtils } from '../../utils/StringUtils';
import { QueryUtils } from '../../utils/QueryUtils';
import { FileTypes } from '../Misc/FileTypes';
import { DateUtils } from '../../utils/DateUtils';
import { Utils } from '../../utils/Utils';
import { $$ } from '../../utils/Dom';
import _ = require('underscore');

declare const Coveo;

export class FacetUtils {
  static getRegexToUseForFacetSearch(value: string, ignoreAccent: boolean) {
    return new RegExp(StringUtils.stringToRegex(value, ignoreAccent), 'i');
  }

  static getValuesToUseForSearchInFacet(original: string, facet: Facet): string[] {
    let ret = [original];
    let regex = this.getRegexToUseForFacetSearch(original, facet.options.facetSearchIgnoreAccents);
    if (facet.options.valueCaption) {
      _.chain(facet.options.valueCaption)
        .pairs()
        .filter((pair) => {
          return regex.test(pair[1]);
        })
        .each((match) => {
          ret.push(match[0]);
        });
      if (QueryUtils.isStratusAgnosticField(<string>facet.options.field, '@objecttype') || QueryUtils.isStratusAgnosticField(<string>facet.options.field, '@filetype')) {
        _.each(FileTypes.getFileTypeCaptions(), (value: string, key: string) => {
          if (!(key in facet.options.valueCaption) && regex.test(value)) {
            ret.push(key);
          }
        });
      }
    } else if (QueryUtils.isStratusAgnosticField(<string>facet.options.field, '@objecttype') || QueryUtils.isStratusAgnosticField(<string>facet.options.field, '@filetype')) {
      _.each(_.filter(_.pairs(FileTypes.getFileTypeCaptions()), (pair) => {
        return regex.test(pair[1]);
      }), (match) => {
        ret.push(match[0]);
      });
    } else if (QueryUtils.isStratusAgnosticField(<string>facet.options.field, '@month')) {
      _.each(_.range(1, 13), (month) => {
        if (regex.test(DateUtils.monthToString(month - 1))) {
          ret.push(('0' + month.toString()).substr(-2));
        }
      });
    }
    return ret;
  }

  static buildFacetSearchPattern(values: string[]) {
    values = _.map(values, (value) => {
      return Utils.escapeRegexCharacter(value);
    });
    values[0] = '.*' + values[0] + '.*';
    return values.join('|');
  }

  static needAnotherFacetSearch(currentSearchLength: number, newSearchLength: number, oldSearchLength: number, desiredSearchLength: number) {
    // Something was removed (currentSearch < newSearch)
    // && we might want to display more facet search result(currentSearch < desiredSearch)
    // && the new query returned more stuff than the old one so there's still more results(currentSearchLength > oldLength)
    return currentSearchLength < newSearchLength && currentSearchLength < desiredSearchLength && currentSearchLength > oldSearchLength;
  }

  static addNoStateCssClassToFacetValues(facet: Facet, container: HTMLElement) {
    // This takes care of adding the correct css class on each facet value checkbox (empty white box) if at least one value is selected in that facet
    if (facet.values.getSelected().length != 0) {
      let noStates = $$(container).findAll('li:not(.coveo-selected)');
      _.each(noStates, (noState) => {
        $$(noState).addClass('coveo-no-state');
      });
    }
  }

  static tryToGetTranslatedCaption(field: string, value: string) {
    let found: string;

    if (QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@filetype')) {
      found = FileTypes.getFileType(value.toLowerCase()).caption;
    } else if (QueryUtils.isStratusAgnosticField(field.toLowerCase(), '@month')) {
      try {
        let month = parseInt(value);
        found = DateUtils.monthToString(month - 1);
      } catch (ex) {
        // Do nothing
      }
    }
    return found != undefined && Utils.isNonEmptyString(found) ? found : value;
  }

  static clipCaptionsToAvoidOverflowingTheirContainer(facet: Facet, forceClip?: boolean) {
    // in new design, we don't need this : use flexbox instead (sorry IE user)
    if (facet.getBindings && facet.getBindings().searchInterface && facet.getBindings().searchInterface.isNewDesign()) {
      return;
    }
    if (!(Coveo.HierarchicalFacet && facet instanceof Coveo.HierarchicalFacet) || forceClip) {
      facet.logger.trace('Clipping captions');
      // force facet to show to calculate width
      $$(facet.element).show();
      let element = facet.element;
      let captions = $$(element).findAll('.coveo-facet-value-caption');
      for (let i = 0; i < captions.length; i++) {
        if (captions[i].style.width != '') {
          captions[i].style.width = '';
        }
      }
      let labels = $$(element).findAll('.coveo-facet-value-label-wrapper');
      let labelsMaxWidth: { element: HTMLElement; width: number; crop: number; label: HTMLElement; }[] = [];
      for (let i = 0; i < labels.length; i++) {
        let label: HTMLElement = labels[i];
        let caption: HTMLElement = $$(label).find('.coveo-facet-value-caption');

        let labelWidth = label.scrollWidth;
        let labelVisibleWidth = label.clientWidth;

        let captionWidth = caption.scrollWidth;

        let crop = Math.max(0, labelWidth - labelVisibleWidth);
        if (crop) {
          labelsMaxWidth.push({
            element: caption,
            width: captionWidth,
            crop: crop,
            label: label
          });
        }
      }
      // remove the specific css class
      element.style.display = '';
      for (let i = 0; i < labelsMaxWidth.length; i++) {
        let labelMaxWidth = labelsMaxWidth[i];
        labelMaxWidth.element.style.width = labelMaxWidth.width - labelMaxWidth.crop + 'px';
        if (labelMaxWidth.crop > 0) {
          labelMaxWidth.label.setAttribute('title', $$(labelMaxWidth.element).text());
        } else {
          labelMaxWidth.label.setAttribute('title', null);
        }
      }
    }
  }
}
