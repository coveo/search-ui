import { IAdvancedSearchInput } from '../AdvancedSearchInput';
import { AdvancedSearchEvents } from '../../../events/AdvancedSearchEvents';
import { QueryBuilder } from '../../Base/QueryBuilder';
import { $$ } from '../../../utils/Dom';
import { RadioButton } from '../../FormWidgets/RadioButton';
import * as _ from 'underscore';

export class DateInput implements IAdvancedSearchInput {

  protected element: HTMLElement;
  private radio: RadioButton;
  private error: HTMLElement;

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
    try {
      let value = this.getValue();
      if (value) {
        queryBuilder.advancedExpression.add(this.getValue());
      }
      this.hideError();
    } catch (error) {
      this.showError(error);
    }
  }

  protected getRadio(): HTMLInputElement {
    return <HTMLInputElement>$$(this.element).find('input');
  }


  private showError(message: string) {
    if (this.error) {
      this.hideError();
    }
    this.error = $$('div', {
      className: 'coveo-error coveo-error-date-input'
    }, message).el;
    $$(this.element).append(this.error);
  }

  private hideError() {
    if (this.error) {
      $$(this.error).remove();
    }
  }

  private buildContent() {
    this.radio = new RadioButton(() => {
      this.deactivateAllInputs();
      this.activateSelectedInput();
    }, this.inputName, 'coveo-advanced-search-date-input');
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
