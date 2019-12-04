export interface ICategoryFacetResultValue {
  value: string;
  numberOfResults: number;
}

export interface ICategoryFacetResult {
  notImplemented?: boolean;
  field: string;
  values: ICategoryFacetResultValue[];
  parentValues: ICategoryFacetResultValue[];
}
