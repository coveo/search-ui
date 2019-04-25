import { FacetValueState } from './FacetValueState';

export interface IFacetResponseValue {
  value: string;
  state: FacetValueState;
  numberOfResults: number;
}

export interface IFacetResponse {
  facetId: string;
  field: string;
  moreValuesAvailable: boolean;
  values: IFacetResponseValue[];
}
