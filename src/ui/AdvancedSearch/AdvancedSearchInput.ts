import {QueryBuilder} from '../Base/QueryBuilder';

export interface IAdvancedSearchInput {
  build: () => HTMLElement,
  updateQuery: (queryBuilder: QueryBuilder) => void;
}

export interface IAdvancedSearchPrebuiltInput {
  name: string;
  parameters?: IFieldInputParameters;
}

export interface IFieldInputParameters {
  name: string;
  field: string;
}

export interface IAdvancedSearchSection {
  name: string,
  inputs: (IAdvancedSearchInput | IAdvancedSearchPrebuiltInput)[];
}
