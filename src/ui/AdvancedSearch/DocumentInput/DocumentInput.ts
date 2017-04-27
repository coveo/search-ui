import { IAdvancedSearchInput } from '../AdvancedSearchInput';
import { QueryBuilder } from '../../Base/QueryBuilder';
import { $$ } from '../../../utils/Dom';
import { AdvancedSearchEvents } from '../../../events/AdvancedSearchEvents';

export class DocumentInput implements IAdvancedSearchInput {

  protected element: HTMLElement;

  constructor(public inputName: string) {
  }

  public reset() {
  }

  public build(): HTMLElement {
    let documentInput = $$('div', { className: 'coveo-advanced-search-document-input-section' });
    let label = $$('span', { className: 'coveo-advanced-search-label' });
    label.text(this.inputName);
    documentInput.append(label.el);
    this.element = documentInput.el;
    return this.element;
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

  protected onChange() {
    if (this.element) {
      $$(this.element).trigger(AdvancedSearchEvents.executeAdvancedSearch);
    }
  }
}
