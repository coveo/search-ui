import { ICategoryFacetValue } from './CategoryFacetValue';

export interface ICategoryFacetResult {
  notImplemented?: boolean;
  field: string;
  values: ICategoryFacetValue[];
  parentValues: ICategoryFacetValue[];
}
