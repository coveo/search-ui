export interface ICategoryFacetRequest {
  field: string;
  path?: string[];
  maximumNumberOfValues?: number;
  injectionDepth?: number;
  delimitingCharacter?: string;
}
