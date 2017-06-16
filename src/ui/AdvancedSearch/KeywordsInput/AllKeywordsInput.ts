import { KeywordsInput } from './KeywordsInput';
import { l } from '../../../strings/Strings';

export class AllKeywordsInput extends KeywordsInput {
  constructor(public root: HTMLElement) {
    super(l('AllTheseWords'), root);
  }
}
