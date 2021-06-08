import { KeywordsInput } from './KeywordsInput';
import { l } from '../../../strings/Strings';

export class NoneKeywordsInput extends KeywordsInput {
  constructor(public root: HTMLElement) {
    super(l('NoneOfTheseWords'), root);
  }

  public getValue() {
    const value = super.getValue();
    if (!value) {
      return '';
    }
    return value
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(keyword => `NOT "<@-${keyword}-@>"`)
      .join(' ');
  }
}
