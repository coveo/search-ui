import {KeywordsInput} from './KeywordsInput';

export class NoneKeywordsInput extends KeywordsInput {
  constructor() {
    super('AdvancedSearchNone')
  }

  public getValue(): string {
    let value = super.getValue();
    let generatedValue = '';

    if (value) {
      let splitValues = value.split(' ');
      _.each(splitValues, (splitValue) => {
        generatedValue += ' NOT ' + splitValue
      })
      generatedValue = generatedValue.substr(1);
    }

    return generatedValue;
  }
}
