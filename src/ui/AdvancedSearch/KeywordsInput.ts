import {ComponentOptions} from '../Base/ComponentOptions';
import {IAdvancedSearchInput} from './AdvancedSearchInput';
import {QueryStateModel} from '../../models/QueryStateModel';
import {l} from '../../strings/Strings';
import {$$} from '../../utils/Dom'

export class KeywordsInput implements IAdvancedSearchInput {

  protected element: HTMLElement

  constructor(public inputName: string) {
  }

  public build(): HTMLElement {
    let sectionClassName = 'coveo-advanced-search-input-section';
    let keyword = $$('div', { className: sectionClassName });
    let label = $$('span', { className: 'coveo-advanced-search-keyword-label' });
    let input = $$('input', { className: 'coveo-advanced-search-keyword-input coveo-advanced-search-input' });
    label.text(l(this.inputName + 'Label'));
    keyword.append(label.el);
    keyword.append(input.el);
    this.element = keyword.el;
    return this.element;
  }

  public getValue(): string {
    let input = <HTMLInputElement>$$(this.element).find('input');
    return input.value;
  }

  public clear() {
    let input = <HTMLInputElement>$$(this.element).find('input');
    input.value = '';
  }

  public updateQueryState(queryState: QueryStateModel) {
    let query = queryState.get(QueryStateModel.attributesEnum.q);
    let value = this.getValue();
    if (value) {
      query += query ? ' (' + value + ')' : value;
    }
    queryState.set(QueryStateModel.attributesEnum.q, query);
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
