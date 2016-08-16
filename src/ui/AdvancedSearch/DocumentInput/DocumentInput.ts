import {IAdvancedSearchInput} from '../AdvancedSearchInput';
import {QueryBuilder} from '../../Base/QueryBuilder';
import {l} from '../../../strings/Strings';
import {$$} from '../../../utils/Dom';

export class DocumentInput implements IAdvancedSearchInput {

  constructor(public inputName: string) {
  }

  public build(): HTMLElement {
    let documentInput = $$('div', { className: 'coveo-advanced-search-document-input-section' });
    let label = $$('span', { className: 'coveo-advanced-search-label' });
    label.text(this.inputName);
    documentInput.append(label.el);
    return documentInput.el;
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
