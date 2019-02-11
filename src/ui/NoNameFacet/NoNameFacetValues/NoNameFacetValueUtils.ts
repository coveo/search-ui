import * as Globalize from 'globalize';
import { INoNameFacetOptions } from '../NoNameFacetOptions';
import { FacetUtils } from '../../Facet/FacetUtils';

export class NoNameFacetValueUtils {
  static getFormattedCount(count: number): string {
    return Globalize.format(count, 'n0');
  }

  static getValueCaption(value: string, options: INoNameFacetOptions): string {
    let returnValue = FacetUtils.tryToGetTranslatedCaption(<string>options.field, value);

    if (options.valueCaption && typeof options.valueCaption === 'object') {
      returnValue = options.valueCaption[value] || returnValue;
    }

    return returnValue;
  }
}
