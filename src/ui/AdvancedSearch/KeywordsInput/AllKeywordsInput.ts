import { KeywordsInput } from './KeywordsInput';
import { l } from '../../../strings/Strings';

export class AllKeywordsInput extends KeywordsInput {
  constructor() {
    super(l('AllTheseWords'));
  }
}
