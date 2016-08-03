import {ComponentOptions} from '../Base/ComponentOptions';
import {IAdvancedSearchInput} from './AdvancedSearchInput';
import {ISearchEndpoint} from '../../rest/SearchEndpointInterface';
import {IIndexFieldValue} from '../../rest/FieldValue';
import {QueryBuilder} from '../Base/QueryBuilder';
import {Dropdown} from './Dropdown';
import {FacetUtils} from '../../ui/Facet/FacetUtils';
import {NumericSpinner} from './NumericSpinner';
import {TextInput} from './TextInput';
import {l} from '../../strings/Strings';
import {$$} from '../../utils/Dom';

export class DocumentInput implements IAdvancedSearchInput {
  public build(): HTMLElement {
    return $$('div', { className: 'coveo-advanced-search-document-input-section' }).el;
  }

  public getValue(): string {
    return '';
  }

  public updateQuery(queryBuilder: QueryBuilder): void {
    let value = this.getValue();
    if (value) {
      queryBuilder.advancedExpression.add(this.getValue());
    }
  }
}

export class SimpleFieldInput extends DocumentInput {

  protected element: HTMLElement
  private dropDown: Dropdown;

  constructor(public inputName: string, public fieldName: string, private endpoint: ISearchEndpoint) {
    super();
  }

  public build(): HTMLElement {
    let document = $$(super.build());
    let label = $$('span', { className: 'coveo-advanced-search-label' });
    label.text(l(this.inputName + 'Label'));
    document.append(label.el);
    this.buildFieldSelect().then(() => {
      document.append(this.dropDown.getElement());
    })
    this.element = document.el;
    return this.element;
  }

  public getValue(): string {
    let value = this.dropDown ? this.dropDown.getValue() : '';
    return value ? this.fieldName + '==\"' + value + '\"' : '';
  }

  private buildFieldSelect() {
    return this.endpoint.listFieldValues({ field: this.fieldName }).then((values: IIndexFieldValue[]) => {
      let options = [''];
      _.each(values, (value: IIndexFieldValue) => {
        options.push(value.value);
      })
      this.dropDown = new Dropdown(options, this.inputName, (str: string) => { return FacetUtils.tryToGetTranslatedCaption(this.fieldName, str) });
    });
  }

}

export class AdvancedFieldInput extends DocumentInput {

  protected element: HTMLElement
  private mode: Dropdown;

  constructor(public inputName: string, public fieldName: string) {
    super();
  }

  public build(): HTMLElement {
    let document = $$(super.build());
    let label = $$('span', { className: 'coveo-advanced-search-label' });
    label.text(l(this.inputName + 'Label'));
    document.append(label.el);
    document.append(new Dropdown(['Contains', 'DoesNotContain', 'Matches'], this.inputName).getElement());
    document.append(new TextInput().getElement());
    this.element = document.el;
    return this.element;
  }

  public getValue(): string {
    let inputValue = (<HTMLInputElement>$$(this.element).find('input')).value
    if (inputValue) {
      switch (this.mode.getValue()) {
        case 'Contains':
          return this.fieldName + '=' + inputValue;
        case 'DoesNotContain':
          return this.fieldName + '<>' + inputValue;
        default:
          return this.fieldName + '==\"' + inputValue + '\"';
      }
    }
    return '';
  }

}

export class SizeInput extends DocumentInput {

  protected element: HTMLElement;
  protected modeSelect: Dropdown;
  protected sizeInput: NumericSpinner;
  protected sizeSelect: Dropdown;

  public build(): HTMLElement {
    let document = $$(super.build());
    let label = $$('span', { className: 'coveo-advanced-search-label' });
    label.text(l('SizeLabel'));
    document.append(label.el);
    this.modeSelect = new Dropdown(['AtLeast', 'AtMost'], 'coveo-size-input-mode');
    document.append(this.modeSelect.getElement());
    this.sizeInput = new NumericSpinner();
    document.append(this.sizeInput.getElement());
    this.sizeSelect = new Dropdown(['KB', 'MB', 'Bytes'], 'coveo-size-input-select');
    document.append(this.sizeSelect.getElement());
    this.element = document.el;
    return this.element;
  }

  public getValue(): string {
    let size = this.getSizeInBytes();
    if (size) {
      switch (this.modeSelect.getValue()) {
        case 'AtLeast':
          return '@size>=' + this.getSizeInBytes()
        default:
          return '@size<=' + this.getSizeInBytes();
      }
    }
    return '';
  }

  private getSizeInBytes(): number {
    let size = this.sizeInput.getFloatValue();
    switch (this.sizeSelect.getValue()) {
      case 'KB':
        return size * 1024;
      case 'MB':
        return size * Math.pow(1024, 2)
      default:
        return size;
    }
  }

}
