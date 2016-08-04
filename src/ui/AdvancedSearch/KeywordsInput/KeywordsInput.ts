import {IAdvancedSearchInput} from '../AdvancedSearchInput';
import {QueryStateModel} from '../../../models/QueryStateModel';
import {TextInput} from '../Form/TextInput';
import {l} from '../../../strings/Strings';

export class KeywordsInput implements IAdvancedSearchInput {

  protected input: TextInput;

  constructor(public inputName: string) {
  }

  public build(): HTMLElement {
    this.input = new TextInput(l(this.inputName + 'Label'));
    return this.input.getElement();
  }

  public getValue(): string {
    return this.input.getValue();
  }

  public clear() {
    this.input.setValue('');
  }

  public updateQueryState(queryState: QueryStateModel) {
    let query = queryState.get(QueryStateModel.attributesEnum.q);
    let value = this.getValue();
    if (value) {
      query += query ? ' (' + value + ')' : value;
    }
    queryState.set(QueryStateModel.attributesEnum.q, query);
    this.clear();
  }
}
