import { KeywordsInput } from './KeywordsInput';
import { l } from '../../../strings/Strings';
import * as _ from 'underscore';

export class NoneKeywordsInput extends KeywordsInput {
  constructor(public root: HTMLElement) {
    super(l('NoneOfTheseWords'), root);
  }

  public getValue(): string {
    let value = super.getValue();
    let generatedValue = '';

    if (value) {
      let splitValues = value.split(' ');
      _.each(splitValues, splitValue => {
        generatedValue += ' NOT ' + splitValue;
      });
      generatedValue = generatedValue.substr(1);
    }

    return generatedValue;
  }
}
