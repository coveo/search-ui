import { KeywordsInput } from './KeywordsInput';
import { l } from '../../../strings/Strings';
import * as _ from 'underscore';

export class AnyKeywordsInput extends KeywordsInput {
  constructor() {
    super(l('AnyOfTheseWords'));
  }

  public getValue(): string {
    let value = super.getValue();
    let splitValues = value.split(' ');
    let generatedValue = '';
    _.each(splitValues, (splitValue) => {
      generatedValue += splitValue + ' OR ';
    });
    generatedValue = generatedValue.substr(0, generatedValue.length - 4);
    return generatedValue;
  }
}
