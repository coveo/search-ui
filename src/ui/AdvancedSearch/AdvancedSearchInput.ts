import {QueryBuilder} from '../Base/QueryBuilder';

export interface IAdvancedSearchInput {
  build: () => HTMLElement,
  updateQuery?: (queryBuilder: QueryBuilder) => void;
}

export interface IAdvancedSearchSection {
  name: string,
  inputs: IAdvancedSearchInput[]
}
