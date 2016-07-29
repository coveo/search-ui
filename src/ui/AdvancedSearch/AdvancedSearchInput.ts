import {QueryStateModel} from '../../models/QueryStateModel';
import {QueryBuilder} from '../Base/QueryBuilder';

export interface IAdvancedSearchInput {
  build: () => HTMLElement,
  updateQueryState?: (queryState: QueryStateModel) => void;
  updateQuery?: (queryBuilder: QueryBuilder) => void;
}

export interface IAdvancedSearchSection {
  name: string,
  inputs: IAdvancedSearchInput[]
}
