import { KeywordsInput } from './KeywordsInput';
import { l } from '../../../strings/Strings';

export class AllKeywordsInput extends KeywordsInput {
  constructor(public root: HTMLElement) {
    super(l('AllTheseWords'), root);
  }

  public getValue() {
    const value = super.getValue();
    if (!value) {
      return '';
    }
    return `<@-${value}-@>`;
  }
}
