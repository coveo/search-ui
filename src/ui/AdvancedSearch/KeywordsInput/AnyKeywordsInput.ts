import { KeywordsInput } from './KeywordsInput';
import { l } from '../../../strings/Strings';

export class AnyKeywordsInput extends KeywordsInput {
  constructor(public root: HTMLElement) {
    super(l('AnyOfTheseWords'), root);
  }

  public getValue() {
    const value = super.getValue();
    if (!value) {
      return '';
    }
    return super
      .getValue()
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(keyword => `"<@-${keyword}-@>"`)
      .join(' OR ');
  }
}
