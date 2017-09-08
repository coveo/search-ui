import { Dropdown } from '../../FormWidgets/Dropdown';
import { FacetUtils } from '../../../ui/Facet/FacetUtils';
import { IIndexFieldValue } from '../../../rest/FieldValue';
import { ISearchEndpoint } from '../../../rest/SearchEndpointInterface';
import { DocumentInput } from './DocumentInput';
import { $$ } from '../../../utils/Dom';
import * as _ from 'underscore';
import { QueryBuilder } from '../../Base/QueryBuilder';

export class SimpleFieldInput extends DocumentInput {
  protected element: HTMLElement;
  public dropDown: Dropdown;

  constructor(public inputName: string, public fieldName: string, private endpoint: ISearchEndpoint, public root: HTMLElement) {
    super(inputName, root);
  }

  public reset() {
    this.dropDown.reset();
  }

  public build(): HTMLElement {
    let fieldInput = $$(super.build());
    this.buildFieldSelect().then(() => {
      fieldInput.append(this.dropDown.getElement());
    });
    this.element = fieldInput.el;
    return this.element;
  }

  public getValue(): string {
    let value = this.dropDown ? this.dropDown.getValue() : '';
    let queryBuilder = new QueryBuilder();
    if (value) {
      queryBuilder.advancedExpression.addFieldExpression(this.fieldName, '==', [value]);
      return queryBuilder.build().aq;
    } else {
      return '';
    }
  }

  private buildFieldSelect() {
    return this.endpoint
      .listFieldValues({
        field: this.fieldName,
        maximumNumberOfValues: 50
      })
      .then((values: IIndexFieldValue[]) => {
        let options = [''];
        _.each(values, (value: IIndexFieldValue) => {
          options.push(value.value);
        });
        this.dropDown = new Dropdown(this.onChange.bind(this), options, (str: string) => {
          return FacetUtils.tryToGetTranslatedCaption(this.fieldName, str);
        });
      });
  }
}
