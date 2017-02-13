import { IAdvancedSearchInput } from '../AdvancedSearchInput';
import { TextInput } from '../Form/TextInput';
import { QueryBuilder } from '../../Base/QueryBuilder';
import { AdvancedSearchEvents } from '../../../events/AdvancedSearchEvents';
import { $$ } from '../../../utils/Dom';

export class KeywordsInput implements IAdvancedSearchInput {

  protected input: TextInput;

  constructor(public inputName: string) {
  }

  public reset() {
    this.clear();
  }

  public build(): HTMLElement {
    this.input = new TextInput(this.onChange.bind(this), this.inputName);
    return this.input.getElement();
  }

  public setValue(value: string) {
    this.input.setValue(value);
  }

  public getValue(): string {
    return this.input.getValue();
  }

  public clear() {
    this.input.setValue('');
  }

  public updateQuery(queryBuilder: QueryBuilder) {
    let value = this.getValue();
    if (value) {
      queryBuilder.advancedExpression.add(value);
    }
  }

  protected onChange() {
    if (this.input) {
      $$(this.input.getElement()).trigger(AdvancedSearchEvents.executeAdvancedSearch);
    }
  }
}
