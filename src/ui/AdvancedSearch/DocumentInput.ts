import {ComponentOptions} from '../Base/ComponentOptions';
import {IAdvancedSearchInput} from './AdvancedSearchInput';
import {ISearchEndpoint} from '../../rest/SearchEndpointInterface';
import {IIndexFieldValue} from '../../rest/FieldValue';
import {FacetUtils} from '../Facet/FacetUtils';
import {l} from '../../strings/Strings';
import {$$} from '../../utils/Dom';

export class DocumentInput implements IAdvancedSearchInput {
  public build(): HTMLElement {
    return $$('div').el;
  }

  public getValue(): string {
    return '';
  }

  protected buildSelect(options: string[]): HTMLSelectElement {
    let select = $$('select', { className: 'coveo-advanced-search-select' });
    _.each(options, (option) => {
      let optionHTML = $$('option', { value: option })
      optionHTML.text(l(option))
      select.append(optionHTML.el);
    })
    return <HTMLSelectElement>select.el;
  }

  public shouldUpdateQueryState(): boolean {
    return false;
  }

  public shouldUpdateOnBuildingQuery(): boolean {
    return true;
  }
}

export class SimpleFieldInput extends DocumentInput {

  protected element: HTMLElement

  constructor(public inputName: string, public fieldName: string, private endpoint: ISearchEndpoint) {
    super();
  }

  public build(): HTMLElement {
    let sectionClassName = 'coveo-advanced-search-input-section';
    let document = $$('div', { className: sectionClassName });
    let label = $$('span', { className: 'coveo-advanced-search-label' });
    label.text(l(this.inputName + 'Label'));
    document.append(label.el);
    document.append(this.buildFieldSelect());
    this.element = document.el;
    return this.element;
  }

  public getValue(): string {
    let value = (<HTMLSelectElement>$$(this.element).find('select')).value;
    return value ? this.fieldName + '==\"' + value + '\"' : '';
  }

  private buildFieldSelect() {
    let select = $$('select', { className: 'coveo-advanced-search-select' });
    let defaultOption = <HTMLOptionElement>$$('option').el;
    defaultOption.value = '';
    select.append(defaultOption);
    this.endpoint.listFieldValues({ field: this.fieldName }).then((values: IIndexFieldValue[]) => {
      _.each(values, (value: IIndexFieldValue) => {
        let option = $$('option', { value: value.value });
        option.text(FacetUtils.tryToGetTranslatedCaption(this.fieldName, value.lookupValue));
        select.append(option.el);
      })
    });
    return select.el;
  }

}

export class AdvancedFieldInput extends DocumentInput {

  protected element: HTMLElement

  constructor(public inputName: string, public fieldName: string) {
    super();
  }

  public build(): HTMLElement {
    let sectionClassName = 'coveo-advanced-search-input-section';
    let document = $$('div', { className: sectionClassName });
    let label = $$('span', { className: 'coveo-advanced-search-label' });
    label.text(l(this.inputName + 'Label'));
    document.append(label.el);
    document.append(this.buildSelect(['Contains', 'DoesNotContain', 'Matches']));
    document.append($$('input', { className: 'coveo-advanced-search-input' }).el)
    this.element = document.el;
    return this.element;
  }

  public getValue(): string {
    let mode = (<HTMLSelectElement>$$(this.element).find('select')).value
    let inputValue = (<HTMLInputElement>$$(this.element).find('input')).value
    if (inputValue) {
      switch (mode) {
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

  protected element: HTMLElement
  protected modeSelect: HTMLSelectElement
  protected sizeInput: HTMLInputElement
  protected sizeSelect: HTMLSelectElement

  public build(): HTMLElement {
    let sectionClassName = 'coveo-advanced-search-input-section';
    let document = $$('div', { className: sectionClassName });
    let label = $$('span', { className: 'coveo-advanced-search-label' });
    label.text(l('SizeLabel'));
    document.append(label.el);
    this.modeSelect = this.buildSelect(['AtLeast', 'AtMost']);
    document.append(this.modeSelect);
    this.sizeInput = <HTMLInputElement>$$('input', { className: 'coveo-advanced-search-number-input' }).el;
    document.append(this.sizeInput);
    this.sizeSelect = this.buildSelect(['KB', 'MB', 'Bytes']);
    document.append(this.sizeSelect);
    this.element = document.el;
    return this.element;
  }

  public getValue(): string {
    let size = this.getSizeInBytes();
    if (size) {
      switch (this.modeSelect.value) {
        case 'AtLeast':
          return '@size>=' + this.getSizeInBytes()
        default:
          return '@size<=' + this.getSizeInBytes();
      }
    }
    return '';
  }

  private getSizeInBytes(): number {
    let size = parseFloat(this.sizeInput.value);
    switch (this.sizeSelect.value) {
      case 'KB':
        return size * 1024;
      case 'MB':
        return size * Math.pow(1024, 2)
      default:
        return size;
    }
  }

}
