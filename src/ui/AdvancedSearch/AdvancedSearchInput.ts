import {QueryBuilder} from '../Base/QueryBuilder';

export interface IAdvancedSearchInput {
  build: () => HTMLElement,
  updateQuery: (queryBuilder: QueryBuilder) => void;
}

export interface IAdvancedSearchDefaultInput {
  name: string;
  options: IFieldInputOptions;
}

export interface IFieldInputOptions {
  name: string;
  field: string;
}

export interface IAdvancedSearchSection {
  name: string,
  inputs: (IAdvancedSearchInput | IAdvancedSearchDefaultInput)[];
}
