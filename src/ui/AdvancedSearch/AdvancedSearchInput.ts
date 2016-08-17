import {QueryBuilder} from '../Base/QueryBuilder';

export interface IAdvancedSearchInput {
  build: () => HTMLElement,
  updateQuery: (queryBuilder: QueryBuilder) => void;
}

export interface IAdvancedSearchPrebuiltInput {
  name: string;
  options?: IFieldInputOptions;
}

export interface IFieldInputOptions {
  name: string;
  field: string;
}

export interface IAdvancedSearchSection {
  name: string,
  inputs: (IAdvancedSearchInput | IAdvancedSearchPrebuiltInput)[];
}
