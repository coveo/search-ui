import { KeywordsInput } from './KeywordsInput';
import { l } from '../../../strings/Strings';

export class ExactKeywordsInput extends KeywordsInput {
  constructor(public root: HTMLElement) {
    super(l('ExactPhrase'), root);
  }

  public getValue() {
    const value = super.getValue();
    if (!value) {
      return '';
    }
    return `"<@-${value}-@>"`;
  }
}
