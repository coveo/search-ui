import { FacetValueState } from './FacetValueState';
import { FacetSortCriteria } from './FacetSortCriteria';

export interface IFacetRequestValue {
  value: string;
  state: FacetValueState;
}

export interface IFacetRequest {
  facetId: string;
  field: string;
  sortCriteria?: FacetSortCriteria;
  numberOfValues?: number;
  injectionDepth?: number;
  freezeCurrentValues?: boolean;
  currentValues?: IFacetRequestValue[];
  isFieldExpanded?: boolean;
}
