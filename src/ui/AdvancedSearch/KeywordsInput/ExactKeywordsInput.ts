import { KeywordsInput } from './KeywordsInput';
import { l } from '../../../strings/Strings';

export class ExactKeywordsInput extends KeywordsInput {
  constructor(public root: HTMLElement) {
    super(l('ExactPhrase'), root);
  }

  public getValue(): string {
    let value = super.getValue();
    return value ? '"' + value + '"' : '';
  }
}
