import {KeywordsInput} from './KeywordsInput';

export class ExactKeywordsInput extends KeywordsInput {
  constructor() {
    super('AdvancedSearchExact')
  }

  public getValue(): string {
    let value = super.getValue();
    return value ? '\"' + value + '\"' : '';
  }
}
