export interface ICategoryFacetsRequest {
  field: string;
  path: string[];
  maximumNumberOfValues: number;
  injectionDepth: number;
}
