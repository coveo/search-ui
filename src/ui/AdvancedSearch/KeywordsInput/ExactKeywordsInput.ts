import { KeywordsInput } from './KeywordsInput';
import { l } from '../../../strings/Strings';

export class ExactKeywordsInput extends KeywordsInput {
  constructor() {
    super(l('ExactPhrase'));
  }

  public getValue(): string {
    let value = super.getValue();
    return value ? '\"' + value + '\"' : '';
  }
}
