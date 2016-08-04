import {ComponentOptions} from '../Base/ComponentOptions';
import {IAdvancedSearchInput} from './AdvancedSearchInput';
import {QueryStateModel} from '../../models/QueryStateModel';
import {TextInput} from './TextInput';
import {l} from '../../strings/Strings';
import {$$} from '../../utils/Dom';

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

export class AllKeywordsInput extends KeywordsInput {
  constructor() {
    super('AdvancedSearchAll')
  }
}

export class ExactKeywordsInput extends KeywordsInput {
  constructor() {
    super('AdvancedSearchExact')
  }

  public getValue(): string {
    let value = super.getValue();
    return value ? '\"' + value + '\"' : '';
  }
}

export class AnyKeywordsInput extends KeywordsInput {
  constructor() {
    super('AdvancedSearchAny')
  }

  public getValue(): string {
    let value = super.getValue();
    let splitValues = value.split(' ');
    let generatedValue = '';
    _.each(splitValues, (splitValue) => {
      generatedValue += splitValue + ' OR '
    })
    generatedValue = generatedValue.substr(0, generatedValue.length - 4);
    return generatedValue;
  }
}

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
