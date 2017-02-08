import { IAdvancedSearchInput } from '../AdvancedSearchInput';
import { AdvancedSearchEvents } from '../../../events/AdvancedSearchEvents';
import { QueryBuilder } from '../../Base/QueryBuilder';
import { $$ } from '../../../utils/Dom';
import { RadioButton } from '../Form/RadioButton';
import _ = require('underscore');

export class DateInput implements IAdvancedSearchInput {

  protected element: HTMLElement;
  private radio: RadioButton;

  constructor(public inputName: string) {
    this.buildContent();
  }

  public reset() {
    this.radio.reset();
  }

  public build(): HTMLElement {
    return this.element;
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public getValue(): string {
    return '';
  }

  public isSelected(): boolean {
    return this.getRadio().checked;
  }

  public updateQuery(queryBuilder: QueryBuilder) {
    let value = this.getValue();
    if (value) {
      queryBuilder.advancedExpression.add(this.getValue());
    }
  }

  protected getRadio(): HTMLInputElement {
    return <HTMLInputElement>$$(this.element).find('input');
  }

  private buildContent() {
    this.radio = new RadioButton(() => {
      this.deactivateAllInputs();
      this.activateSelectedInput();
    }, this.inputName);
    this.element = this.radio.getElement();
    $$(this.element).addClass('coveo-advanced-search-date-input-section');
    $$(this.radio.getRadio()).addClass('coveo-advanced-search-date');
    $$(this.radio.getLabel()).addClass('coveo-advanced-search-label');
  }

  private deactivateAllInputs() {
    let elements = $$(this.element.parentElement).findAll('fieldset');
    _.each(elements, (element) => {
      (<HTMLInputElement>element).disabled = true;
    });
  }

  private activateSelectedInput() {
    let elements = $$(this.element).findAll('fieldset');
    _.each(elements, (element) => {
      (<HTMLInputElement>element).disabled = false;
    });
  }

  protected onChange() {
    if (this.element) {
      $$(this.element).trigger(AdvancedSearchEvents.executeAdvancedSearch);
    }
  }
}
